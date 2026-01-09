import { MeepleInventoryItem } from "./types";

export const GAME_SPEED = 20;
export const PLAYER_SPEED = 5;

export const DEFAULT_DELAY = 1000;

export const GAME_WIDTH = 2500;
export const GAME_HEIGHT = 2500;

export const COUNTS = {
  MINER: 5,
  BARTENDER: 2,
  ASTEROID: 5,
  SPACE_STORE: 1,
  SPACE_BAR: 1,
  SPACE_APARTMENT: 1,
};

export const MIN_SHIP_DEFAULT_SPEED = 50;
export const MAX_SHIP_DEFAULT_SPEED = 150;

export const DEFAULT_INVENTORY = {
  [MeepleInventoryItem.Minirals]: 0,
  [MeepleInventoryItem.Money]: 0,
  [MeepleInventoryItem.Fizzy]: 0,
}

export const DEFAULT_PRICE = 1;
