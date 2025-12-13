import { useEffect, useMemo, useReducer, useRef } from "react";
import { useFps } from "react-fps";
import Markdown from "react-markdown";
import { IconRocket } from "@tabler/icons-react";

import { useGame, type TabType } from "./hooks/useGame";

import { Tabs } from "./components/Tabs";

import { Player } from "./entities/Player";

import "./App.css";
import { MeepleCard } from "./components/MeepleCard";
import { useKeyboardControls } from "./hooks/useKeyboardControls";


type SetActiveTabAction = {
  type: "set-active-tab";
  payload: TabType;
};

type SetReadmeContentAction = {
  type: "set-readme-content";
  payload: string;
};

type Action = SetActiveTabAction | SetReadmeContentAction;

type State = {
  activeTab: TabType;
  readmeContent: string;
};

const initialState: State = {
  activeTab: "player",
  readmeContent: "",
};

function App() {
  const {
    game,
    meeples,
    zoomToEntity,
    activeMeeple,
    meepleCounts,
    getFilteredEntities,
    zoom,
    setZoom,
  } = useGame();
  const cardRefs = useRef<Map<number | string, HTMLDivElement>>(new Map());

  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "set-active-tab": {
        return {
          ...state,
          activeTab: action.payload,
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

  const { avgFps, maxFps, currentFps } = useFps(20);

  const filteredEntities = useMemo(
    () => getFilteredEntities(state.activeTab),
    [getFilteredEntities, state.activeTab]
  );

  // keyboard
  useKeyboardControls(
    game,
    meeples.find((meeple) => meeple instanceof Player) || null
  );

  return (
    <main className="w-screen h-screen flex flex-col">
      {/* Sticky navbar at the top */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="flex-1 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2 px-2 w-full">
            <div className="flex items-center gap-2">
              <IconRocket size={28} className="text-primary" />
              <h1 className="text-2xl font-bold text-base-content">
                Space Pants
              </h1>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 px-4">
              <label className="text-sm text-base-content">Zoom</label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(((zoom - 0.3) / (5.0 - 0.3)) * 100)}
                onChange={(e) => {
                  const rangeValue = parseInt(e.target.value, 10);
                  const zoomValue = 0.3 + (rangeValue / 100) * (5.0 - 0.3);
                  setZoom(zoomValue);
                }}
                className="range range-primary w-32"
              />
              <span className="text-sm text-base-content min-w-[3rem]">
                {zoom.toFixed(1)}x
              </span>
            </div>
          </div>
          <Tabs
            activeTab={state.activeTab}
            onTabChange={(tab) =>
              dispatch({ type: "set-active-tab", payload: tab })
            }
            meepleCounts={meepleCounts}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-md flex flex-col overflow-y-auto border-r border-base-300">
          {filteredEntities.map((entity, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) {
                  cardRefs.current.set(entity.id, el);
                } else {
                  cardRefs.current.delete(entity.id);
                }
              }}
              className={`card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border rounded-lg p-4 m-2 ${
                activeMeeple?.id === entity.id
                  ? "border-primary border-2"
                  : "border-base-300"
              }`}
            >
              <MeepleCard
                meeple={entity}
                onMeepleNameClick={() => zoomToEntity(entity)}
                activeEntity={activeMeeple}
                onScrollToCard={() => {
                  const cardElement = cardRefs.current.get(entity.id);
                  cardElement?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }}
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
          <canvas id="game-canvas" className="w-full h-full" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 text-sm text-white">
        {`FPS: ${currentFps} Avg: ${avgFps} Max: ${maxFps}`}
      </div>
    </main>
  );
}

export default App;
