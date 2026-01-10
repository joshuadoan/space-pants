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
import {
  ifNoMoneyMineOre,
  ifLowOreGenerateOre,
  ifOreSellToSpaceStore,
  ifOreTurnIntoFizzy,
  ifLowFizzyDrinkBuyFizzyDrink,
  ifHighFizzyDrinkRestockBar,
  ifHasMoneyBuyFizzyDrink,
} from "./conditions";
import { generateSpaceName } from "../utils/generateSpaceName";
import {
  MIN_SHIP_DEFAULT_SPEED,
  MAX_SHIP_DEFAULT_SPEED,
  DEFAULT_INVENTORY,
} from "../consts";

type GameActionStart = {
  type: "start-game";
};
type GameActionUpdate = {
  type: "update-game";
  meeples: Meeple[];
};

type GameActionSetFilterBy = {
  type: "set-filter-by";
  role: MeepleRoles | null;
};

type GameAction =
  | GameActionStart
  | GameActionUpdate
  | GameActionSetFilterBy;

type GameContextValue = {
  hasStarted: boolean;
  meeples: Meeple[];
  filterBy: MeepleRoles | null;
  setFilterBy: (role: MeepleRoles | null) => void;
  lockCameraToMeeple: (meeple: Meeple) => void;
};

const initialState = {
  hasStarted: false,
  meeples: [],
  filterBy: MeepleRoles.Miner,
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
    case "set-filter-by":
      return {
        ...state,
        filterBy: action.role,
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
    setFilterBy: (role: MeepleRoles | null) => {
      dispatch({ type: "set-filter-by", role: role });
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
          ...DEFAULT_INVENTORY,
        },
        conditions: [],
      });

      Asteroid.graphics.add(createEntityGraphic(EntityGraphicStyle.Asteroid));
      Asteroid.pos = new Vector(
        Math.random() * GAME_WIDTH,
        Math.random() * GAME_HEIGHT
      );

      Asteroid.name = generateSpaceName();
      Asteroid.conditions = [ifLowOreGenerateOre()];
      Asteroid.home = Asteroid;
      game.currentScene.add(Asteroid);
    }

    for (let i = 0; i < COUNTS.SPACE_STORE; i++) {
      const SpaceStore = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.SpaceStore,
        inventory: {
          ...DEFAULT_INVENTORY,
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
      SpaceStore.conditions = [ifOreTurnIntoFizzy()];
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
          ...DEFAULT_INVENTORY,
        },
        conditions: [],
      });

      SpaceBar.graphics.add(createEntityGraphic(EntityGraphicStyle.SpaceBar));
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
          ...DEFAULT_INVENTORY,
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
          ...DEFAULT_INVENTORY,
        },
        conditions: [],
      });

      Miner.graphics.add(createEntityGraphic(EntityGraphicStyle.Trader));
      Miner.pos = new Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2);

      Miner.conditions = [
        ifHasMoneyBuyFizzyDrink(),
        ifOreSellToSpaceStore(),
        ifNoMoneyMineOre(),
      ];
      Miner.speed =
        Math.random() * (MAX_SHIP_DEFAULT_SPEED - MIN_SHIP_DEFAULT_SPEED) +
        MIN_SHIP_DEFAULT_SPEED;
      Miner.name = generateSpaceName();
      // miner home is random space apartment
      Miner.home = game.getRandomMeepleByRole(MeepleRoles.SpaceApartment);
      game.currentScene.add(Miner);
    }

    for (let i = 0; i < COUNTS.BARTENDER; i++) {
      const Bartender = new Meeple({
        width: 100,
        height: 100,
        roleId: MeepleRoles.Bartender,
        inventory: {
          ...DEFAULT_INVENTORY,
        },
        conditions: [],
      });

      Bartender.graphics.add(createEntityGraphic(EntityGraphicStyle.Bartender));
      Bartender.pos = new Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2);

      Bartender.conditions = [
        ifHighFizzyDrinkRestockBar(),
        ifLowFizzyDrinkBuyFizzyDrink(spaceBars[i]),
      ];
      Bartender.speed =
        Math.random() * (MAX_SHIP_DEFAULT_SPEED - MIN_SHIP_DEFAULT_SPEED) +
        MIN_SHIP_DEFAULT_SPEED;
      Bartender.name = generateSpaceName();
      Bartender.home = game.getRandomMeepleByRole(MeepleRoles.SpaceBar);
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
