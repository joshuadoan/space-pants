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
import { CurrencyType, Meeple, MeepleStateType, MiningType, ProductType, VitalsType } from "../entities/Meeple";
import { createEntityGraphic, EntityGraphicStyle } from "../utils/graphics";
import { Vector } from "excalibur";
import { RoleId } from "../entities/types";

export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 1000;

const COUNTS = {
  MINER: 1,
  ASTEROID: 3,
  SPACE_STORE: 1,
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

/** Action to update the meeples list */
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
  | SetMeeplesAction
  | ZoomToEntityAction;

/** State shape for the game context */
type GameState = {
  game: Game | null;
  meeples: Meeple[];
  isLoading: boolean;
  activeMeeple: Meeple | null;
};

/** Type for the game context value */
type GameContextValue = {
  game: Game | null;
  isLoading: boolean;
  meeples: Meeple[];
  zoomToEntity: (meeple: Meeple) => void;
};

// ============================================================================
// Initial State
// ============================================================================

const initialState: GameState = {
  game: null,
  meeples: [],
  isLoading: true,
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
    case "zoom-to-entity":
      return {
        ...state,
        activeMeeple: action.payload,
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
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (gameState.activeMeeple) {
      gameState.game?.currentScene.camera.strategy.lockToActor(
        gameState.activeMeeple
      );
    }
  }, [gameState.activeMeeple]);

  useEffect(() => {
    const game = new Game(1000, 1000);
    const tilemap = createStarTilemap(game);

    game.currentScene.add(tilemap);
    gameRef.current = game;
    game.start();

    for (let j = 0; j < COUNTS.ASTEROID; j++) {
      const asteroid = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.Asteroid),
        name: `Asteroid ${j}`,
        state: { type: MeepleStateType.Idle },
        stats: {
          [VitalsType.Health]: 100,
          [VitalsType.Energy]: 100,
          [VitalsType.Happiness]: 100,
        },
        inventory: {
          [MiningType.Ore]: 0,
          [ProductType.Gruffle]: 0,
          [CurrencyType.Money]: 0,
        },
        speed: 0,
        inventoryGenerators: [
          {
            good: MiningType.Ore,
            minimum: 1,
            maximum: 100,
            perSecond: 1,
          },
        ],
        roleId: RoleId.Asteroid,
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
        name: `SpaceStore ${k}`,
        state: { type: MeepleStateType.Idle },
        stats: {
          [VitalsType.Health]: 100,
          [VitalsType.Energy]: 100,
          [VitalsType.Happiness]: 100,
        },
        inventory: {
          [MiningType.Ore]: 0,
          [ProductType.Gruffle]: 0,
          [CurrencyType.Money]: 100,
        },
        inventoryGenerators: [
          {
            good: CurrencyType.Money,
            minimum: 1,
            maximum: 100,
            perSecond: 1,
          },
        ],
        speed: 0,
        roleId: RoleId.SpaceStore,
      });

      game.currentScene.add(spaceStore);
    }

    for (let i = 0; i < COUNTS.MINER; i++) {
      const miner = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.Miner),
        name: `Miner ${i}`,
        state: { type: MeepleStateType.Idle },
        inventory: {
          [MiningType.Ore]: 0,
          [ProductType.Gruffle]: 0,
          [CurrencyType.Money]: 0,
        },
        stats: {
          [VitalsType.Health]: 100,
          [VitalsType.Energy]: 100,
          [VitalsType.Happiness]: 100,
        },
        inventoryGenerators: [],
        speed: 100,
        roleId: RoleId.Miner,
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
        dispatch({
          type: "set-meeples",
          payload: gameRef.current.currentScene.actors.filter(
            (actor): actor is Meeple => actor instanceof Meeple
          ),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const zoomToEntity = (meeple: Meeple) => {
    dispatch({ type: "zoom-to-entity", payload: meeple });
  };

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        zoomToEntity,
      }}
    >
      {children}
    </GameContext.Provider>
  );
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
 *
 * @returns Game state
 * @throws {Error} If used outside of GameProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { game, isLoading } = useGame();
 *   if (isLoading) return <div>Loading...</div>;
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
