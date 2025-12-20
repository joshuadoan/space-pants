import { Actor, Vector, Graphic, Timer } from "excalibur";
import type { Game } from "./Game";
import { RoleId } from "./types";

export enum MiningType {
  Ore = "ore",
}

export enum ProductType {
  Gruffle = "gruffle",
}

export enum CurrencyType {
  Money = "money",
}

export enum VitalsType {
  Health = "health",
  Energy = "energy",
  Happiness = "happiness",
}

export type Stats = {
  [key in VitalsType]: number;
};

export type Inventory = {
  [key in MiningType | ProductType | CurrencyType]: number;
};

export enum MeepleStateType {
  Idle = "idle",
  Traveling = "traveling",
  Transacting = "transacting",
  VisitingTarget = "visiting",
}

export type MeepleStateIdle = {
  type: MeepleStateType.Idle;
};

export type MeepleStateVisitingTarget = {
  type: MeepleStateType.VisitingTarget;
  target: Meeple;
};

export type MeepleStateTraveling = {
  type: MeepleStateType.Traveling;
  target: Meeple;
};

export type MeepleStateTransacting = {
  type: MeepleStateType.Transacting;
  good: MiningType | ProductType | CurrencyType;
  quantity: number;
  transactionType: "add" | "remove";
  target: Meeple;
};

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateTraveling
  | MeepleStateVisitingTarget
  | MeepleStateTransacting;

export enum MeepleActionType {
  TravelTo = "travel-to",
  Transact = "transact",
  VisitTarget = "visit-target",
}

export type MeepleActionVisitTarget = {
  type: MeepleActionType.VisitTarget;
  payload: {
    target: Meeple;
  };
};

export type MeepleActionTravelTo = {
  type: MeepleActionType.TravelTo;
  payload: {
    target: Meeple;
  };
};

export type Transaction = {
  good: MiningType | ProductType | CurrencyType;
  quantity: number;
  transactionType: "add" | "remove";
  target: Meeple;
};

export type IventoryGenerator = {
  good: MiningType | ProductType | CurrencyType;
  minimum: number;
  maximum: number;
  perSecond: number;
};

export type MeepleActionTransact = {
  type: MeepleActionType.Transact;
  payload: Transaction;
};

export type MeepleAction =
  | MeepleActionTravelTo
  | MeepleActionTransact
  | MeepleActionVisitTarget;

export type MeepleProps = {
  position: Vector;
  graphic: Graphic;
  name: string;
  state: MeepleState;
  stats: Stats;
  inventory: Inventory;
  inventoryGenerators: IventoryGenerator[];
  speed: number;
  roleId: RoleId;
};

/**
 * Common threshold values for rules
 */
export const COMMON_THRESHOLDS = [0, 1, 5, 10, 20, 30, 40, 50] as const;

export class Meeple extends Actor {
  // Identity & State
  roleId: RoleId;
  state: MeepleState;

  // Gameplay Properties
  stats: Stats;
  inventory: Inventory;
  inventoryGenerators: IventoryGenerator[];
  speed: number;

  // Internal/Private Properties
  private timers: Timer[] = [];

  constructor({
    position,
    graphic,
    name,
    roleId,
    state,
    stats,
    inventory,
    inventoryGenerators,
    speed,
  }: MeepleProps) {
    super({
      pos: position,
    });

    // Base Actor setup
    this.graphics.add(graphic);
    this.name = name;

    // Identity & State
    this.roleId = roleId;
    this.state = state;

    // Gameplay Properties
    this.stats = stats;
    this.inventory = inventory;
    this.inventoryGenerators = inventoryGenerators;
    this.speed = speed;
  }

  onInitialize(game: Game): void {
    this.initGenerators(game);
    // this.initRulesTimer(game);

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

  setState(state: MeepleState): void {
    this.state = state;
  }

  dispatch(action: MeepleAction): void {
    switch (action.type) {
      case MeepleActionType.TravelTo: {
        this.state = {
          type: MeepleStateType.Traveling,
          ...action.payload,
        };
        this.actions
          .moveTo(action.payload.target.pos, this.speed)
          .callMethod(() => {
            this.state = {
              type: MeepleStateType.VisitingTarget,
              ...action.payload,
            };
          });
        break;
      }
      case MeepleActionType.Transact: {
        this.state = {
          type: MeepleStateType.Transacting,
          ...action.payload,
        };
        break;
      }
      default:
        break;
    }
  }

  // initRulesTimer(game: Game): void {
  //   const timer = new Timer({
  //     fcn: () => {
  //       switch (this.roleId) {
  //         case RoleId.Miner: {

  //         }
  //         default: {
  //           break;
  //         }
  //       }
  //     },
  //     repeats: true,
  //     interval: 1000,
  //   });
  //   game.currentScene.add(timer);
  //   timer.start();
  // }

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
              type: MeepleActionType.Transact,
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
