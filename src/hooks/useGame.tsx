import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { Game } from "../entities/Game";
import { createStarTilemap } from "../utils/createStarTilemap";

import { createEntityGraphic, EntityGraphicStyle } from "../utils/graphics";
import { Vector } from "excalibur";
import {
  CurrencyType,
  MiningType,
  ProductType,
  RoleId,
  VitalsType,
} from "../entities/types";
import { generateSpaceName } from "../utils/generateSpaceName";
import { Meeple, type MeepleState } from "../entities/Meeple";
import { GENERATORS, RULES } from "../rules/rules";

const GAME_SPEED = 1;

export const GAME_WIDTH = 2500;
export const GAME_HEIGHT = 2500;

const COUNTS = {
  MINER: 42,
  ASTEROID: 17,
  SPACE_STORE: 4,
  SPACE_BAR: 2,
  SPACE_APARTMENT: 2,
};

const MIN_SHIP_DEFAULT_SPEED = 50;
const MAX_SHIP_DEFAULT_SPEED = 150;

const initialMeeplState: MeepleState = {
  inventory: {
    [MiningType.Ore]: 0,
    [ProductType.Gruffle]: 0,
    [ProductType.Fizzy]: 0,
    [CurrencyType.Money]: 0,
  },
  stats: {
    [VitalsType.Health]: 100,
    [VitalsType.Energy]: 100,
    [VitalsType.Happiness]: 100,
  },
  speed:
    Math.random() * (MAX_SHIP_DEFAULT_SPEED - MIN_SHIP_DEFAULT_SPEED) +
    MIN_SHIP_DEFAULT_SPEED * GAME_SPEED,
  name: "idle",
};

// ============================================================================
// Types
// ============================================================================

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

type SetMeeplesAction = {
  type: "set-meeples";
  payload: Meeple[];
};
type ZoomToEntityAction = {
  type: "zoom-to-entity";
  payload: Meeple;
};

/** Union type of all possible game actions */
type GameAction =
  | SetIsLoadingAction
  | SetGameAction
  | ZoomToEntityAction
  | SetMeeplesAction;

/** State shape for the game context */
type GameState = {
  game: Game | null;
  isLoading: boolean;
};

/** Type for the game context value */
type GameContextValue = {
  game: Game | null;
  isLoading: boolean;
  zoomToEntity: (meeple: Meeple) => void;
  getMeepleById: (id: string) => Meeple | undefined;
  centerCameraInGame: () => void;
  setZoom: (zoom: number) => void;
};

// ============================================================================
// Initial State
// ============================================================================

const initialState: GameState = {
  game: null,
  isLoading: true,
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
    default:
      return state;
  }
}

// ============================================================================
// Context Creation
// ============================================================================

/**
 * React Context for accessing game state and functions.
 * Use `useGame` hook to access this context.
 */
const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const game = new Game(GAME_WIDTH, GAME_HEIGHT);
    const tilemap = createStarTilemap(game);

    game.currentScene.add(tilemap);
    gameRef.current = game;
    game.start();

    for (let i = 0; i < COUNTS.SPACE_APARTMENT; i++) {
      const spaceApartment = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.SpaceApartments),
        name: generateSpaceName(),
        state: initialMeeplState,
        roleId: RoleId.SpaceApartments,
        rulesMapGenerator: GENERATORS[RoleId.SpaceApartments],
        rulesMapRules: RULES[RoleId.SpaceApartments],
        journal: [],
      });
      game.currentScene.add(spaceApartment);
    }

    for (let j = 0; j < COUNTS.ASTEROID; j++) {
      const asteroid = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.Asteroid),
        name: generateSpaceName(),
        state: initialMeeplState,
        roleId: RoleId.Asteroid,
        rulesMapGenerator: GENERATORS[RoleId.Asteroid],
        rulesMapRules: RULES[RoleId.Asteroid],
        journal: [],
      });

      game.currentScene.add(asteroid);
    }

    // Create SpaceStores
    for (let k = 0; k < COUNTS.SPACE_STORE; k++) {
      const spaceStore = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.SpaceStation),
        name: generateSpaceName(),
        state: initialMeeplState,
        roleId: RoleId.SpaceStore,
        rulesMapGenerator: GENERATORS[RoleId.SpaceStore],
        rulesMapRules: RULES[RoleId.SpaceStore],
        journal: [],
      });
      game.currentScene.add(spaceStore);
    }

    // Create SpaceBars
    for (let l = 0; l < COUNTS.SPACE_BAR; l++) {
      const spaceBar = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.SpaceBar),
        name: generateSpaceName(),
        state: initialMeeplState,
        roleId: RoleId.SpaceBar,
        rulesMapGenerator: GENERATORS[RoleId.SpaceBar],
        rulesMapRules: RULES[RoleId.SpaceBar],
        journal: [],
      });

      game.currentScene.add(spaceBar);
    }

    for (let i = 0; i < COUNTS.MINER; i++) {
      const miner = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.Miner),
        name: generateSpaceName(),
        state: initialMeeplState,
        roleId: RoleId.Miner,
        rulesMapGenerator: GENERATORS[RoleId.Miner],
        rulesMapRules: RULES[RoleId.Miner],
        journal: [],
      });

      game.currentScene.add(miner);
    }

    dispatch({ type: "set-game", payload: game });
    dispatch({
      type: "set-meeples",
      payload: game.currentScene.actors.filter(
        (actor): actor is Meeple => actor instanceof Meeple
      ),
    });

    dispatch({ type: "set-is-loading", payload: false });

    const interval = setInterval(() => {
      if (gameRef.current) {
        dispatch({ type: "set-game", payload: game });
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const zoomToEntity = (meeple: Meeple) => {
    gameRef.current?.currentScene.camera.strategy.lockToActor(meeple);
  };

  const centerCameraInGame = () => {
    if (!gameState.game) return;
    gameState.game.currentScene.camera.pos = new Vector(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2
    );
  };

  const getMeepleById = (id: string) => {
    return gameState.game?.currentScene.actors.find(
      (actor): actor is Meeple =>
        actor instanceof Meeple && String(actor.id) === id
    );
  };

  const setZoom = (zoom: number) => {
    if (!gameState.game) return;
    gameState.game.currentScene.camera.zoom = zoom;
  };

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        zoomToEntity,
        getMeepleById,
        centerCameraInGame,
        setZoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
