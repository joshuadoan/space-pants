import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import type { Actor } from "excalibur";
import { Vector } from "excalibur";

import { Asteroid } from "../entities/Asteroid";
import { Bartender } from "../entities/Bartender";
import { Game } from "../entities/Game";
import {
  ASTEROID_SIZE_RANGE,
  CAMERA_ZOOM,
  CANVAS_WAIT_CONFIG,
  DEFAULT_SHIP_SPEED,
  ENTITY_COUNTS,
  MEEPLE_LIST_UPDATE_INTERVAL_MS,
  TRADER_STARTING_MONEY,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../entities/game-config";
import { Meeple } from "../entities/Meeple/Meeple";
import { PirateDen } from "../entities/PirateDen";
import { MINER_RULES, PIRATE_RULES, TRADER_RULES } from "../entities/ruleTemplates";
import { SpaceApartments } from "../entities/SpaceApartments";
import { SpaceBar } from "../entities/SpaceBar";
import { SpaceStation } from "../entities/SpaceStation";
import { MeepleType, Products, Resources } from "../entities/types";
import { createEntityGraphic, EntityGraphicStyle } from "../entities/utils/createSpaceShipOutOfShapes";
import { generateSpaceName } from "../entities/utils/generateSpaceName";
import { createStarTilemap } from "../utils/createStarTilemap";

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

/** Action to set the camera zoom level */
type SetZoomAction = {
  type: "set-zoom";
  payload: number;
};

/** Union type of all possible game actions */
type GameAction = SetMeeplesAction | SetIsLoadingAction | SetGameAction | ZoomToEntityAction | SetZoomAction;

/** Categorized meeples by type */
type CategorizedMeeples = {
  traders: Meeple[];
  miners: Meeple[];
  spacebars: Meeple[];
  stations: Meeple[];
  asteroids: Meeple[];
  spaceapartments: Meeple[];
  bartenders: Meeple[];
  pirates: Meeple[];
  piratedens: Meeple[];
  all: Meeple[];
};

/** Counts of meeples by type */
type MeepleCounts = {
  traders: number;
  miners: number;
  asteroids: number;
  stations: number;
  spacebars: number;
  spaceapartments: number;
  bartenders: number;
  pirates: number;
  piratedens: number;
};

/** State shape for the game hook */
type GameState = {
  game: Game | null;
  isLoading: boolean;
  meeples: Meeple[];
  activeMeeple: Meeple | null;
  categorizedMeeples: CategorizedMeeples;
  meepleCounts: MeepleCounts;
  zoom: number;
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
  spaceapartments: [],
  bartenders: [],
  pirates: [],
  piratedens: [],
  all: [],
};

const emptyMeepleCounts: MeepleCounts = {
  traders: 0,
  miners: 0,
  asteroids: 0,
  stations: 0,
  spacebars: 0,
  spaceapartments: 0,
  bartenders: 0,
  pirates: 0,
  piratedens: 0,
};

const initialState: GameState = {
  game: null,
  isLoading: true,
  meeples: [],
  activeMeeple: null,
  categorizedMeeples: emptyCategorizedMeeples,
  meepleCounts: emptyMeepleCounts,
  zoom: CAMERA_ZOOM,
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
    case "set-zoom": {
      return {
        ...state,
        zoom: action.payload,
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
    spaceapartments: [],
    bartenders: [],
    pirates: [],
    piratedens: [],
    all: meeples,
  };

  for (const meeple of meeples) {
    if (meeple.type === MeepleType.Trader) {
      categorized.traders.push(meeple);
    } else if (meeple.type === MeepleType.Miner) {
      categorized.miners.push(meeple);
    } else if (meeple.type === MeepleType.SpaceBar) {
      categorized.spacebars.push(meeple);
    } else if (meeple.type === MeepleType.SpaceStation) {
      categorized.stations.push(meeple);
    } else if (meeple.type === MeepleType.Asteroid) {
      categorized.asteroids.push(meeple);
    } else if (meeple.type === MeepleType.SpaceApartments) {
      categorized.spaceapartments.push(meeple);
    } else if (meeple.type === MeepleType.Bartender) {
      categorized.bartenders.push(meeple);
    } else if (meeple.type === MeepleType.Pirate) {
      categorized.pirates.push(meeple);
    } else if (meeple.type === MeepleType.PirateDen) {
      categorized.piratedens.push(meeple);
    }
  }

  return categorized;
}

/**
 * Calculates counts of meeples by type from categorized meeples.
 */
function calculateMeepleCounts(categorized: CategorizedMeeples): MeepleCounts {
  return {
    traders: categorized.traders.length,
    miners: categorized.miners.length,
    asteroids: categorized.asteroids.length,
    stations: categorized.stations.length,
    spacebars: categorized.spacebars.length,
    spaceapartments: categorized.spaceapartments.length,
    bartenders: categorized.bartenders.length,
    pirates: categorized.pirates.length,
    piratedens: categorized.piratedens.length,
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
 * Initializes the camera at the center of the world.
 */
function initializeCamera(game: Game): void {
  const centerX = WORLD_WIDTH / 2;
  const centerY = WORLD_HEIGHT / 2;
  // Center the camera on the world
  game.currentScene.camera.pos = new Vector(centerX, centerY);
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
    // Destinations get themselves as their home
    spaceStation.home = spaceStation;
    
    const stationDesign = createEntityGraphic(EntityGraphicStyle.SpaceStation);
    spaceStation.graphics.use(stationDesign);
    
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
    // Destinations get themselves as their home
    asteroid.home = asteroid;
    game.currentScene.add(asteroid);
  }
}

/**
 * Creates miner entities that follow mining and trading rules.
 * Miners extract ore from asteroids and trade it at space stations.
 */
function createMiners(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.MINERS; i++) {
    const miner = new Meeple(getRandomPosition(), 1, generateSpaceName(), Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)]);
    miner.name = generateSpaceName();
    miner.type = MeepleType.Miner;
    miner.rules = MINER_RULES;
    miner.speed = DEFAULT_SHIP_SPEED;
    // Ships get a random apartment as their home
    miner.home = getRandomSpaceApartment(game);

    const minerDesign = createEntityGraphic(EntityGraphicStyle.Miner);
    miner.graphics.use(minerDesign);
    game.currentScene.add(miner);
  }
}

