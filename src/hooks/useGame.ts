import { useEffect, useReducer, useRef } from "react";
import { Game } from "../entities/Game";
import { Player } from "../entities/Player";
import { Vector } from "excalibur";
import { addStars } from "../utils/addStars";
import { SpaceStation } from "../entities/SpaceStation";
import { Trader } from "../entities/Trader";
import { Asteroid } from "../entities/Asteroid";
import { Miner } from "../entities/Miner";
import { SpaceBar } from "../entities/SpaceBar";
import { generateSpaceName } from "../entities/utils/generateSpaceName";
import { SpaceApartments } from "../entities/SpaceApartments";
import { TreasureCollector } from "../entities/TreasureCollector";
import { DEFAULT_SHIP_SPEED } from "../consts";
import type { Actor } from "excalibur";
import { Meeple } from "../entities/Meeple";

// Constants
const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 1000;
const CAMERA_ZOOM = 2;
const MEEPLE_UPDATE_INTERVAL_MS = 300;

const ENTITY_COUNTS = {
  TRADERS: 10,
  SPACE_STATIONS: 5,
  ASTEROIDS: 5,
  MINERS: 10,
  SPACE_BARS: 3,
  SPACE_APARTMENTS: 3,
} as const;

const ASTEROID_SIZE_RANGE = {
  MIN: 15,
  MAX: 30,
} as const;

type SetMeeplesAction = {
  type: "set-meeples";
  payload: Meeple[];
};

type SetIsLoadingAction = {
  type: "set-is-loading";
  payload: boolean;
};

type SetGameAction = {
  type: "set-game";
  payload: Game;
};

type ZoomToEntityAction = {
  type: "zoom-to-entity";
  payload: Meeple | null;
};

type GameAction =  SetMeeplesAction | SetIsLoadingAction | SetGameAction | ZoomToEntityAction;

type GameState = {
  game: Game | null;
  isLoading: boolean;
  meeples: Meeple[];
  activeMeeple: Meeple | null;
};

// Initial state
const initialState: GameState = {
  game: null,
  isLoading: true,
  meeples: [],
  activeMeeple: null,
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "set-is-loading":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "set-game":
      return {
        ...state,
        game: action.payload,
      };
    case "set-meeples":
      return {
        ...state,
        meeples: action.payload,
      };
    case "zoom-to-entity": {
      return {
        ...state,
        activeMeeple: action.payload,
      };
    }
    default:
      return state;
  }
}

// Helper functions
function getRandomPosition(): Vector {
  return new Vector(
    Math.random() * WORLD_WIDTH,
    Math.random() * WORLD_HEIGHT
  );
}

function getRandomAsteroidSize(): number {
  return (
    ASTEROID_SIZE_RANGE.MIN +
    Math.random() * (ASTEROID_SIZE_RANGE.MAX - ASTEROID_SIZE_RANGE.MIN)
  );
}

function initializePlayer(game: Game): Player {
  const player = new Player(
    new Vector(WORLD_WIDTH / 2, WORLD_HEIGHT / 2),
    DEFAULT_SHIP_SPEED,
    "Player"
  );
  game.currentScene.add(player);
  game.currentScene.camera.strategy.lockToActor(player);
  return player;
}

function createSpaceStations(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.SPACE_STATIONS; i++) {
    const spaceStation = new SpaceStation(
      getRandomPosition(),
      generateSpaceName()
    );
    game.currentScene.add(spaceStation);
  }
}

function createAsteroids(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.ASTEROIDS; i++) {
    const asteroid = new Asteroid(
      getRandomPosition(),
      getRandomAsteroidSize()
    );
    game.currentScene.add(asteroid);
  }
}

function createMiners(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.MINERS; i++) {
    const miner = new Miner(getRandomPosition(), 1, generateSpaceName());
    miner.name = generateSpaceName();
    game.currentScene.add(miner);
  }
}

function createTraders(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.TRADERS; i++) {
    const trader = new Trader(getRandomPosition(), 1, generateSpaceName());
    trader.name = generateSpaceName();
    game.currentScene.add(trader);
  }
}

function createSpaceBars(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.SPACE_BARS; i++) {
    const spaceBar = new SpaceBar(getRandomPosition(), generateSpaceName());
    spaceBar.name = generateSpaceName();
    game.currentScene.add(spaceBar);
  }
}

function createSpaceApartments(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.SPACE_APARTMENTS; i++) {
    const spaceApartment = new SpaceApartments(
      getRandomPosition(),
      generateSpaceName()
    );
    spaceApartment.name = generateSpaceName();
    game.currentScene.add(spaceApartment);
  }
}

function createTreasureCollector(game: Game): void {
  const treasureCollector = new TreasureCollector(
    getRandomPosition(),
    1,
    generateSpaceName()
  );
  treasureCollector.name = generateSpaceName();
  game.currentScene.add(treasureCollector);
}

function initializeGameEntities(game: Game): void {
  initializePlayer(game);
  addStars(game);
  createSpaceStations(game);
  createAsteroids(game);
  createMiners(game);
  createTraders(game);
  createSpaceBars(game);
  createSpaceApartments(game);
  createTreasureCollector(game);
}

function initializeGame(): Promise<Game> {
  const game = new Game(WORLD_WIDTH, WORLD_HEIGHT);
  game.currentScene.camera.zoom = CAMERA_ZOOM;
  initializeGameEntities(game);
  return game.start().then(() => game);
}

// Hook
export const useGame = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const gameRef = useRef<Game | null>(null);

  // Initialize game on mount
  useEffect(() => {
    initializeGame().then((game) => {
      gameRef.current = game;
      dispatch({ type: "set-game", payload: game });
      dispatch({ type: "set-is-loading", payload: false });
    });
  }, []);

  // Update meeples periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameRef.current) {
        const meeples = gameRef.current.currentScene.actors.filter(
          (actor: Actor) => actor instanceof Meeple
        ) as Meeple[];
        dispatch({ type: "set-meeples", payload: meeples });
      }
    }, MEEPLE_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameState.activeMeeple) {
      gameRef.current?.currentScene.camera.strategy.lockToActor(gameState.activeMeeple);
    }
  }, [gameState.activeMeeple]);

  return {
    ...gameState,
    zoomToEntity: (meeple: Meeple) => {
      dispatch({ type: "zoom-to-entity", payload: meeple });
    },
  };
};
