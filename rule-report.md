# Rule System Flow Report

## Overview

This document analyzes the rule template, rules, and actions system in Space Pants, with a focus on debugging the miner flow issue where miners get stuck at the first asteroid with 1 ore.

## System Architecture

### 1. Rule Template System

**Location**: `src/utils/rules.ts` - `createRuleTemple()`

Rule templates are created per role (Miner, Asteroid, SpaceStore) and contain:
- `id`: RoleId enum value
- `name`: Human-readable name
- `rules`: Array of Rule objects

**Key Issue**: Rule templates are created **once per meeple** at initialization time. The template captures specific entity references (asteroid, spaceStore) at creation time, not dynamically.

```12:24:src/utils/rules.ts
export function createRuleTemple(game: Game, ruleId: RoleId): RuleTemplate {
  switch (ruleId) {
    case RoleId.Asteroid: {
      return {
        id: RoleId.Asteroid,
        name: "Asteroid",
        rules: [],
      };
    }
    case RoleId.Miner: {
      const asteroid = game.findRabdomMeepleByRoleId(RoleId.Asteroid);
      const spaceStore = game.findRabdomMeepleByRoleId(RoleId.SpaceStore);
```

### 2. Rule Structure

**Location**: `src/entities/types.ts`

```9:14:src/entities/types.ts
export type Rule = {
  id: string;
  name: string;
  conditions: Condition[];
  actions: MeepleAction[];
};
```

Each rule consists of:
- **id**: Unique identifier
- **name**: Human-readable name
- **conditions**: Array of conditions that must ALL be true for the rule to match
- **actions**: Array of actions to execute sequentially when the rule matches

### 3. Condition Evaluation

**Location**: `src/entities/Meeple.ts` - `evaluateCondition()` and `evaluateRuleConditions()`

```223:254:src/entities/Meeple.ts
  private evaluateCondition(condition: Condition): boolean {
    // Check the target's inventory if specified, otherwise check this meeple's inventory
    const inventoryToCheck = condition.target ? condition.target.inventory : this.inventory;
    const currentValue = inventoryToCheck[condition.good];
    const targetValue = condition.value;

    switch (condition.operator) {
      case Operator.Equal:
        return currentValue === targetValue;
      case Operator.LessThan:
        return currentValue < targetValue;
      case Operator.GreaterThan:
        return currentValue > targetValue;
      case Operator.LessThanOrEqual:
        return currentValue <= targetValue;
      case Operator.GreaterThanOrEqual:
        return currentValue >= targetValue;
      case Operator.NotEqual:
        return currentValue !== targetValue;
      default:
        return false;
    }
  }

  /**
   * Evaluates all conditions for a rule
   * @param rule The rule to evaluate
   * @returns True if all conditions are met, false otherwise
   */
  private evaluateRuleConditions(rule: Rule): boolean {
    return rule.conditions.every(condition => this.evaluateCondition(condition));
  }
```

**Flow**: 
1. Each condition checks either the meeple's own inventory or a target meeple's inventory
2. All conditions in a rule must be true (AND logic)
3. Returns true only if ALL conditions pass

### 4. Rule Evaluation Flow

**Location**: `src/entities/Meeple.ts` - `evaluateRuleTemplate()` and `evaluateAndRunActions()`

