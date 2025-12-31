import { MiningType } from "./entities/types";

export const GAME_SPEED = 2;

export const DEFAULT_DELAY = 1000;

export const GAME_WIDTH = 2500;
export const GAME_HEIGHT = 2500;

export const COUNTS = {
  MINER: 17 ,
  ASTEROID: 7,
  SPACE_STORE: 4,
  SPACE_BAR: 2,
  SPACE_APARTMENT: 2,
};

export const MIN_SHIP_DEFAULT_SPEED = 50;
export const MAX_SHIP_DEFAULT_SPEED = 150;

// 1 to 10 ore to money (example)
export const EXCHANGE_RATE_TO_MONEY = {
  [MiningType.Ore]: 10,
}
