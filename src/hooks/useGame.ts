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

// ============================================================================
// Constants
// ============================================================================

/** Width of the game world in pixels */
const WORLD_WIDTH = 2500;

/** Height of the game world in pixels */
const WORLD_HEIGHT = 2500;

/** Initial camera zoom level */
const CAMERA_ZOOM = 2;

/** Interval in milliseconds for updating the meeple list in React state */
const MEEPLE_UPDATE_INTERVAL_MS = 1000;

/** Number of each entity type to spawn in the game world */
const ENTITY_COUNTS = {
  TRADERS: 10,
  SPACE_STATIONS: 5,
  ASTEROIDS: 5,
  MINERS: 10,
  SPACE_BARS: 3,
  SPACE_APARTMENTS: 3,
} as const;

/** Size range for randomly generated asteroids */
const ASTEROID_SIZE_RANGE = {
  MIN: 15,
  MAX: 30,
} as const;

// ============================================================================
// Types
// ============================================================================

/** Action to update the list of meeples in the game */
type SetMeeplesAction = {
  type: "set-meeples";
  payload: Meeple[];
};

/** Action to update the loading state */
type SetIsLoadingAction = {
  type: "set-is-loading";
  payload: boolean;
};

/** Action to set the game instance */
type SetGameAction = {
  type: "set-game";
  payload: Game;
};

/** Action to zoom the camera to a specific entity */
type ZoomToEntityAction = {
  type: "zoom-to-entity";
  payload: Meeple | null;
};

/** Union type of all possible game actions */
type GameAction = SetMeeplesAction | SetIsLoadingAction | SetGameAction | ZoomToEntityAction;

/** State shape for the game hook */
type GameState = {
  game: Game | null;
  isLoading: boolean;
  meeples: Meeple[];
  activeMeeple: Meeple | null;
};

// ============================================================================
// Initial State
// ============================================================================

const initialState: GameState = {
  game: null,
  isLoading: true,
  meeples: [],
  activeMeeple: null,
};

// ============================================================================
// Reducer
// ============================================================================

/**
 * Reducer function to manage game state updates.
 * Handles all game-related state changes in a predictable way.
 */
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

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates a random position within the game world bounds.
 * @returns A Vector with random x and y coordinates
 */
function getRandomPosition(): Vector {
  return new Vector(
    Math.random() * WORLD_WIDTH,
    Math.random() * WORLD_HEIGHT
  );
}

/**
 * Generates a random asteroid size within the configured range.
 * @returns A random size value between MIN and MAX
 */
function getRandomAsteroidSize(): number {
  return (
    ASTEROID_SIZE_RANGE.MIN +
    Math.random() * (ASTEROID_SIZE_RANGE.MAX - ASTEROID_SIZE_RANGE.MIN)
  );
}

/**
 * Creates and initializes the player character at the center of the world.
 * The camera is locked to follow the player.
 */
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

/**
 * Creates space stations at random positions in the world.
 * Space stations convert ore into products and facilitate trading.
 */
function createSpaceStations(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.SPACE_STATIONS; i++) {
    const spaceStation = new SpaceStation(
      getRandomPosition(),
      generateSpaceName()
    );
    game.currentScene.add(spaceStation);
  }
}

/**
 * Creates asteroids at random positions with random sizes.
 * Asteroids are sources of ore that miners can extract.
 */
function createAsteroids(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.ASTEROIDS; i++) {
    const asteroid = new Asteroid(
      getRandomPosition(),
      getRandomAsteroidSize()
    );
    game.currentScene.add(asteroid);
  }
}

/**
 * Creates miner entities that follow mining and trading rules.
 * Miners extract ore from asteroids and trade it at space stations.
 */
function createMiners(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.MINERS; i++) {
    const miner = new Miner(getRandomPosition(), 1, generateSpaceName());
    miner.name = generateSpaceName();
    game.currentScene.add(miner);
  }
}

/**
 * Creates trader entities that buy and sell products.
 * Traders follow trading rules to move goods between stations.
 */
function createTraders(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.TRADERS; i++) {
    const trader = new Trader(getRandomPosition(), 1, generateSpaceName());
    trader.name = generateSpaceName();
    game.currentScene.add(trader);
  }
}

/**
 * Creates space bars where entities can socialize and spend money.
 */
function createSpaceBars(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.SPACE_BARS; i++) {
    const spaceBar = new SpaceBar(getRandomPosition(), generateSpaceName());
    spaceBar.name = generateSpaceName();
    game.currentScene.add(spaceBar);
  }
}

/**
 * Creates space apartments in the game world.
 */
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

/**
 * Creates a single treasure collector entity.
 * Treasure collectors buy treasure from other entities.
 */
