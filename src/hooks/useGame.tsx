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
import {
  CurrencyType,
  Meeple,
  MeepleActionType,
  MeepleStateType,
  MiningType,
  ProductType,
  VitalsType,
} from "../entities/Meeple";
import { createEntityGraphic, EntityGraphicStyle } from "../utils/graphics";
import { Vector } from "excalibur";
import { Operator, RoleId } from "../entities/types";
import { generateSpaceName } from "../utils/generateSpaceName";

export const GAME_WIDTH = 2400;
export const GAME_HEIGHT = 2400;

const COUNTS = {
  MINER: 42,
  ASTEROID: 14,
  SPACE_STORE: 3,
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
    const game = new Game(GAME_WIDTH, GAME_HEIGHT);
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
        name: generateSpaceName(),
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
        roleId: RoleId.Asteroid,
        instructions: [],
      });

      game.currentScene.add(asteroid);

      asteroid.instructions = [
        {
          id: "generate-ore",
          name: "Generate Ore",
          conditions: [
            {
              good: MiningType.Ore,
              operator: Operator.LessThan,
              value: 100,
              target: asteroid,
            },
          ],
          actions: [
            {
              type: MeepleActionType.SetTarget,
              payload: {
                target: asteroid,
              },
            },
            {
              type: MeepleActionType.Transact,
              payload: {
                good: MiningType.Ore,
                quantity: 1,
                transactionType: "add",
              },
            },
            {
              type: MeepleActionType.Finish,
              payload: {
                state: {
                  type: MeepleStateType.Idle,
                },
              },
            },
          ],
        },
      ];
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
        roleId: RoleId.SpaceStore,
        instructions: [],
      });

      game.currentScene.add(spaceStore);
      spaceStore.instructions = [
        {
          id: "generate-money",
          name: "Generate Money",
          conditions: [
            {
              good: CurrencyType.Money,
              operator: Operator.LessThan,
              value: 100,
              target: spaceStore,
            },
          ],
          actions: [
            {
              type: MeepleActionType.SetTarget,
              payload: {
                target: spaceStore,
              },
            },
            {
              type: MeepleActionType.Transact,
              payload: {
                good: CurrencyType.Money,
                quantity: 1,
                transactionType: "add",
                target: spaceStore,
              },
            },
            {
              type: MeepleActionType.Finish,
              payload: {
                state: {
                  type: MeepleStateType.Idle,
                },
              },
            },
          ],
        },
      ];
    }

    for (let i = 0; i < COUNTS.MINER; i++) {
      const miner = new Meeple({
        position: new Vector(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT
        ),
        graphic: createEntityGraphic(EntityGraphicStyle.Miner),
        name: generateSpaceName(),
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
        speed: 100,
        roleId: RoleId.Miner,
        instructions: [],
      });

      game.currentScene.add(miner);

      miner.instructions = [
        {
          id: "mine_ore",
          name: "Mine Ore",
          conditions: [
            {
              good: MiningType.Ore,
              operator: Operator.LessThan,
              value: 1,
              target: miner,
            },
          ],
          actions: [
            {
              type: MeepleActionType.SetRandomTargetByRoleId,
              payload: {
                roleId: RoleId.Asteroid,
              },
            },
            {
              type: MeepleActionType.TravelTo,
              payload: {},
            },
            {
              type: MeepleActionType.Transact,
              payload: {
                good: MiningType.Ore,
                quantity: 1,
                transactionType: "remove",
              },
            },
            {
              type: MeepleActionType.SetTarget,
              payload: {
                target: miner,
              },
            },
            {
              type: MeepleActionType.Transact,
              payload: {
                good: MiningType.Ore,
                quantity: 1,
                transactionType: "add",
              },
            },
            {
              type: MeepleActionType.Finish,
              payload: {
                state: {
                  type: MeepleStateType.Idle,
                },
              },
            },
          ],
        },
        // if ore is greater than or equal to 10, sell to space store
        {
          id: "sell-ore-to-store",
          name: "Sell Ore to Space Store",
          conditions: [
            {
              good: MiningType.Ore,
              operator: Operator.GreaterThanOrEqual,
              value: 1,
              target: miner,
            },
          ],
          actions: [
            {
              type: MeepleActionType.SetRandomTargetByRoleId,
              payload: {
                roleId: RoleId.SpaceStore,
              },
            },
            {
              type: MeepleActionType.TravelTo,
              payload: {},
            },
            {
              type: MeepleActionType.Transact,
              payload: {
                good: MiningType.Ore,
                quantity: 1,
                transactionType: "remove",
                target: miner,
              },
            },
            {
              type: MeepleActionType.Transact,
              payload: {
                good: CurrencyType.Money,
                quantity: 1,
                transactionType: "add",
                target: miner,
              },
            },
            {
              type: MeepleActionType.Finish,
              payload: {
                state: {
                  type: MeepleStateType.Idle,
                },
              },
            },
          ],
        },
      ];
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
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const zoomToEntity = (meeple: Meeple) => {
    gameRef.current?.currentScene.camera.strategy.lockToActor(meeple);
  };

  const centerCameraInGame = () => {
    if (!gameState.game) return;
    gameState.game.currentScene.camera.pos = new Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2);
  };

  const getMeepleById = (id: string) => {
    return gameState.game?.currentScene.actors.find(
      (actor): actor is Meeple =>
        actor instanceof Meeple && String(actor.id) === id
    );
  };

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        zoomToEntity,
        getMeepleById,
        centerCameraInGame,
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
