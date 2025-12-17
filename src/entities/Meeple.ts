import { Actor, Vector, Graphic, Timer } from "excalibur";
import type { Game } from "./Game";
import type { Condition, RuleTemplate, Rule, RoleId } from "./types";
import { Operator } from "./types";

export enum GoodType {
  Ore = "ore",
  Money = "money",
}

export enum VitalsType {
  Health = "health",
  Energy = "energy",
  Happiness = "happiness",
}

export type Inventory = {
  [key in GoodType | VitalsType]: number;
};

export type MeepleStateIdle = {
  type: "idle";
};

export type MeepleStateTraveling = {
  type: "traveling",
  target: Meeple
}

export type MeepleStateTransacting = {
  type: "transacting";
  good: GoodType | VitalsType;
  quantity: number;
}

export type MeepleState = MeepleStateIdle | MeepleStateTraveling | MeepleStateTransacting;

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
    targetRoleId?: RoleId;
  };
};

export type Transaction = {
  good: GoodType | VitalsType;
  quantity: number;
  transactionType: "add" | "remove";
  target?: Meeple;
  targetRoleId?: RoleId;
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

export type MeepleProps = {
  position: Vector;
  graphic: Graphic;
  name: string;
  state: MeepleState;
  inventory: Inventory;
  inventoryGenerators: IventoryGenerator[];
  ruleTemplate: RuleTemplate;
  speed: number;
};

/**
 * Common threshold values for rules
 */
export const COMMON_THRESHOLDS = [0, 1, 5, 10, 20, 30, 40, 50] as const;

export class Meeple extends Actor {
  state: MeepleState;
  inventory: Inventory;
  inventoryGenerators: IventoryGenerator[];
  ruleTemplate: RuleTemplate;
  speed: number;
  private timers: Timer[] = [];
  private isExecutingActions: boolean = false;

  constructor({
    position,
    graphic,
    name,
    state,
    inventory,
    inventoryGenerators,
    ruleTemplate,
    speed,
  }: MeepleProps) {
    super({
      pos: position,
    });

    this.graphics.add(graphic);
    this.name = name;
    this.state = state;
    this.inventory = inventory;
    this.inventoryGenerators = inventoryGenerators;
    this.ruleTemplate = ruleTemplate;
    this.speed = speed;
  }

  onInitialize(game: Game): void {
    this.initGenerators(game);
    this.initRuleEvaluationTimer(game);
  }

  onDestroy(): void {
    this.timers.forEach((timer) => {
      timer.cancel();
    });
  }

  transact(transaction: Transaction): void {
    if (transaction.transactionType === "add") {
      this.inventory[transaction.good] += transaction.quantity;
    } else {
      this.inventory[transaction.good] -= transaction.quantity;
    }
  }

  /**
   * Resolves a target meeple from a RoleId if needed
   */
  private resolveTarget(target?: Meeple, targetRoleId?: RoleId): Meeple | undefined {
    if (target) return target;
    if (targetRoleId && this.scene?.engine) {
      const game = this.scene.engine as Game;
      return game.findRabdomMeepleByRoleId(targetRoleId);
    }
    return undefined;
  }

  dispatch(action: MeepleAction): void {
    switch (action.type) {
      case "finish":
        this.state = action.payload.state
        break;
      case "travel-to": {
        const target = this.resolveTarget(action.payload.target, action.payload.targetRoleId);
        if (!target) {
          return;
        }
        this.state = {
          type: "traveling",
          target: target
        }
        this.actions.moveTo(target.pos, this.speed)
        break;
      }
      case "transact": {
        // Always set state to transacting when executing a transaction
        // (even if we were traveling, we're now at the destination and transacting)
        this.state = {
          type: "transacting",
          good: action.payload.good,
          quantity: action.payload.quantity,
        };
        // If target is specified, transact on the target, otherwise transact on self
        const targetMeeple = this.resolveTarget(action.payload.target, action.payload.targetRoleId) || this;
        targetMeeple.transact(action.payload);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Executes a travel action and returns a promise-like callback for chaining
   * @param action The travel action to execute
   * @param onComplete Callback to execute when travel is complete
   */
  private executeTravelAction(action: MeepleActionTravelTo, onComplete: () => void): void {
    const target = this.resolveTarget(action.payload.target, action.payload.targetRoleId);
    if (!target) {
      onComplete();
      return;
    }
    this.state = {
      type: "traveling",
      target: target
    }
    this.actions
      .moveTo(target.pos, this.speed)
      .callMethod(() => {
        onComplete();
      });
  }

  initGenerators(game: Game): void {
    // Create timers for each inventory generator
    this.inventoryGenerators.forEach((generator) => {
      // Calculate interval: 1000ms / perSecond (e.g., 1 per second = 1000ms interval)
      const interval = 1000 / generator.perSecond;

      const timer = new Timer({
        fcn: () => {
          const currentCount = this.inventory[generator.good];

          // Only generate if current count is below maximum
          if (currentCount < generator.maximum) {
            // Dispatch transact action to add 1 unit
            this.dispatch({
              type: "transact",
              payload: {
                good: generator.good,
                quantity: 1,
                transactionType: "add",
                target: this,
              },
            });
          }
        },
        repeats: true,
        interval: interval,
      });

      this.timers.push(timer);

      game.currentScene.add(timer);
      timer.start();
    });
  }

  /**
   * Evaluates a single condition against the meeple's current inventory
   * @param condition The condition to evaluate
   * @returns True if the condition is met, false otherwise
   */
  private evaluateCondition(condition: Condition): boolean {
    // Resolve target dynamically if targetRoleId is specified
    let target: Meeple | undefined = condition.target;
    if (condition.targetRoleId && !target && this.scene?.engine) {
      const game = this.scene.engine as Game;
      target = game.findRabdomMeepleByRoleId(condition.targetRoleId);
    }
    
    // Check the target's inventory if specified, otherwise check this meeple's inventory
    // If target is required (target or targetRoleId specified) but undefined, the condition fails
    if ((condition.target !== undefined || condition.targetRoleId !== undefined) && !target) {
      return false;
    }
    const inventoryToCheck = target ? target.inventory : this.inventory;
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

  /**
   * Evaluates the rule template and returns applicable rules
   * @returns Array of rules whose conditions are currently met
   */
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
        // Transactions will set state to transacting when they execute
        if (remainingActions.length > 0) {
          this.runActions(remainingActions);
        } else {
          // If no more actions after travel, return to idle
          if (this.state.type === "traveling") {
            this.state = { type: "idle" };
          }
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
        // If no more actions and we were transacting, return to idle
        if (this.state.type === "transacting") {
          this.state = { type: "idle" };
        }
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

  /**
   * Initializes a timer to periodically evaluate rules
   * @param game The game instance
   */
  initRuleEvaluationTimer(game: Game): void {
    // Create a timer that evaluates rules every 2 seconds
    const ruleEvaluationTimer = new Timer({
      fcn: () => {
        // Only evaluate rules if the meeple is idle (not currently traveling or transacting)
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

  /**
   * Call a custom method on the meeple
   * @param methodName Name of the method to call
   * @param args Arguments to pass to the method
   */
  callMethod(methodName: string, ...args: any[]): void {
    if (typeof (this as any)[methodName] === 'function') {
      (this as any)[methodName](...args);
    } else {
      console.warn(`Method ${methodName} not found on Meeple`);
    }
  }
}
