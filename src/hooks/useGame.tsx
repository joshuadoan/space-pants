import { createContext, useContext, useEffect, useCallback, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import { Game } from "../entities/Game";
import { Player } from "../entities/Player";
import { Vector } from "excalibur";
import { createStarTilemap } from "../utils/createStarTilemap";
import { SpaceStation } from "../entities/SpaceStation";
import { Trader } from "../entities/Trader";
import { Asteroid } from "../entities/Asteroid";
import { Miner } from "../entities/Miner";
import { SpaceBar } from "../entities/SpaceBar";
import { generateSpaceName } from "../entities/utils/generateSpaceName";
import { SpaceApartments } from "../entities/SpaceApartments";
import { Bartender } from "../entities/Bartender";
import type { Actor } from "excalibur";
import { Meeple } from "../entities/Meeple";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  CAMERA_ZOOM,
  MEEPLE_LIST_UPDATE_INTERVAL_MS,
  ENTITY_COUNTS,
  ASTEROID_SIZE_RANGE,
  DEFAULT_SHIP_SPEED,
  CANVAS_WAIT_CONFIG,
} from "../entities/game-config";
import { Products } from "../entities/types";

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

/** Categorized meeples by type */
type CategorizedMeeples = {
  traders: Trader[];
  miners: Miner[];
  spacebars: SpaceBar[];
  stations: SpaceStation[];
  asteroids: Asteroid[];
  player: Player[];
  spaceapartments: SpaceApartments[];
  bartenders: Bartender[];
  all: Meeple[];
};

/** Counts of meeples by type */
type MeepleCounts = {
  player: number;
  traders: number;
  miners: number;
  asteroids: number;
  stations: number;
  spacebars: number;
  spaceapartments: number;
  bartenders: number;
};

/** State shape for the game hook */
type GameState = {
  game: Game | null;
  isLoading: boolean;
  meeples: Meeple[];
  activeMeeple: Meeple | null;
  categorizedMeeples: CategorizedMeeples;
  meepleCounts: MeepleCounts;
};

// ============================================================================
// Initial State
// ============================================================================

const emptyCategorizedMeeples: CategorizedMeeples = {
  traders: [],
  miners: [],
  spacebars: [],
  stations: [],
  asteroids: [],
  player: [],
  spaceapartments: [],
  bartenders: [],
  all: [],
};

const emptyMeepleCounts: MeepleCounts = {
  player: 0,
  traders: 0,
  miners: 0,
  asteroids: 0,
  stations: 0,
  spacebars: 0,
  spaceapartments: 0,
  bartenders: 0,
};

