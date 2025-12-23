import { Actor, Vector, Graphic, Timer } from "excalibur";
import type { Game } from "./Game";
import { RoleId, type Instruction } from "./types";
import { evaluateCondition } from "../utils/evaluateCondition";

const DEFAULT_DELAY = 3000;

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
}

export type MeepleStateIdle = {
  type: MeepleStateType.Idle;
  target?: Meeple;
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
  | MeepleStateTransacting;

export enum MeepleActionType {
  TravelTo = "travel-to",
  SetRandomTargetByRoleId = "set-random-target-by-role-id",
  SetTarget = "set-target",
  Transact = "transact",
  VisitTarget = "visit-target",
  Finish = "finish",
}

export type MeepleActionFinish = {
  type: MeepleActionType.Finish;
  payload: {
    state: MeepleState;
  };
};

export type MeepleActionSetRandomTargetByRoleId = {
  type: MeepleActionType.SetRandomTargetByRoleId;
  payload: {
    roleId: RoleId;
  };
};

export type MeepleActionSetTarget = {
  type: MeepleActionType.SetTarget;
  payload: {
    target: Meeple;
  };
};

export type MeepleActionTravelTo = {
  type: MeepleActionType.TravelTo;
  payload: {
    target?: Meeple;
  };
};

export type Transaction = {
  good: MiningType | ProductType | CurrencyType;
  quantity: number;
  transactionType: "add" | "remove";
  target?: Meeple;
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
  | MeepleActionSetRandomTargetByRoleId
  | MeepleActionTransact
  | MeepleActionFinish
  | MeepleActionSetTarget;

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

  transact(transaction: Transaction): void {
    if (!transaction.target) {
      return;
    }
    if (transaction.transactionType === "add") {
      transaction.target.inventory[transaction.good] += transaction.quantity;
    } else {
      transaction.target.inventory[transaction.good] -= transaction.quantity;
    }
  }

  setState(state: MeepleState): void {
    this.state = state;
  }

  async dispatch(action: MeepleAction): Promise<MeepleState> {
    return new Promise((resolve) => {
      switch (action.type) {
        case MeepleActionType.TravelTo: {
          const target = action.payload.target ?? this.state.target;
          if (!target) {
            resolve({
              type: MeepleStateType.Idle,
            });
            break;
          }
          this.actions
            .callMethod(() => {
              this.state = {
                type: MeepleStateType.Traveling,
                target: target,
              };
            })
            .meet(target, this.speed)
            .delay(DEFAULT_DELAY)
            .callMethod(() => {
              resolve(this.state);
            });
          break;
        }
        case MeepleActionType.SetRandomTargetByRoleId: {
          const game = this.scene?.engine as Game;
          const target = game.findRandomMeepleByRoleId(action.payload.roleId);
          this.state.target = target;
          resolve(this.state);
          break;
        }
        case MeepleActionType.SetTarget: {
          this.state.target = action.payload.target;
          resolve(this.state);
          break;
        }
        case MeepleActionType.Transact: {
          const target = action.payload.target ?? this.state.target;
          if (!target) {
            resolve({
              type: MeepleStateType.Idle,
            });
            break;
          }
          this.actions
            .callMethod(() => {
              this.state = {
                type: MeepleStateType.Transacting,
                ...action.payload,
                target: target,
              };
            })
            .callMethod(() => {
              this.transact({ ...action.payload, target: target });
            })
            .delay(DEFAULT_DELAY)
            .callMethod(() => {
              resolve(this.state);
            });
          break;
        }
        case MeepleActionType.Finish: {
          this.actions
            .callMethod(() => {
              this.state = action.payload.state;
            })
            .callMethod(() => {
              resolve(this.state);
            });
          resolve(this.state);
          break;
        }
        default:
          break;
      }
    });
  }

  isValidInstruction(instruction: Instruction): boolean {
    return instruction.conditions.every((condition) => {
      return evaluateCondition(condition, condition.target.inventory);
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
              await this.dispatch(action);
            }
          }
        }
      },
      repeats: true,
      interval: 1000,
    });
    game.currentScene.add(timer);
    timer.start();
  }
}