function createTreasureCollector(game: Game): void {
  const treasureCollector = new TreasureCollector(
    getRandomPosition(),
    1,
    generateSpaceName()
  );
  treasureCollector.name = generateSpaceName();
  game.currentScene.add(treasureCollector);
}

/**
 * Initializes all game entities in the correct order.
 * This includes the player, background stars, and all NPC entities.
 */
function initializeGameEntities(game: Game): void {
  initializePlayer(game);
  // addStars(game);
  createSpaceStations(game);
  createAsteroids(game);
  createMiners(game);
  createTraders(game);
  createSpaceBars(game);
  createSpaceApartments(game);
  createTreasureCollector(game);
}

// ============================================================================
// Canvas Utilities
// ============================================================================

/**
 * Configuration for waiting for the canvas element to appear in the DOM.
 * This is necessary because React may not have rendered the canvas
 * when the game initialization code runs, especially in production builds.
 */
const CANVAS_WAIT_CONFIG = {
  /** Maximum number of retry attempts */
  MAX_RETRIES: 100,
  /** Delay between retries in milliseconds */
  RETRY_DELAY_MS: 10,
  /** Total maximum wait time: 100 * 10ms = 1000ms (1 second) */
} as const;

/**
 * Waits for the canvas element to be available in the DOM.
 * This handles the race condition where React hasn't rendered the canvas yet.
 * 
 * @param canvasId - The ID of the canvas element to wait for
 * @returns A promise that resolves with the canvas element
 * @throws {Error} If the canvas is not found after maximum retries
 */
function waitForCanvas(canvasId: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const checkCanvas = () => {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

      if (canvas) {
        resolve(canvas);
      } else if (retries < CANVAS_WAIT_CONFIG.MAX_RETRIES) {
        retries++;
        setTimeout(checkCanvas, CANVAS_WAIT_CONFIG.RETRY_DELAY_MS);
      } else {
        reject(
          new Error(
            `Canvas element '${canvasId}' not found after ${CANVAS_WAIT_CONFIG.MAX_RETRIES} retries. ` +
            "Make sure the canvas is rendered in the DOM before initializing the game."
          )
        );
      }
    };

    checkCanvas();
  });
}

// ============================================================================
// Game Initialization
// ============================================================================

/**
 * Initializes the Excalibur game engine and all game entities.
 * 
 * This function:
 * 1. Waits for the canvas element to be available in the DOM
 * 2. Creates a new Game instance with the configured world size
 * 3. Sets up the camera zoom
 * 4. Initializes all game entities (player, NPCs, stations, etc.)
 * 5. Starts the Excalibur game engine
 * 
 * @returns A promise that resolves with the initialized Game instance
 * @throws {Error} If canvas is not found or game initialization fails
 */
function initializeGame(): Promise<Game> {
  return waitForCanvas("game-canvas")
    .then(() => {
      // Canvas is now available, create and start the game
      const game = new Game(WORLD_WIDTH, WORLD_HEIGHT);
      game.currentScene.camera.zoom = CAMERA_ZOOM;
      initializeGameEntities(game);
      return game.start().then(() => game);
    });
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * Custom React hook that manages the game state and lifecycle.
 * 
 * This hook:
 * - Initializes the Excalibur game engine on mount
 * - Periodically updates the meeple list for React to render
 * - Manages camera zoom to specific entities
 * - Provides a function to zoom to any meeple
 * 
 * @returns Game state and utility functions
 */
export const useGame = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const gameRef = useRef<Game | null>(null);

  // Initialize the game engine when the component mounts
  useEffect(() => {
    initializeGame()
      .then((game) => {
        gameRef.current = game;
        dispatch({ type: "set-game", payload: game });
        dispatch({ type: "set-is-loading", payload: false });
        
        // Find and select the player as active once the game is loaded
        const player = game.currentScene.actors.find(
          (actor: Actor) => actor instanceof Player
        ) as Player | undefined;
        
        if (player) {
          dispatch({ type: "zoom-to-entity", payload: player });
        }
        
        console.log("Game initialized successfully");
      })
      .catch((error) => {
        console.error("Failed to initialize game:", error);
        dispatch({ type: "set-is-loading", payload: false });
      });
  }, []);

  // Periodically update the meeple list from the game scene
  // This allows React to re-render when entities are added/removed
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

  // Update camera to follow the active meeple when it changes
  useEffect(() => {
    if (gameState.activeMeeple && gameRef.current) {
      gameRef.current.currentScene.camera.strategy.lockToActor(gameState.activeMeeple);
    }
  }, [gameState.activeMeeple]);

  return {
    ...gameState,
    /**
     * Zooms the camera to follow a specific meeple entity.
     * @param meeple - The meeple entity to zoom to
     */
    zoomToEntity: (meeple: Meeple) => {
      dispatch({ type: "zoom-to-entity", payload: meeple });
    },
  };
};
