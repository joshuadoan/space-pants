import { useEffect, useMemo, useReducer } from "react";
import { useFps } from "react-fps";
import Markdown from "react-markdown";

import { useGame } from "./hooks/useGame";
import { useGameEntities } from "./hooks/useGameEntities";

import { Tabs } from "./components/Tabs";

import { Asteroid } from "./entities/Asteroid";
import { Meeple } from "./entities/Meeple";
import { Miner } from "./entities/Miner";
import { Player } from "./entities/Player";
import { SpaceBar } from "./entities/SpaceBar";
import { SpaceStation } from "./entities/SpaceStation";
import { Trader } from "./entities/Trader";
import { TreasureCollector } from "./entities/TreasureCollector";

import "./App.css";
import { MeepleCard } from "./components/MeepleCard";
import { SpaceApartments } from "./entities/SpaceApartments";
import { useKeyboardControls } from "./hooks/useKeyboardControls";

type TabType =
  | "player"
  | "traders"
  | "miners"
  | "stations"
  | "asteroids"
  | "spacebars"
  | "spaceapartments"
  | "treasurecollectors"
  | "all"
  | "readme";

type SetActiveTabAction = {
  type: "set-active-tab";
  payload: TabType;
};

type ZoomToEntityAction = {
  type: "zoom-to-entity";
  payload: Meeple | null;
};

type SetReadmeContentAction = {
  type: "set-readme-content";
  payload: string;
};

type Action = SetActiveTabAction | ZoomToEntityAction | SetReadmeContentAction;

type State = {
  activeTab: TabType;
  activeEntity: Meeple | null;
  readmeContent: string;
};

const initialState: State = {
  activeTab: "player",
  activeEntity: null,
  readmeContent: "",
};

function App() {
  const { game } = useGame();

  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "set-active-tab": {
        return {
          ...state,
          activeTab: action.payload,
        };
      }
      case "zoom-to-entity": {
        return {
          ...state,
          activeEntity: action?.payload || null,
        };
      }
      case "set-readme-content": {
        return {
          ...state,
          readmeContent: action.payload,
        };
      }

      default: {
        return state;
      }
    }
  }, initialState);

  const { gameRef, state: gameEntitiesState } = useGameEntities(game);

  useEffect(() => {
    if (state.activeEntity) {
      gameRef?.current?.currentScene.camera.strategy.lockToActor(
        state.activeEntity
      );
    }
  }, [state.activeEntity, gameRef]);

  async function getReadmeMarkdownFromFile() {
    try {
      // In Vite, we can import text files using ?raw suffix
      const readmeModule = await import("../README.md?raw");
      return readmeModule.default;
    } catch (error) {
      console.error("Failed to load README.md:", error);
      return "# Error\n\nFailed to load README.md file.";
    }
  }

  useEffect(() => {
    if (state.activeTab === "readme" && !state.readmeContent) {
      getReadmeMarkdownFromFile().then((content) =>
        dispatch({ type: "set-readme-content", payload: content })
      );
    }
  }, [state.activeTab, state.readmeContent]);

  // Auto-select first player when on player tab and no entity is selected
  useEffect(() => {
    if (state.activeTab === "player" && !state.activeEntity) {
      const players = gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof Player
      );
      if (players.length > 0) {
        dispatch({ type: "zoom-to-entity", payload: players[0] });
      }
    }
  }, [state.activeTab, state.activeEntity, gameEntitiesState.meeples]);

  const { avgFps, maxFps, currentFps } = useFps(20);

  const filteredEntities = useMemo(() => {
    return {
      traders: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof Trader
      ),
      miners: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof Miner
      ),
      spacebars: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof SpaceBar
      ),
      stations: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof SpaceStation
      ),
      asteroids: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof Asteroid
      ),
      player: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof Player
      ),
      all: [...gameEntitiesState.meeples],
      readme: [],
      spaceapartments: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof SpaceApartments
      ),
      treasurecollectors: gameEntitiesState.meeples.filter(
        (meeple) => meeple instanceof TreasureCollector
      ),
    }[state.activeTab];
  }, [state.activeTab, gameEntitiesState.meeples.length]);

  // keyboard
  useKeyboardControls(
    game,
    gameEntitiesState.meeples.find((meeple) => meeple instanceof Player) || null
  );

  return (
    <main className="w-screen h-screen flex flex-col">
      {/* Sticky navbar at the top */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="flex-1 flex flex-col items-start">
          <Tabs
            activeTab={state.activeTab}
            onTabChange={(tab) =>
              dispatch({ type: "set-active-tab", payload: tab })
            }
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-md flex flex-col overflow-y-auto border-r border-base-300">
          {filteredEntities.map((entity, index) => (
            <div
              key={index}
              className={`card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border rounded-lg p-4 m-2 ${
                state.activeEntity?.id === entity.id
                  ? "border-primary border-2"
                  : "border-base-300"
              }`}
            >
              <MeepleCard
                meeple={entity}
                onMeepleNameClick={() =>
                  dispatch({ type: "zoom-to-entity", payload: entity })
                }
                activeEntity={state.activeEntity}
              />
            </div>
          ))}
          {state.activeTab === "readme" && (
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-base-300 rounded-lg p-4 m-2">
              <div className="card-body">
                <Markdown>
                  {state.readmeContent || "Loading README..."}
                </Markdown>
              </div>
            </div>
          )}
        </nav>
        <div className="flex-1">
          <canvas id="game-canvas" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 text-sm text-white">
        {`FPS: ${currentFps} Avg: ${avgFps} Max: ${maxFps}`}
      </div>
    </main>
  );
}

export default App;