```260:329:src/entities/Meeple.ts
  evaluateRuleTemplate(): Rule[] {
    return this.ruleTemplate.rules.filter(rule => this.evaluateRuleConditions(rule));
  }

  /**
   * Executes multiple actions sequentially
   * @param actions Array of actions to execute
   */
  runActions(actions: MeepleAction[]): void {
    if (actions.length === 0) {
      this.isExecutingActions = false;
      return;
    }

    // Mark that we're executing actions
    this.isExecutingActions = true;

    const firstAction = actions[0];
    const remainingActions = actions.slice(1);

    // If the first action is a travel action, wait for it to complete before continuing
    if (firstAction.type === "travel-to") {
      this.executeTravelAction(firstAction, () => {
        // After travel completes, execute remaining actions
        if (remainingActions.length > 0) {
          this.runActions(remainingActions);
        } else {
          this.isExecutingActions = false;
        }
      });
    } else {
      // For non-travel actions, execute immediately
      this.dispatch(firstAction);

      // If there are more actions, execute them with a small delay
      // (for non-travel actions, we still want some sequencing)
      if (remainingActions.length > 0) {
        const actionTimer = new Timer({
          fcn: () => {
            this.runActions(remainingActions);
            actionTimer.cancel();
          },
          repeats: false,
          interval: 100, // Small delay for non-travel actions
        });

        this.timers.push(actionTimer);
        this.scene?.engine.addTimer(actionTimer);
        actionTimer.start();
      } else {
        this.isExecutingActions = false;
      }
    }
  }

  /**
   * Evaluates rule template and executes actions for applicable rules
   */
  evaluateAndRunActions(): void {
    // Don't evaluate rules if actions are already executing
    if (this.isExecutingActions) {
      return;
    }

    const applicableRules = this.evaluateRuleTemplate();
    // Only execute the first applicable rule to avoid conflicts
    if (applicableRules.length > 0) {
      this.runActions(applicableRules[0].actions);
    }
  }
```

**Flow**:
1. `evaluateRuleTemplate()` filters rules to find all that match current conditions
2. `evaluateAndRunActions()` executes the **first** matching rule only
3. Actions execute sequentially:
   - Travel actions wait for completion before continuing
   - Non-travel actions execute with 100ms delay between them
4. `isExecutingActions` flag prevents re-evaluation during action execution

### 5. Rule Evaluation Timer

**Location**: `src/entities/Meeple.ts` - `initRuleEvaluationTimer()`

```335:351:src/entities/Meeple.ts
  initRuleEvaluationTimer(game: Game): void {
    // Create a timer that evaluates rules every 2 seconds
    const ruleEvaluationTimer = new Timer({
      fcn: () => {
        // Only evaluate rules if the meeple is idle (not currently traveling)
        if (this.state.type === "idle") {
          this.evaluateAndRunActions();
        }
      },
      repeats: true,
      interval: 2000, // Evaluate rules every 2 seconds
    });

    this.timers.push(ruleEvaluationTimer);
    game.currentScene.add(ruleEvaluationTimer);
    ruleEvaluationTimer.start();
  }
```

**Flow**:
- Rules are evaluated every 2 seconds
- Only evaluates when meeple is in "idle" state
- If meeple is "traveling", rules are not evaluated

## Miner Rule Flow

### Current Miner Rules

**Location**: `src/utils/rules.ts` - Miner case

```21:149:src/utils/rules.ts
    case RoleId.Miner: {
      const asteroid = game.findRabdomMeepleByRoleId(RoleId.Asteroid);
      const spaceStore = game.findRabdomMeepleByRoleId(RoleId.SpaceStore);
      return {
        id: RoleId.Miner,
        name: "Miner",
        rules: [
          {
            id: "need-ore",
            name: "Need Ore",
            conditions: [
              {
                good: GoodType.Ore,
                operator: Operator.LessThanOrEqual,
                value: 0,
              },
            ],
            actions: [
              // travel to asteroid
              {
                type: "travel-to",
                payload: {
                  target: asteroid,
                },
              },
              // add ore to miner
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 1,
                  transactionType: "add",
                },
              },
              // remove ore from asteroid
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 1,
                  transactionType: "remove",
                  target: asteroid,
                },
              },
              // finish
              {
                type: "finish",
                payload: {
                  state: {
                    type: "idle"
                  }
                }
              }
            ],
          },
          {
            id: "sell-ore-to-store",
            name: "Sell Ore to SpaceStore",
            conditions: [
              {
                good: GoodType.Ore,
                operator: Operator.GreaterThanOrEqual,
                value: 14,
              },
              // Safety condition: SpaceStore must have enough money to buy the ore
              {
                good: GoodType.Money,
                operator: Operator.GreaterThanOrEqual,
                value: 14,
                target: spaceStore, // Check SpaceStore's money, not miner's
              },
            ],
            actions: [
              // travel to space store
              {
                type: "travel-to",
                payload: {
                  target: spaceStore,
                },
              },
              // transfer ore from miner to space store
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 14,
                  transactionType: "remove",
                },
              },
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 14,
                  transactionType: "add",
                  target: spaceStore,
                },
              },
              // transfer money from space store to miner (14 ore * 1 money/ore = 14 money)
              {
                type: "transact",
                payload: {
                  good: GoodType.Money,
                  quantity: 14,
                  transactionType: "remove",
                  target: spaceStore,
                },
              },
              {
                type: "transact",
                payload: {
                  good: GoodType.Money,
                  quantity: 14,
                  transactionType: "add",
                },
              },
              // finish
              {
                type: "finish",
                payload: {
                  state: {
                    type: "idle"
                  }
                }
              }
            ],
          },
        ],
      };
    }
```

