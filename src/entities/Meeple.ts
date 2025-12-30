import { Actor, Vector, Graphic, Timer } from "excalibur";
import type { Game } from "./Game";
import {
  CurrencyType,
  MiningType,
  ProductType,
  RoleId,
  VitalsType,
} from "./types";
import { meepleActionsRule, meepleGeneratorRule } from "./rules";

export const DEFAULT_DELAY = 1000;

export type Stats = {
  [key in VitalsType]: number;
};

export type Inventory = {
  [key in MiningType | ProductType | CurrencyType]: number;
};

export type SharedMeepleState = {
  inventory: Inventory;
  stats: Stats;
  speed: number;
};

export type MeepleStateIdle = {
  name: "idle";
} & SharedMeepleState;

export type MeepleStateTraveling = {
  name: "traveling";
  target: Meeple;
} & SharedMeepleState;

export type MeepleStateVisiting = {
  name: "visiting";
  target: Meeple;
} & SharedMeepleState;

export type MeepleStateTransacting = {
  name: "transacting";
  good: MiningType | ProductType | CurrencyType | VitalsType;
  quantity: number;
  transactionType: "add" | "remove";
} & SharedMeepleState;

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateTraveling
  | MeepleStateVisiting
  | MeepleStateTransacting;

export type MeepleActionTravelTo = {
  name: "travel-to";
  target: Meeple;
};
export type MeepleActionFinish = {
  name: "finish";
};
export type MeepleActionVisit = {
  name: "visit";
  target: Meeple;
};
export type MeepleActionTransactInventory = {
  name: "transact-inventory";
  good: MiningType | ProductType | CurrencyType;
  quantity: number;
  transactionType: "add" | "remove";
};
export type MeepleAction =
  | MeepleActionTravelTo
  | MeepleActionFinish
  | MeepleActionVisit
  | MeepleActionTransactInventory;

export type MeepleProps = {
  position: Vector;
  graphic: Graphic;
  name: string;
  state: MeepleState;
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
  readonly game: Game;

  // Internal/Private Properties
  private timers: Timer[] = [];

  constructor({ position, graphic, name, roleId, state }: MeepleProps) {
    super({
      pos: position,
    });

    // Base Actor setup
    this.graphics.add(graphic);
    this.name = name;

    // Identity & State
    this.roleId = roleId;
    this.state = state;

    this.game = this.scene?.engine as Game;
  }

  onInitialize(game: Game): void {
    this.initRulesTimer(game);
    this.initGeneraterTimer(game);
  }

  onDestroy(): void {
    this.timers.forEach((timer) => {
      timer.cancel();
    });
  }

  setState(state: MeepleState): void {
    this.state = state;
  }

  dispatch(action: MeepleAction): void {
    let nextState: MeepleState;
    switch (action.name) {
      case "travel-to": {
        nextState = {
          ...this.state,
          name: "traveling",
          target: action.target,
        };
        break;
      }
      case "visit":
        nextState = {
          ...this.state,
          name: "visiting",
          target: action.target,
        };
        break;
      case "transact-inventory": {
        nextState = {
          ...this.state,
          name: "transacting",
          good: action.good,
          quantity: action.quantity,
          transactionType: action.transactionType,
          // update inventory
          inventory: {
            ...this.state.inventory,
            [action.good]:
              action.transactionType === "add"
                ? this.state.inventory[action.good] + action.quantity
                : this.state.inventory[action.good] - action.quantity,
          },
        };
        break;
      }
      case "finish": {
        nextState = {
          ...this.state,
          name: "idle",
        };
        break;
      }
    }
    this.setState(nextState);
  }

  initRulesTimer(game: Game): void {
    const timer = new Timer({
      fcn: async () => {
        meepleActionsRule(this, game);
      },
      repeats: true,
      interval: 500,
    });
    game.currentScene.add(timer);
    timer.start();
  }

  initGeneraterTimer(game: Game): void {
    const timer = new Timer({
      fcn: async () => {
        meepleGeneratorRule(this, game);
      },
      repeats: true,
      interval: 500,
    });
    game.currentScene.add(timer);
    timer.start();
  }

  travelTo(target: Meeple): void {
    this.actions
      .callMethod(() => {
        this.dispatch({
          name: "travel-to",
          target,
        });
      })
      .moveTo(target.pos, this.state.speed)
      .callMethod(() => {
        this.dispatch({
          name: "visit",
          target,
        });
      })
      .delay(DEFAULT_DELAY);
  }

  addToInventory(
    good: MiningType | ProductType | CurrencyType,
    quantity: number
  ): void {
    this.actions
      .callMethod(() => {
        this.dispatch({
          name: "transact-inventory",
          good,
          quantity,
          transactionType: "add",
        });
      })
      .delay(DEFAULT_DELAY)
      .callMethod(() => {
        this.dispatch({
          name: "finish",
        });
      });
  }

  removeFromInventory(
    good: MiningType | ProductType | CurrencyType,
    quantity: number
  ): void {
    this.actions
      .callMethod(() => {
        this.dispatch({
          name: "transact-inventory",
          good,
          quantity,
          transactionType: "remove",
        });
      })
      .delay(DEFAULT_DELAY)
      .callMethod(() => {
        this.dispatch({
          name: "finish",
        });
      });
  }
}
