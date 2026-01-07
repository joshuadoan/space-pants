import { Actor, Timer } from "excalibur";
import {
  MeepleRoles,
  type MeepleInventory,
  type MeepleState,
  type MeepleAction,
  type MeepleTransaction,
  type Condition,
  ConditionType,
  Operator,
  MeepleStateNames,
} from "../types";
import type { Game } from "./Game";

export class Meeple extends Actor {
  speed: number = 100;
  roleId: MeepleRoles;
  lastUpdate: number = 0;
  conditions: Condition[] = [];
  state: MeepleState = { type: MeepleStateNames.Idle };
  inventory: MeepleInventory;
  actionsHistory: {
    action: MeepleAction;
    timestamp: number;
    state: MeepleState;
  }[] = [];
  constructor({
    width,
    height,
    roleId,
    inventory,
  }: {
    width: number;
    height: number;
    roleId: MeepleRoles;
    inventory: MeepleInventory;
    conditions: Condition[];
  }) {
    super({
      width,
      height,
    });

    this.roleId = roleId;
    this.inventory = inventory;
  }

  onInitialize(game: Game): void {
    const timer = this.traderTimer(game);

    game.currentScene.add(timer);
    timer.start();
  }
  traderTimer(game: Game): Timer {
    const timer = new Timer({
      fcn: () => {
        if (this.actions.getQueue().hasNext()) {
          return;
        }

        for (const condition of this.conditions) {
          if (this.evaluateCondition(condition)) {
            condition.action(this, game);
            break;
          }
        }
      },
      repeats: true,
      // randomize the interval between 100 and 1000
      interval: Math.floor(Math.random() * 900) + 100,
    });

    return timer;
  }

  dispatch(action: MeepleAction) {
    switch (action.type) {
      case "travel":
        this.state = {
          type: MeepleStateNames.Traveling,
          target: action.target,
        };
        break;
      case "visit":
        this.state = { type: MeepleStateNames.Visiting, target: action.target };
        break;
      case "transact":
        this.transact(action.transaction);
        this.state = {
          type: MeepleStateNames.Transacting,
          transaction: action.transaction,
        };
        break;
      default:
        break;
    }

    this.addActionHistory({
      action,
      timestamp: Date.now(),
      state: this.state,
    });
  }

  evaluateCondition(condition: Condition) {
    if (condition.type === ConditionType.Inventory) {
      const inventory = this.inventory[condition.property];
      const quantity = condition.quantity;
      const operator = condition.operator;

      switch (operator) {
        case Operator.LessThan:
          return inventory < quantity;
        case Operator.GreaterThan:
          return inventory > quantity;
          return false;
        case Operator.GreaterThanOrEqual:
          return inventory >= quantity;
        case Operator.NotEqual:
          return inventory !== quantity;
      }
    }
  }

  // dispatch(action: MeepleAction) {
  //   this.addActionHistory({
  //     action,
  //     timestamp: Date.now(),
  //     state: this.state,
  //   });

  //   const previousState = this.state;
  //   switch (action.type) {
  //     case "travel":
  //       this.state = { type: "traveling", target: action.target };
  //       this.actions
  //         .moveTo(action.target.pos, this.speed)
  //         .callMethod(() => {
  //           this.dispatch({ type: "visit", target: action.target });
  //         })
  //         .delay(DEFAULT_DELAY);
  //       break;
  //     case "transact":
  //       this.state = { type: "transacting", transaction: action.transaction };
  //       this.actions
  //         .callMethod(() => {
  //           this.transact(action.transaction);
  //         })
  //         .delay(DEFAULT_DELAY)
  //         .callMethod(() => {
  //           this.state = previousState;
  //         });
  //       break;
  //     case "visit":
  //       this.state = { type: "visiting", target: action.target };
  //       break;
  //   }
  // }

  delay(delay: number) {
    return this.actions.delay(delay);
  }

  // addActionHistory // store last 100 actions
  addActionHistory({
    action,
    timestamp,
    state,
  }: {
    action: MeepleAction;
    timestamp: number;
    state: MeepleState;
  }) {
    this.actionsHistory.push({
      action,
      timestamp,
      state,
    });

    if (this.actionsHistory.length > 100) {
      this.actionsHistory.shift();
    }
  }

  transact(transaction: MeepleTransaction) {
    transaction.from.inventory[transaction.property] -= transaction.quantity;
    transaction.to.inventory[transaction.property] += transaction.quantity;
  }
}