const initialState: GameState = {
  game: null,
  isLoading: true,
  meeples: [],
  activeMeeple: null,
  categorizedMeeples: emptyCategorizedMeeples,
  meepleCounts: emptyMeepleCounts,
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
    case "set-meeples": {
      const categorized = categorizeMeeples(action.payload);
      const counts = calculateMeepleCounts(categorized);
      return {
        ...state,
        meeples: action.payload,
        categorizedMeeples: categorized,
        meepleCounts: counts,
      };
    }
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
 * Categorizes meeples by type in a single pass for optimal performance.
 * This avoids multiple instanceof checks by doing them all at once.
 */
function categorizeMeeples(meeples: Meeple[]): CategorizedMeeples {
  const categorized: CategorizedMeeples = {
    traders: [],
    miners: [],
    spacebars: [],
    stations: [],
    asteroids: [],
    player: [],
    spaceapartments: [],
    bartenders: [],
    all: meeples,
  };

  for (const meeple of meeples) {
    if (meeple instanceof Trader) {
      categorized.traders.push(meeple);
    } else if (meeple instanceof Miner) {
      categorized.miners.push(meeple);
    } else if (meeple instanceof SpaceBar) {
      categorized.spacebars.push(meeple);
    } else if (meeple instanceof SpaceStation) {
      categorized.stations.push(meeple);
    } else if (meeple instanceof Asteroid) {
      categorized.asteroids.push(meeple);
    } else if (meeple instanceof Player) {
      categorized.player.push(meeple);
    } else if (meeple instanceof SpaceApartments) {
      categorized.spaceapartments.push(meeple);
    } else if (meeple instanceof Bartender) {
      categorized.bartenders.push(meeple);
    }
  }

  return categorized;
}

/**
 * Calculates counts of meeples by type from categorized meeples.
 */
function calculateMeepleCounts(categorized: CategorizedMeeples): MeepleCounts {
  return {
    player: categorized.player.length,
    traders: categorized.traders.length,
    miners: categorized.miners.length,
    asteroids: categorized.asteroids.length,
    stations: categorized.stations.length,
    spacebars: categorized.spacebars.length,
    spaceapartments: categorized.spaceapartments.length,
    bartenders: categorized.bartenders.length,
  };
}

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
 * Each station produces one specific product type made from ore.
 * Creates one station per product type that can be made with ore.
 */
function createSpaceStations(game: Game): void {
  // Get all product types that can be made with ore
  const productTypes = Object.values(Products);
  
  // Create one station per product type
  for (const productType of productTypes) {
    const spaceStation = new SpaceStation(
      getRandomPosition(),
      generateSpaceName(),
      productType
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
 * Creates bartender entities - configured number of bartenders per space bar.
 * Bartenders work at space bars to earn money.
 */
function createBartenders(game: Game): void {
  // Find all space bars in the scene
  const spaceBars = game.currentScene.actors.filter(
    (actor: Actor) => actor instanceof SpaceBar
  ) as SpaceBar[];

  // Create configured number of bartenders for each space bar
  for (const spaceBar of spaceBars) {
    for (let i = 0; i < ENTITY_COUNTS.BARTENDERS_PER_BAR; i++) {
      // Position bartenders near the space bar (within 50 pixels)
      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 100;
      const bartenderPosition = new Vector(
        spaceBar.pos.x + offsetX,
        spaceBar.pos.y + offsetY
      );

      const bartender = new Bartender(
        bartenderPosition,
        DEFAULT_SHIP_SPEED,
        generateSpaceName()
      );
      bartender.name = generateSpaceName();
      game.currentScene.add(bartender);
    }
  }
}

/**
 * Initializes all game entities in the correct order.
 * This includes the player, background stars, and all NPC entities.
 */
function initializeGameEntities(game: Game): void {
  initializePlayer(game);
  createStarTilemap(game);
  createSpaceStations(game);
  createAsteroids(game);
  createMiners(game);
  createTraders(game);
  createSpaceBars(game);
  createBartenders(game); // Create bartenders after space bars so they can be positioned near them
  createSpaceApartments(game);
}

// ============================================================================
// Canvas Utilities
// ============================================================================


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
// Context Type
// ============================================================================

/** Tab type for filtering entities */
export type TabType =
  | "player"
  | "traders"
  | "miners"
  | "stations"
  | "asteroids"
  | "spacebars"
  | "spaceapartments"
  | "bartenders"
  | "all"
  | "readme";

/** Type for the game context value */
type GameContextValue = {
  game: Game | null;
  isLoading: boolean;
  meeples: Meeple[];
  activeMeeple: Meeple | null;
  categorizedMeeples: CategorizedMeeples;
  meepleCounts: MeepleCounts;
  getFilteredEntities: (tab: TabType) => Meeple[];
  zoomToEntity: (meeple: Meeple) => void;
};

// ============================================================================
// Context Creation
// ============================================================================

/**
 * React Context for accessing game state and functions.
 * Use `useGame` hook to access this context.
 */
const GameContext = createContext<GameContextValue | undefined>(undefined);

// ============================================================================
// Internal Hook (used by Provider)
// ============================================================================

/**
 * Internal hook that manages the game state and lifecycle.
 * This is used by the GameProvider component.
 * 
 * This hook:
 * - Initializes the Excalibur game engine on mount
 * - Periodically updates the meeple list for React to render
 * - Manages camera zoom to specific entities
 * - Provides a function to zoom to any meeple
 * 
 * @returns Game state and utility functions
 */
function useGameInternal(): GameContextValue {
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
      console.log("Updating meeple list");
      if (gameRef.current) {
        console.log("Game ref current", gameRef.current);
        const meeples = gameRef.current.currentScene.actors.filter(
          (actor: Actor) => actor instanceof Meeple
        ) as Meeple[];
        console.log("Meeples", meeples);
        dispatch({ type: "set-meeples", payload: meeples });
      }
    }, MEEPLE_LIST_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // Update camera to follow the active meeple when it changes
  useEffect(() => {
    if (gameState.activeMeeple && gameRef.current) {
      gameRef.current.currentScene.camera.strategy.lockToActor(gameState.activeMeeple);
    }
  }, [gameState.activeMeeple]);

  /**
   * Gets filtered entities based on the active tab.
   * Uses memoized categorized meeples for optimal performance.
   */
  const getFilteredEntities = useCallback(
    (tab: TabType): Meeple[] => {
      if (tab === "readme") {
        return [];
      }
      return gameState.categorizedMeeples[tab] || [];
    },
    [gameState.categorizedMeeples]
  );

  return {
    ...gameState,
    getFilteredEntities,
    /**
     * Zooms the camera to follow a specific meeple entity.
     * @param meeple - The meeple entity to zoom to
     */
    zoomToEntity: (meeple: Meeple) => {
      dispatch({ type: "zoom-to-entity", payload: meeple });
    },
  };
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Provider component that makes game state available to all child components.
 * Wrap your app with this component to enable game context access.
 * 
 * @param children - React children components
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const value = useGameInternal();
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ============================================================================
// Public Hook
// ============================================================================

/**
 * Custom React hook to access the game context.
 * 
 * This hook provides access to:
 * - `game`: The Excalibur Game instance (null while loading)
 * - `isLoading`: Whether the game is still initializing
 * - `meeples`: Array of all meeple entities in the game
 * - `activeMeeple`: The currently selected/followed meeple
 * - `zoomToEntity`: Function to zoom the camera to a specific meeple
 * 
 * @returns Game state and utility functions
 * @throws {Error} If used outside of GameProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { game, meeples, zoomToEntity } = useGame();
 *   // Use game state...
 * }
 * ```
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
