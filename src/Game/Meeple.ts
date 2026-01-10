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
  MeepleInventoryItem,
} from "../types";
import type { Game } from "./Game";

export class Meeple extends Actor {
  speed: number = 100;
  roleId: MeepleRoles;
  lastUpdate: number = 0;
  conditions: Condition[] = [];
  state: MeepleState = { type: MeepleStateNames.Idle };
  home: Meeple | null = null;
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
    conditions,
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
    this.conditions = conditions;
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
      case "mine":
        this.mine(action.target, action.property, action.quantity);
        this.state = {
          type: MeepleStateNames.Mining,
          target: action.target,
          property: action.property,
          quantity: action.quantity,
        };
        break;
      case "buy":
        this.buy(action.target, action.property, action.quantity);
        this.state = {
          type: MeepleStateNames.Buying,
          target: action.target,
          property: action.property,
          quantity: action.quantity,
        };
        break;
      case "sell":
        this.sell(action.target, action.property, action.quantity);
        this.state = {
          type: MeepleStateNames.Selling,
          target: action.target,
          property: action.property,
          quantity: action.quantity,
        };
        break;
      case "transmutation":
        this.transmutation(
          action.fromProperty,
          action.fromQuantity,
          action.toProperty,
          action.toQuantity
        );
        this.state = {
          type: MeepleStateNames.Transmuting,
          fromProperty: action.fromProperty,
          toProperty: action.toProperty,
          fromQuantity: action.fromQuantity,
          toQuantity: action.toQuantity,
        };
        break;
      case "generate":
        this.generate(action.property, action.quantity);
        this.state = {
          type: MeepleStateNames.Generating,
          property: action.property,
          quantity: action.quantity,
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
      const inventory = condition.target
        ? condition.target.inventory[condition.property]
        : this.inventory[condition.property];

      const quantity = condition.quantity;
      const operator = condition.operator;

      switch (operator) {
        case Operator.LessThan:
          return inventory < quantity;
        case Operator.GreaterThan:
          return inventory > quantity;
        case Operator.GreaterThanOrEqual:
          return inventory >= quantity;
        case Operator.LessThanOrEqual:
          return inventory <= quantity;
        case Operator.Equal:
          return inventory === quantity;
        case Operator.NotEqual:
          return inventory !== quantity;
        default:
          return false;
      }
    }
    return false;
  }

  setInventory(inventory: MeepleInventory) {
    this.inventory = { ...inventory };
  }

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
    if (transaction.from) {
      transaction.from.setInventory({
        ...transaction.from.inventory,
        [transaction.property]:
          transaction.from.inventory[transaction.property] -
          transaction.quantity,
      });
    }

    if (transaction.to) {
      transaction.to.setInventory({
        ...transaction.to.inventory,
        [transaction.property]:
          transaction.to.inventory[transaction.property] + transaction.quantity,
      });
    }
  }

  buy(seller: Meeple, property: MeepleInventoryItem, quantity: number) {
    const PRICES = {
      [MeepleInventoryItem.Minirals]: 1,
      [MeepleInventoryItem.Fizzy]: 1,
      [MeepleInventoryItem.Money]: 1,
    };

    const price = PRICES[property];

    // update buyer's inventory
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] + quantity,
      [MeepleInventoryItem.Money]:
        this.inventory[MeepleInventoryItem.Money] - price * quantity,
    });

    // update seller's inventory
    seller.setInventory({
      ...seller.inventory,
      [property]: seller.inventory[property] - quantity,
      [MeepleInventoryItem.Money]:
        seller.inventory[MeepleInventoryItem.Money] + price * quantity,
    });
  }

  sell(buyer: Meeple, property: MeepleInventoryItem, quantity: number) {
    const PRICES = {
      [MeepleInventoryItem.Minirals]: 1,
      [MeepleInventoryItem.Fizzy]: 2,
      [MeepleInventoryItem.Money]: 1,
    };

    const price = PRICES[property];

    // Seller loses property and gains money
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] - quantity,
      [MeepleInventoryItem.Money]:
        this.inventory[MeepleInventoryItem.Money] + price * quantity,
    });

    // Buyer gains property and loses money
    buyer.setInventory({
      ...buyer.inventory,
      [property]: buyer.inventory[property] + quantity,
      [MeepleInventoryItem.Money]:
        buyer.inventory[MeepleInventoryItem.Money] - price * quantity,
    });
  }

  mine(target: Meeple, property: MeepleInventoryItem, quantity: number) {
    // Target loses quantity, miner gains quantity
    target.setInventory({
      ...target.inventory,
      [property]: target.inventory[property] - quantity,
    });
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] + quantity,
    });
  }
  transmutation(
    fromProperty: MeepleInventoryItem,
    fromQuantity: number,
    toProperty: MeepleInventoryItem,
    toQuantity: number
  ) {
    // Lose source material, gain converted material
    this.setInventory({
      ...this.inventory,
      [fromProperty]: this.inventory[fromProperty] - fromQuantity,
      [toProperty]: this.inventory[toProperty] + toQuantity,
    });
  }

  generate(property: MeepleInventoryItem, quantity: number) {
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] + quantity,
    });
  }
}
