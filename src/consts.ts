import { MiningType } from "./entities/types";

export const GAME_SPEED = 1;

export const DEFAULT_DELAY = 1000;

export const GAME_WIDTH = 2500;
export const GAME_HEIGHT = 2500;

export const COUNTS = {
  MINER: 17 ,
  ASTEROID: 7,
  SPACE_STORE: 3,
  SPACE_BAR: 1,
  SPACE_APARTMENT: 1,
};

export const MIN_SHIP_DEFAULT_SPEED = 50;
export const MAX_SHIP_DEFAULT_SPEED = 150;

// 1 to 10 ore to money (example)
export const EXCHANGE_RATE_TO_MONEY = {
  [MiningType.Ore]: 10,
}
