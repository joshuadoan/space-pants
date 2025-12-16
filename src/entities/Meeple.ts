import { Actor, Vector, Graphic } from "excalibur";

export type GoodType = "ore";

export type MeepleInventory = {
  [key in GoodType]: number;
};

export type Vitals = "health" | "energy" | "happiness";

export type VitalsInventory = {
  [key in Vitals]: number;
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
    target: Meeple;
  };
};

export type MeepleActionTransact = {
  type: "transact";
  payload: {
    good: GoodType;
    quantity: number;
    transactionType: "add" | "remove";
  };
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
  inventory: MeepleInventory;
  vitals: VitalsInventory;
};

/**
 * Common threshold values for rules
 */
export const COMMON_THRESHOLDS = [0, 1, 5, 10, 20, 30, 40, 50] as const;

export class Meeple extends Actor {
  state: MeepleState;
  inventory: MeepleInventory;
  vitals: VitalsInventory;

  constructor({
    position,
    graphic,
    name,
    state,
    inventory,
    vitals,
  }: MeepleProps) {
    super({
      pos: position,
    });

    this.graphics.add(graphic);
    this.name = name;
    this.state = state;
    this.inventory = inventory;
    this.vitals = vitals;
  }
}
