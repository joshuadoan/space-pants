import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { Game } from "./Game";
import { createStarTilemap } from "../utils/createStarTilemap";
import { COUNTS, GAME_HEIGHT, GAME_WIDTH } from "../consts";
import { createEntityGraphic, EntityGraphicStyle } from "../utils/graphics";
import { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { MeepleRoles } from "../types";
import { IF_NO_MONEY_MINE_ORE, IF_LOW_ORE_GENERATE_ORE, IF_ORE_SELL_TO_SPACE_STORE, IF_ORE_TURN_INTO_MONEY, IF_LOW_FIZZY_DRINK_BUY_FIZZY_DRINK, IF_HIGH_FIZZY_DRINK_RESTOCK_BAR, IF_HAS_MONEY_BUY_FIZZY_DRINK } from "./conditions";
import { generateSpaceName } from "../utils/generateSpaceName";
import { MIN_SHIP_DEFAULT_SPEED, MAX_SHIP_DEFAULT_SPEED } from "../consts";

type GameActionStart = {
  type: "start-game";
};
type GameActionUpdate = {
  type: "update-game";
  meeples: Meeple[];
};

type GameActionSetFilterbyRole = {
  type: "set-filterby-role";
  filters: {
    [key in MeepleRoles]: boolean;
  };
};

type GameAction =
  | GameActionStart
  | GameActionUpdate
  | GameActionSetFilterbyRole;

type GameContextValue = {
  hasStarted: boolean;
  meeples: Meeple[];
  filterbyRole: {
    [key in MeepleRoles]: boolean;
  };
  setFilterbyRole: (filters: {
    [key in MeepleRoles]: boolean;
  }) => void;
  lockCameraToMeeple: (meeple: Meeple) => void;
};

const initialState = {
  hasStarted: false,
  meeples: [],
  filterbyRole: {
    [MeepleRoles.Miner]: true,
    [MeepleRoles.Asteroid]: false,
    [MeepleRoles.SpaceStore]: false,
    [MeepleRoles.SpaceBar]: false,
    [MeepleRoles.SpaceApartment]: false,
    [MeepleRoles.Bartender]: false,
  },
};

// ============================================================================
// Reducer
// ============================================================================

/**
 * Reducer function to manage game state updates.
 * Handles all game-related state changes in a predictable way.
 */
function gameReducer(
  state: GameContextValue,
  action: GameAction
): GameContextValue {
  switch (action.type) {
    case "start-game":
      return {
        ...state,
        hasStarted: true,
      };
    case "update-game":
      return {
        ...state,
        meeples: action.meeples,
      };
    case "set-filterby-role":
      const filters = action.filters;
      return {
        ...state,
        filterbyRole: filters,
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
  const [gameState, dispatch] = useReducer(gameReducer, {
    ...initialState,
    setFilterbyRole: (filters: {
      [key in MeepleRoles]: boolean;
    }) => {
      dispatch({ type: "set-filterby-role", filters: filters });
    },
    lockCameraToMeeple: (meeple: Meeple) => {
      gameRef.current?.currentScene.camera.strategy.lockToActor(meeple);
    },
  });
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const game = new Game(GAME_WIDTH, GAME_HEIGHT);
    const tilemap = createStarTilemap(game);

    for (let i = 0; i < COUNTS.ASTEROID; i++) {
      const Asteroid = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.Asteroid,
        inventory: {
          stuff: 0,
          money: 0,
          fizzy: 0,
        },
        conditions: [],
      });

      Asteroid.graphics.add(createEntityGraphic(EntityGraphicStyle.Asteroid));
      Asteroid.pos = new Vector(
        Math.random() * GAME_WIDTH,
        Math.random() * GAME_HEIGHT
      );

      Asteroid.name = generateSpaceName();
      Asteroid.conditions = [IF_LOW_ORE_GENERATE_ORE];
      Asteroid.home = Asteroid;
      game.currentScene.add(Asteroid);
    }

    for (let i = 0; i < COUNTS.SPACE_STORE; i++) {
      const SpaceStore = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.SpaceStore,
        inventory: {
          stuff: 0,
          money: 0,
          fizzy: 0,
        },
        conditions: [],
      });

      SpaceStore.graphics.add(
        createEntityGraphic(EntityGraphicStyle.SpaceStation)
      );
      SpaceStore.pos = new Vector(
        Math.random() * GAME_WIDTH,
        Math.random() * GAME_HEIGHT
      );

      SpaceStore.name = generateSpaceName();
      SpaceStore.conditions = [IF_ORE_TURN_INTO_MONEY];
      SpaceStore.home = SpaceStore;
      game.currentScene.add(SpaceStore);
    }

    const spaceBars: Meeple[] = [];
    for (let i = 0; i < COUNTS.SPACE_BAR; i++) {
      const SpaceBar = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.SpaceBar,
        inventory: {
          stuff: 0,
          money: 0,
          fizzy: 0,
        },
        conditions: [],
      });

      SpaceBar.graphics.add(
        createEntityGraphic(EntityGraphicStyle.SpaceBar)
      );
      SpaceBar.pos = new Vector(
        Math.random() * GAME_WIDTH,
        Math.random() * GAME_HEIGHT
      );

      SpaceBar.name = generateSpaceName();
      SpaceBar.conditions = [];
      SpaceBar.home = SpaceBar;
      game.currentScene.add(SpaceBar);
      spaceBars.push(SpaceBar);
    }

    for (let i = 0; i < COUNTS.SPACE_APARTMENT; i++) {
      const SpaceApartment = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.SpaceApartment,
        inventory: {
          stuff: 0,
          money: 0,
          fizzy: 0,
        },
        conditions: [],
      });

      SpaceApartment.graphics.add(
        createEntityGraphic(EntityGraphicStyle.SpaceApartments)
      );
      SpaceApartment.pos = new Vector(
        Math.random() * GAME_WIDTH,
        Math.random() * GAME_HEIGHT
      );

      SpaceApartment.name = generateSpaceName();
      SpaceApartment.conditions = [];
      SpaceApartment.home = SpaceApartment;
      game.currentScene.add(SpaceApartment);
    }

    for (let i = 0; i < COUNTS.MINER; i++) {
      const Miner = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.Miner,
        inventory: {
          stuff: 0,
          money: 0,
          fizzy: 0,
        },
        conditions: [],
      });

      Miner.graphics.add(createEntityGraphic(EntityGraphicStyle.Trader));
      Miner.pos = new Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2);

      Miner.conditions = [IF_NO_MONEY_MINE_ORE, IF_ORE_SELL_TO_SPACE_STORE, IF_HAS_MONEY_BUY_FIZZY_DRINK];
      Miner.speed =
        Math.random() * (MAX_SHIP_DEFAULT_SPEED - MIN_SHIP_DEFAULT_SPEED) +
        MIN_SHIP_DEFAULT_SPEED;
      Miner.name = generateSpaceName();
      // miner home is random space apartment
      Miner.home = game.getRandomMeepleByRole(MeepleRoles.SpaceApartment);
      game.currentScene.add(Miner);
    }

    for (let i = 0; i < spaceBars.length; i++) {
      const Bartender = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.Bartender,
        inventory: {
          stuff: 0,
          money: 0,
          fizzy: 0,
        },
        conditions: [],
      });

      Bartender.graphics.add(createEntityGraphic(EntityGraphicStyle.Bartender));
      Bartender.pos = new Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2);

      Bartender.conditions = [IF_LOW_FIZZY_DRINK_BUY_FIZZY_DRINK, IF_HIGH_FIZZY_DRINK_RESTOCK_BAR];
      Bartender.speed =
        Math.random() * (MAX_SHIP_DEFAULT_SPEED - MIN_SHIP_DEFAULT_SPEED) +
        MIN_SHIP_DEFAULT_SPEED;
      Bartender.name = generateSpaceName();
      Bartender.home = spaceBars[i];
      game.currentScene.add(Bartender);
    }

    // zom out and center camera in the game
    game.currentScene.camera.zoom = 0.5;
    game.currentScene.camera.pos = new Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2);

    game.currentScene.add(tilemap);
    gameRef.current = game;
    game.start();

    dispatch({ type: "start-game" });

    const interval = setInterval(() => {
      dispatch({ type: "update-game", meeples: meeples });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const meeples =
    gameRef.current?.currentScene.actors.filter(
      (actor): actor is Meeple => actor instanceof Meeple
    ) || [];

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        meeples: [...meeples],
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
