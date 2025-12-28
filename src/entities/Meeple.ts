import { Actor, Vector, Graphic, Timer } from "excalibur";
import type { Game } from "./Game";
import {
  CurrencyType,
  MiningType,
  ProductType,
  RoleId,
  VitalsType,
  type Instruction,
  type Transaction,
} from "./types";
import { evaluateCondition } from "../utils/evaluateCondition";
import { GOODS_COSTS } from "../utils/instruction-templates";

const DEFAULT_DELAY = 3000;

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
  Visiting = "visiting",
}

export type MeepleStateIdle = {
  type: MeepleStateType.Idle;
  target?: Meeple;
};

export type MeepleStateTraveling = {
  type: MeepleStateType.Traveling;
  target: Meeple;
};

export type MeepleStateVisiting = {
  type: MeepleStateType.Visiting;
  target: Meeple;
};

export type MeepleStateTransacting = {
  type: MeepleStateType.Transacting;
  good: MiningType | ProductType | CurrencyType;
  quantity: number;
  source: Meeple;
  target: Meeple;
};

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateTraveling
  | MeepleStateVisiting
  | MeepleStateTransacting;

export enum MeepleActionType {
  TravelTo = "travel-to",
  Transact = "transact",
  Visit = "visit",
  Finish = "finish",
}

export type MeepleActionFinish = {
  type: MeepleActionType.Finish;
  payload: {
    state: MeepleState;
  };
};

export type MeepleActionTravelTo = {
  type: MeepleActionType.TravelTo;
  payload: {
    target: () => Meeple;
  };
};

export type MeepleActionVisit = {
  type: MeepleActionType.Visit;
  payload: {
    target: () => Meeple;
  };
};

export type MeepleActionTransact = {
  type: MeepleActionType.Transact;
  payload: Omit<Transaction, "source" | "target">;
};

export type MeepleAction =
  | MeepleActionTravelTo
  | MeepleActionTransact
  | MeepleActionFinish
  | MeepleActionVisit;

export type MeepleProps = {
  position: Vector;
  graphic: Graphic;
  name: string;
  state: MeepleState;
  stats: Stats;
  inventory: Inventory;
  speed: number;
  roleId: RoleId;
  instructions: Instruction[];
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
  speed: number;
  instructions: Instruction[];
  readonly game: Game;

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
    speed,
    instructions = [],
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
    this.speed = speed;
    this.instructions = instructions;
    this.game = this.scene?.engine as Game;
  }

  onInitialize(game: Game): void {
    this.initRulesTimer(game);
  }

  onDestroy(): void {
    this.timers.forEach((timer) => {
      timer.cancel();
    });
  }

  setState(state: MeepleState): void {
    this.state = state;
  }

  // take target inventory and add to source inventory
  transact(transaction: Transaction): void {
    switch (transaction.transactionType) {
      case "buy":
        // remove good from target
        transaction.target.inventory[transaction.good] -= transaction.quantity;

        // add good to source
        transaction.source.inventory[transaction.good] += transaction.quantity;

        // add money to source
        transaction.source.inventory[CurrencyType.Money] +=
          GOODS_COSTS[transaction.good] *
          transaction.quantity;

        // remove money from target
        transaction.target.inventory[CurrencyType.Money] -=
          GOODS_COSTS[transaction.good] *
          transaction.quantity;

        break;
      case "sell":
        //  exchange good
        transaction.target.inventory[transaction.good] += transaction.quantity;
        transaction.source.inventory[transaction.good] -= transaction.quantity;

        // exchange money
        transaction.source.inventory[CurrencyType.Money] +=
          GOODS_COSTS[transaction.good] *
          transaction.quantity;

        transaction.target.inventory[CurrencyType.Money] -=
          GOODS_COSTS[transaction.good] *
          transaction.quantity;

        break;
      case "add-self":
        transaction.source.inventory[transaction.good] += transaction.quantity;
        break;
      case "remove-self":
        transaction.source.inventory[transaction.good] -= transaction.quantity;
        break;
      default:
        throw new Error(
          `Invalid transaction type: ${transaction.transactionType}`
        );
    }
  }

  dispatch(action: MeepleAction): Promise<void> {
    const previousState = this.state;
    switch (action.type) {
      case MeepleActionType.Transact: {
        return new Promise((resolve) => {
          this.actions
            .callMethod(() => {
              const target = this.state.target;
              this.setState({
                type: MeepleStateType.Transacting,
                ...action.payload,
                source: this,
                target: target ?? this,
              });
            })
            .callMethod(() => {
              const target = this.state.target;

              target?.transact({
                ...action.payload,
                source: this,
                target: target ?? this,
              });
            })
            .delay(DEFAULT_DELAY)
            .callMethod(() => {
              this.setState(previousState);
              resolve();
            });
        });
      }
      case MeepleActionType.TravelTo: {
        return new Promise((resolve) => {
          const target = action.payload.target();
          this.actions
            .callMethod(() => {
              this.setState({
                type: MeepleStateType.Traveling,
                target: target,
              });
            })
            .moveTo(target.pos, this.speed)
            .callMethod(() => {
              this.setState({
                type: MeepleStateType.Visiting,
                target: action.payload.target(),
              });
            })
            .delay(DEFAULT_DELAY)
            .callMethod(() => {
              resolve();
            });
        });
      }
      case MeepleActionType.Finish: {
        return new Promise((resolve) => {
          this.actions.callMethod(() => {
            this.setState(action.payload.state);
            resolve();
          });
        });
      }
      default:
        return Promise.resolve();
    }
  }

  isValidInstruction(instruction: Instruction): boolean {
    return instruction.conditions.every((condition) => {
      return evaluateCondition(condition, condition.target().inventory);
    });
  }

  initRulesTimer(game: Game): void {
    const timer = new Timer({
      fcn: async () => {
        if (this.state.type !== MeepleStateType.Idle) {
          return;
        }
        for (const instruction of this.instructions) {
          if (this.isValidInstruction(instruction)) {
            for (const action of instruction.actions) {
              await this.dispatch({
                ...action,
              });
            }
          }
        }
      },
      repeats: true,
      interval: 300,
    });
    game.currentScene.add(timer);
    timer.start();
  }
}
