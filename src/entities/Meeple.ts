import { Actor, Vector, Graphic, Timer } from "excalibur";
import type { Game } from "./Game";
import type { Condition, RoleId, RuleTemplate } from "./types";

export enum GoodType {
  Ore = "ore",
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

export type MeepleState = MeepleStateIdle;

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

  dispatch(action: MeepleAction): void {
    switch (action.type) {
      case "finish":
        this.state = {
          type: "idle",
        };
        break;
      case "travel-to":
        this.actions.callMethod(() => {
          if (action.payload.target) {
            this.actions.moveTo(action.payload.target.pos, this.speed);
          }
        });
        break;
      case "transact":
        this.transact(action.payload);
        break;
      default:
        break;
    }
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
}