/**
 * Creates trader entities that buy and sell products.
 * Traders follow trading rules to move goods between stations.
 */
function createTraders(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.TRADERS; i++) {
    const trader = new Meeple(
      getRandomPosition(),
      1,
      generateSpaceName(),
      Object.values(Products)[
        Math.floor(Math.random() * Object.values(Products).length)
      ]
    );
    trader.name = generateSpaceName();
    trader.type = MeepleType.Trader;
    trader.rules = TRADER_RULES;
    trader.goods[Resources.Money] = TRADER_STARTING_MONEY;
    trader.speed = DEFAULT_SHIP_SPEED;
    // Ships get a random apartment as their home
    trader.home = getRandomSpaceApartment(game);

    const traderDesign = createEntityGraphic(EntityGraphicStyle.Trader);
    trader.graphics.use(traderDesign);
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
    // Destinations get themselves as their home
    spaceBar.home = spaceBar;
    
    const barDesign = createEntityGraphic(EntityGraphicStyle.SpaceBar);
    spaceBar.graphics.use(barDesign);
    
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
    // Destinations get themselves as their home
    spaceApartment.home = spaceApartment;
    
    const apartmentDesign = createEntityGraphic(EntityGraphicStyle.SpaceApartments);
    spaceApartment.graphics.use(apartmentDesign);
    
    game.currentScene.add(spaceApartment);
  }
}

/**
 * Gets a random space apartment from the scene.
 */
function getRandomSpaceApartment(game: Game): Meeple | null {
  const apartments = game.currentScene.actors.filter(
    (actor: Actor) => actor instanceof SpaceApartments
  ) as SpaceApartments[];
  if (apartments.length === 0) return null;
  return apartments[Math.floor(Math.random() * apartments.length)];
}

/**
 * Gets a random pirate den from the scene.
 */
function getRandomPirateDen(game: Game): Meeple | null {
  const pirateDens = game.currentScene.actors.filter(
    (actor: Actor) => actor instanceof PirateDen
  ) as PirateDen[];
  if (pirateDens.length === 0) return null;
  return pirateDens[Math.floor(Math.random() * pirateDens.length)];
}

/**
 * Creates pirate dens in the game world.
 */
function createPirateDens(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.PIRATE_DENS; i++) {
    const pirateDen = new PirateDen(
      getRandomPosition(),
      generateSpaceName()
    );
    pirateDen.name = generateSpaceName();
    // Destinations get themselves as their home
    pirateDen.home = pirateDen;
    
    const denDesign = createEntityGraphic(EntityGraphicStyle.SpaceApartments); // Using SpaceApartments style for now
    pirateDen.graphics.use(denDesign);
    
    game.currentScene.add(pirateDen);
  }
}

/**
 * Creates pirate entities that patrol the space.
 */
function createPirates(game: Game): void {
  for (let i = 0; i < ENTITY_COUNTS.PIRATES; i++) {
    const pirate = new Meeple(
      getRandomPosition(),
      DEFAULT_SHIP_SPEED,
      generateSpaceName(),
      Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)]
    );
    pirate.name = generateSpaceName();
    pirate.type = MeepleType.Pirate;
    pirate.rules = PIRATE_RULES;
    pirate.speed = DEFAULT_SHIP_SPEED;
    // Pirates get a random pirate den as their home
    pirate.home = getRandomPirateDen(game);
    
    const pirateDesign = createEntityGraphic(EntityGraphicStyle.Pirate);
    pirate.graphics.use(pirateDesign);
    
    game.currentScene.add(pirate);
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
      // Ships get a random apartment as their home
      bartender.home = getRandomSpaceApartment(game);
      
      const bartenderDesign = createEntityGraphic(EntityGraphicStyle.Bartender);
      bartender.graphics.use(bartenderDesign);
      
      game.currentScene.add(bartender);
    }
  }
}

