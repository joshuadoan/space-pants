import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { Game } from "../entities/Game";
import { createStarTilemap } from "../utils/createStarTilemap";
import { Meeple } from "../entities/Meeple";
import { createSpaceShipOutOfShapes } from "../utils/createSpaceShipOutOfShapes";
import { Vector } from "excalibur";

export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 1000;
export const MEEPLE_COUNT = 42;

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

/** Union type of all possible game actions */
type GameAction = SetIsLoadingAction | SetGameAction;

/** State shape for the game context */
type GameState = {
  game: Game | null;
  isLoading: boolean;
};

/** Type for the game context value */
type GameContextValue = {
  game: Game | null;
  isLoading: boolean;
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
    const game = new Game(1000, 1000);
    const tilemap = createStarTilemap(game);

    game.currentScene.add(tilemap);
    gameRef.current = game;
    game.start();

    for (let i = 0; i < MEEPLE_COUNT; i++) {
      const meeple = new Meeple({
        position: new Vector(Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT),
        graphic: createSpaceShipOutOfShapes(),
        name: `Meeple ${i}`,
        state: { type: "idle" },
        inventory: { ore: 0 },
        vitals: { health: 100, energy: 100, happiness: 100 },
      });
      game.currentScene.add(meeple);
    }

    dispatch({ type: "set-game", payload: game });
    dispatch({ type: "set-is-loading", payload: false });

    // const interval = setInterval(() => {
    //   if (gameRef.current) {
    //     dispatch({ type: "set-game", payload: gameRef.current });
    //   }
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={gameState}>
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

