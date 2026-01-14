import { MeepleInventoryItem } from "./types";

export const GAME_SPEED = 1;
export const PLAYER_SPEED = 4;

export const DEFAULT_DELAY = 1000;

export const GAME_WIDTH = 2500;
export const GAME_HEIGHT = 2500;

export const COUNTS = {
  MINER: 42,
  BARTENDER: 7,
  ASTEROID: 7,
  SPACE_STORE: 1,
  SPACE_BAR: 1,
  SPACE_APARTMENT: 1,
  PIRATE_BASE: 1,
  PIRATE_SHIP: 17,
};

export const MIN_SHIP_DEFAULT_SPEED = 50;
export const MAX_SHIP_DEFAULT_SPEED = 150;

export const DEFAULT_INVENTORY = {
  [MeepleInventoryItem.Minirals]: 0,
  [MeepleInventoryItem.Money]: 0,
  [MeepleInventoryItem.Fizzy]: 0,
};

export const DEFAULT_PRICE = 1;

// how many of one item are needed to transmute into another per one
// e.g. 1 minirals-> 10 fizzy drinks and 10 money
export const TRANSMUTATION_RATIOS = {
  [MeepleInventoryItem.Minirals]: {
    [MeepleInventoryItem.Fizzy]: 1,
    [MeepleInventoryItem.Money]: 1,
  },
};

export const SELL_PRICES = {
  [MeepleInventoryItem.Minirals]: 1,
};

export const BUY_PRICES = {
  [MeepleInventoryItem.Fizzy]: 1,
};