/**
 * Initializes all game entities in the correct order.
 * This includes background stars and all NPC entities.
 */
function initializeGameEntities(game: Game): void {
  initializeCamera(game);
  createStarTilemap(game);
  createSpaceStations(game);
  createAsteroids(game);
  createSpaceBars(game);
  createSpaceApartments(game); // Create apartments before ships so they can be assigned as homes
  createPirateDens(game); // Create pirate dens before pirates so they can be assigned as homes
  createMiners(game);
  createTraders(game);
  createBartenders(game); // Create bartenders after space bars so they can be positioned near them
  createPirates(game); // Create pirates after pirate dens so they can be assigned as homes
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
  | "traders"
  | "miners"
  | "stations"
  | "asteroids"
  | "spacebars"
  | "spaceapartments"
  | "bartenders"
  | "pirates"
  | "piratedens"
  | "all"
  | "player"
  | "my-meeples"
  | "create"
  | "help";

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
  createMeeple: (graphicStyle: EntityGraphicStyle, name: string, position?: Vector) => Meeple | null;
  zoom: number;
  setZoom: (zoom: number) => void;
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
 * - Makes the camera follow the active meeple
 * - Provides a function to set the active meeple
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
        
        // Find and select the first trader as active once the game is loaded
        const traders = game.currentScene.actors.filter(
          (actor: Actor) => actor instanceof Meeple && actor.type === MeepleType.Trader
        ) as Meeple[];
        
        if (traders.length > 0) {
          dispatch({ type: "zoom-to-entity", payload: traders[0] });
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
    if (!gameRef.current) return;
    
    if (gameState.activeMeeple) {
      gameRef.current.currentScene.camera.strategy.lockToActor(gameState.activeMeeple);
    }
  }, [gameState.activeMeeple]);

  // Update camera zoom when zoom state changes
  useEffect(() => {
    if (!gameRef.current) return;
    gameRef.current.currentScene.camera.zoom = gameState.zoom;
  }, [gameState.zoom]);


  /**
   * Gets filtered entities based on the active tab.
   * Uses memoized categorized meeples for optimal performance.
   */
  const getFilteredEntities = useCallback(
    (tab: TabType): Meeple[] => {
      if (tab === "create" || tab === "player" || tab === "help") {
        return [];
      }
      if (tab === "my-meeples") {
        // Filter for Custom type meeples
        return gameState.meeples.filter((meeple) => meeple.type === MeepleType.Custom);
      }
      return gameState.categorizedMeeples[tab] || [];
    },
    [gameState.categorizedMeeples, gameState.meeples]
  );

  /**
   * Creates a new meeple with the specified graphic style, name, and optional position.
   * The meeple will have type "Custom" and will be added to the game scene.
   * 
   * @param graphicStyle - The EntityGraphicStyle to use for the meeple's appearance
   * @param name - The name of the meeple
   * @param position - Optional position vector. If not provided, uses a random position
   * @returns The created Meeple instance, or null if the game is not initialized
   */
  const createMeeple = useCallback(
    (graphicStyle: EntityGraphicStyle, name: string, position?: Vector): Meeple | null => {
      if (!gameRef.current) {
        console.warn("Cannot create meeple: game is not initialized");
        return null;
      }

      const meeplePosition = position || getRandomPosition();
      // Use a random product type for custom meeples
      const productType = Object.values(Products)[
        Math.floor(Math.random() * Object.values(Products).length)
      ];

      const meeple = new Meeple(
        meeplePosition,
        DEFAULT_SHIP_SPEED,
        name,
        productType
      );
      meeple.type = MeepleType.Custom;
      meeple.speed = DEFAULT_SHIP_SPEED;
      // Assign a random apartment as home
      meeple.home = getRandomSpaceApartment(gameRef.current);

      const meepleDesign = createEntityGraphic(graphicStyle);
      meeple.graphics.use(meepleDesign);

      gameRef.current.currentScene.add(meeple);

      return meeple;
    },
    []
  );

  return {
    ...gameState,
    getFilteredEntities,
    /**
     * Sets the active meeple entity.
     * @param meeple - The meeple entity to set as active
     */
    zoomToEntity: (meeple: Meeple) => {
      dispatch({ type: "zoom-to-entity", payload: meeple });
    },
    createMeeple,
    /**
     * Sets the camera zoom level.
     * @param zoom - The zoom level (typically between 0.5 and 5)
     */
    setZoom: (zoom: number) => {
      dispatch({ type: "set-zoom", payload: zoom });
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
 * - `activeMeeple`: The currently selected meeple (camera follows this)
 * - `zoomToEntity`: Function to set the active meeple (camera will follow it)
 * - `createMeeple`: Function to create a new custom meeple with specified graphic style and name
 * 
 * @returns Game state and utility functions
 * @throws {Error} If used outside of GameProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { game, meeples, zoomToEntity, createMeeple } = useGame();
 *   // Use game state...
 *   const newMeeple = createMeeple(EntityGraphicStyle.Miner, "My Custom Meeple");
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