### Expected Miner Flow

1. **Initial State**: Miner has 0 ore
2. **Rule 1 "need-ore" matches**: ore <= 0 is true
3. **Execute actions**:
   - Travel to asteroid
   - Add 1 ore to miner
   - Remove 1 ore from asteroid
   - Set state to idle
4. **After mining**: Miner has 1 ore
5. **Rule evaluation**:
   - "need-ore": ore <= 0 is **false** (miner has 1 ore)
   - "sell-ore-to-store": ore >= 14 is **false** (miner has 1 ore)
6. **Result**: No rules match → Miner stays idle

### The Problem

**Root Cause**: The miner only mines **1 ore** per rule execution, but needs **14 ore** to sell. After mining 1 ore, neither rule matches:
- `ore <= 0` is false (has 1 ore)
- `ore >= 14` is false (has 1 ore)

**Additional Issues**:

1. **Static Target Reference**: The asteroid and spaceStore are captured at rule template creation time. If that specific asteroid runs out of ore, the miner is stuck.

2. **No Continuation Logic**: The "need-ore" rule should continue mining until the miner has enough ore (>= 14), but it only mines once and stops.

3. **Rule Gap**: There's a gap between `ore <= 0` and `ore >= 14`. Miners with 1-13 ore have no matching rules.

## Action Execution Flow

### Action Types

**Location**: `src/entities/Meeple.ts`

```32:68:src/entities/Meeple.ts
export type MeepleActionFinish = {
  type: "finish";
  payload: {
    state: MeepleState;
  };
};

export type MeepleActionTravelTo = {
  type: "travel-to";
  payload: {
    target?: Meeple;
  };
};

export type Transaction = {
  good: GoodType | VitalsType;
  quantity: number;
  transactionType: "add" | "remove";
  target?: Meeple;
};

export type IventoryGenerator = {
  good: GoodType;
  minimum: number;
  maximum: number;
  perSecond: number;
};

export type MeepleActionTransact = {
  type: "transact";
  payload: Transaction;
};

export type MeepleAction =
  | MeepleActionFinish
  | MeepleActionTravelTo
  | MeepleActionTransact;
```

### Action Dispatch

**Location**: `src/entities/Meeple.ts` - `dispatch()`

```137:160:src/entities/Meeple.ts
  dispatch(action: MeepleAction): void {
    switch (action.type) {
      case "finish":
        this.state = action.payload.state
        break;
      case "travel-to":
        if (!action.payload.target) {
          return;
        }
        this.state = {
          type: "traveling",
          target: action.payload.target
        }
        this.actions.moveTo(action.payload.target.pos, this.speed)
        break;
      case "transact":
        // If target is specified, transact on the target, otherwise transact on self
        const targetMeeple = action.payload.target || this;
        targetMeeple.transact(action.payload);
        break;
      default:
        break;
    }
  }
```

**Flow**:
- `finish`: Sets meeple state (typically to "idle")
- `travel-to`: Sets state to "traveling" and moves to target position
- `transact`: Adds or removes goods from inventory (self or target)

### Travel Action Execution

**Location**: `src/entities/Meeple.ts` - `executeTravelAction()`

```167:181:src/entities/Meeple.ts
  private executeTravelAction(action: MeepleActionTravelTo, onComplete: () => void): void {
    if (!action.payload.target) {
      onComplete();
      return;
    }
    this.state = {
      type: "traveling",
      target: action.payload.target
    }
    this.actions
      .moveTo(action.payload.target.pos, this.speed)
      .callMethod(() => {
        onComplete();
      });
  }
```

