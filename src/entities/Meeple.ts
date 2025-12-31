import { Actor, Vector, Graphic, Timer, ActionContext } from "excalibur";
import type { Game } from "./Game";
import {
  CurrencyType,
  MiningType,
  ProductType,
  RoleId,
  VitalsType,
} from "./types";
import { applyMeepleRules, type Rules } from "../rules/rules";
import { DEFAULT_DELAY } from "../consts";

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

export type MeepleActionTransactVitals = {
  name: "transact-vitals";
  vitals: VitalsType;
  quantity: number;
  transactionType: "add" | "remove";
};

export type MeepleAction =
  | MeepleActionTravelTo
  | MeepleActionFinish
  | MeepleActionVisit
  | MeepleActionTransactInventory
  | MeepleActionTransactVitals;

export type MeepleProps = {
  position: Vector;
  graphic: Graphic;
  name: string;
  state: MeepleState;
  roleId: RoleId;
  rulesMapGenerator: Rules;
  rulesMapRules: Rules;
  journal: JorunalEntry[];
};

type JorunalEntry = {
  timestamp: number;
  state: MeepleState;
  action: MeepleAction;
  source?: "rule" | "generator";
};

/**
 * Common threshold values for rules
 */
export const COMMON_THRESHOLDS = [0, 1, 5, 10, 20, 30, 40, 50] as const;

export class Meeple extends Actor {
  // Identity & State
  roleId: RoleId;
  state: MeepleState;
  journal: JorunalEntry[];
  rulesMapGenerator: Rules;
  rulesMapRules: Rules;
  // Gameplay Properties
  readonly game: Game;

  // Internal/Private Properties
  private timers: Timer[] = [];

  constructor({
    position,
    graphic,
    name,
    roleId,
    state,
    rulesMapGenerator,
    rulesMapRules,
    journal,
  }: MeepleProps) {
    super({
      pos: position,
    });

    // Base Actor setup
    this.graphics.add(graphic);
    this.name = name;
    this.journal = journal;

    // Identity & State
    this.roleId = roleId;
    this.state = state;
    this.rulesMapGenerator = rulesMapGenerator;
    this.rulesMapRules = rulesMapRules;
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

  dispatch(action: MeepleAction, source?: "rule" | "generator"): void {
    this.addToJournal({
      timestamp: Date.now(),
      state: this.state,
      action,
      source,
    });
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
      case "transact-vitals": {
        nextState = {
          ...this.state,
          name: "transacting",
          good: action.vitals,
          quantity: action.quantity,
          transactionType: action.transactionType,
          stats: {
            ...this.state.stats,
            [action.vitals]:
              action.transactionType === "add"
                ? this.state.stats[action.vitals] + action.quantity
                : this.state.stats[action.vitals] - action.quantity,
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
        applyMeepleRules(this, game, this.rulesMapRules, "rule");
      },
      repeats: true,
      interval: 500,
    });
    game.currentScene.add(timer);
    timer.start();
  }

  // journal nust not exceed 100 entries  
  addToJournal(entry: JorunalEntry): void {
    this.journal.push(entry);
    if (this.journal.length > 100) {
      this.journal.shift();
    }
  }

  initGeneraterTimer(game: Game): void {
    const timer = new Timer({
      fcn: async () => {
        applyMeepleRules(this, game, this.rulesMapGenerator, "generator");
      },
      repeats: true,
      interval: 1000,
    });
    game.currentScene.add(timer);
    timer.start();
  }

  travelTo(target: Meeple): ActionContext {
    return this.actions
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
    quantity: number,
    source?: "rule" | "generator"
  ): ActionContext {
    // If source not provided, try to get it from current rule context
    const actualSource = source ?? (this as any).__currentRuleSource ?? "rule";
    return this.actions
      .callMethod(() => {
        this.dispatch({
          name: "transact-inventory",
          good,
          quantity,
          transactionType: "add",
        }, actualSource);
      })
      .delay(DEFAULT_DELAY)
  }

  removeFromInventory(
    good: MiningType | ProductType | CurrencyType,
    quantity: number,
    source?: "rule" | "generator"
  ): ActionContext {
    // If source not provided, try to get it from current rule context
    const actualSource = source ?? (this as any).__currentRuleSource ?? "rule";
    return this.actions
      .callMethod(() => {
        this.dispatch({
          name: "transact-inventory",
          good,
          quantity,
          transactionType: "remove",
        }, actualSource);
      })
      .delay(DEFAULT_DELAY)
  }

  addToVitals(vitals: VitalsType, quantity: number, source?: "rule" | "generator"): ActionContext {
    return this.actions
      .callMethod(() => {
        this.dispatch({
          name: "transact-vitals",
          vitals,
          quantity,
          transactionType: "add",
        }, source);
      })
      .delay(DEFAULT_DELAY)
  }

  removeFromVitals(vitals: VitalsType, quantity: number, source?: "rule" | "generator"): ActionContext {
    return this.actions
      .callMethod(() => {
        this.dispatch({
          name: "transact-vitals",
          vitals,
          quantity,
          transactionType: "remove",
        }, source);
      })
      .delay(DEFAULT_DELAY)
  }
}