**Flow**:
- Sets state to "traveling"
- Uses Excalibur's action system to move to target
- Calls `onComplete` callback when movement finishes
- This allows sequential action execution after travel completes

## Complete Execution Flow Diagram

```
Timer (every 2 seconds)
  ↓
Check: Is meeple idle?
  ↓ Yes
evaluateAndRunActions()
  ↓
Check: Is isExecutingActions true?
  ↓ No
evaluateRuleTemplate()
  ↓
Filter rules where ALL conditions are true
  ↓
Take first matching rule
  ↓
runActions(rule.actions)
  ↓
For each action:
  - If travel-to: executeTravelAction() → wait for completion → continue
  - If transact: dispatch() → wait 100ms → continue
  - If finish: dispatch() → set state to idle → done
  ↓
Set isExecutingActions = false
  ↓
Wait for next timer tick (2 seconds)
```

## Identified Issues

### Issue 1: Miner Gets Stuck After Mining 1 Ore

**Problem**: Miner mines 1 ore, then no rules match (ore = 1, neither `<= 0` nor `>= 14`)

**Root Cause**: Rule gap between 0 and 14 ore. The "need-ore" rule should continue mining until ore >= 14.

**Potential Solutions**:
1. Change "need-ore" condition to `ore < 14` instead of `ore <= 0`
2. Add a new rule for `0 < ore < 14` that continues mining
3. Make the mining action loop until ore >= 14 (but this breaks the rule-based system)

### Issue 2: Static Target References

**Problem**: Asteroid and spaceStore are captured once at rule template creation. If that asteroid runs out of ore, the miner can't find a new one.

**Root Cause**: `findRabdomMeepleByRoleId()` is called once during template creation, not dynamically during rule evaluation.

**Potential Solutions**:
1. Evaluate targets dynamically during rule evaluation (find asteroid/spaceStore when rule matches)
2. Store target search logic in the rule itself (e.g., "find any asteroid with ore > 0")
3. Use a condition to check if target has resources before executing actions

### Issue 3: No Validation Before Mining

**Problem**: The miner doesn't check if the asteroid has ore before attempting to mine.

**Root Cause**: No condition checking asteroid's ore inventory before executing mining actions.

**Potential Solutions**:
1. Add condition: `{ good: GoodType.Ore, operator: Operator.GreaterThan, value: 0, target: asteroid }`
2. This would prevent the rule from matching if the asteroid has no ore

### Issue 4: Rule Evaluation Only When Idle

**Problem**: Rules are only evaluated when meeple is idle. If a meeple finishes actions but state isn't set to idle properly, rules won't re-evaluate.

**Root Cause**: Timer callback checks `this.state.type === "idle"` before evaluating.

**Note**: This is likely intentional to prevent rule conflicts during travel, but could cause issues if state isn't properly reset.

## Recommended Fixes

### Fix 1: Change Mining Condition

Change the "need-ore" rule condition from `ore <= 0` to `ore < 14`:

```typescript
conditions: [
  {
    good: GoodType.Ore,
    operator: Operator.LessThan,  // Changed from LessThanOrEqual
    value: 14,                    // Changed from 0
  },
]
```

This ensures the miner continues mining until it has 14 ore.

### Fix 2: Add Asteroid Ore Check

Add a condition to verify the asteroid has ore before mining:

```typescript
conditions: [
  {
    good: GoodType.Ore,
    operator: Operator.LessThan,
    value: 14,
  },
  {
    good: GoodType.Ore,
    operator: Operator.GreaterThan,
    value: 0,
    target: asteroid,  // Check asteroid's inventory
  },
]
```

### Fix 3: Dynamic Target Finding

Instead of capturing asteroid/spaceStore at template creation, find them dynamically during rule evaluation. This requires refactoring the rule system to support dynamic target resolution.

## Conclusion

The miner flow breaks because:
1. The "need-ore" rule only matches when `ore <= 0`
2. After mining 1 ore, the miner has `ore = 1`
3. Neither rule matches (`ore <= 0` is false, `ore >= 14` is false)
4. Miner stays idle with no matching rules

The fix is to change the mining condition to `ore < 14` so miners continue mining until they have enough ore to sell.

