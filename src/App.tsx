import { useMemo, useReducer, useRef } from "react";
import { useFps } from "react-fps";
import { IconRocket, IconPlus, IconBulb, IconGripVertical, IconDeviceFloppy, IconTrash, IconUser, IconClick } from "@tabler/icons-react";
import { Vector } from "excalibur";

import { useGame, type TabType } from "./hooks/useGame";
import { EntityGraphicStyle } from "./entities/utils/createSpaceShipOutOfShapes";

import { Tabs } from "./components/Tabs";

import "./App.css";
import { MeepleCard } from "./components/MeepleCard";


type SetActiveTabAction = {
  type: "set-active-tab";
  payload: TabType;
};

type Action = SetActiveTabAction;

type State = {
  activeTab: TabType;
};

const initialState: State = {
  activeTab: "my-meeples",
};

function App() {
  const {
    zoomToEntity,
    activeMeeple,
    meepleCounts,
    getFilteredEntities,
    createMeeple,
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

      default: {
        return state;
      }
    }
  }, initialState);

  const { avgFps, maxFps, currentFps } = useFps(20);

  const filteredEntities = useMemo(
    () => getFilteredEntities(state.activeTab),
    [getFilteredEntities, state.activeTab]
  );

  const handleCreateEntity = () => {
    const dummyName = `Entity-${Date.now()}`;
    const dummyPosition = new Vector(
      Math.random() * 2000,
      Math.random() * 2000
    );
    const newMeeple = createMeeple(
      EntityGraphicStyle.Default,
      dummyName,
      dummyPosition
    );
    if (newMeeple) {
      zoomToEntity(newMeeple);
      // Switch to my-meeples tab to see the newly created entity
      dispatch({ type: "set-active-tab", payload: "my-meeples" });
    }
  };

  return (
    <main className="w-screen h-screen flex flex-col">
      {/* Mobile message banner */}
      <div className="md:hidden bg-warning text-warning-content text-center py-2 px-4 text-sm font-semibold sticky top-0 z-50">
        Desktop is better
      </div>
      {/* Sticky navbar at the top */}
      <div className="navbar bg-base-100 shadow-lg sticky md:top-0 top-10 z-40">
        <div className="flex-1 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2 px-2 w-full">
            <div className="flex items-center gap-2">
              <IconRocket size={28} className="text-primary" />
              <h1 className="text-2xl font-bold text-base-content">
                Space Pants
              </h1>
            </div>
            <div className="flex-1" />
          </div>
          <div className="hidden md:block">
            <Tabs
              activeTab={state.activeTab}
              onTabChange={(tab) =>
                dispatch({ type: "set-active-tab", payload: tab })
              }
              meepleCounts={meepleCounts}
            />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <nav className="hidden md:flex w-md flex-col overflow-y-auto border-r border-base-300">
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
          {state.activeTab === "create" && (
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-base-300 rounded-lg p-4 m-2">
              <div className="card-body">
                <h2 className="text-xl font-bold mb-4">Create New Entity</h2>
                <button
                  className="btn btn-primary flex items-center gap-2"
                  onClick={handleCreateEntity}
                >
                  <IconPlus size={16} />
                  Create New Entity
                </button>
                <p className="text-sm text-base-content/70 mt-4">
                  Creates a new entity with zero goods at a random position.
                </p>
              </div>
            </div>
          )}
          {state.activeTab === "help" && (
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-base-300 rounded-lg p-4 m-2">
              <div className="card-body space-y-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <IconBulb size={24} className="text-warning" />
                  Help & Instructions
                </h2>

                {/* Selecting Meeples */}
                <div className="bg-base-200/50 rounded-lg p-4 space-y-3">
                  <div className="text-lg font-semibold text-base-content flex items-center gap-2">
                    <IconUser size={20} className="text-primary" />
                    Selecting & Viewing Meeples
                  </div>
                  <div className="text-sm text-base-content/80 space-y-2">
                    <div className="flex items-start gap-2">
                      <IconClick size={16} className="text-primary mt-0.5 shrink-0" />
                      <span><span className="font-semibold">Click on any meeple's name</span> in the entity card to zoom the camera to that meeple and follow it</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <IconUser size={16} className="text-secondary mt-0.5 shrink-0" />
                      <span>The <span className="font-semibold">active meeple</span> (the one you're following) will have a highlighted border around its card</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <IconRocket size={16} className="text-info mt-0.5 shrink-0" />
                      <span>Use the tabs at the top to filter entities by type (Traders, Miners, Stations, etc.)</span>
                    </div>
                  </div>
                </div>

                {/* Creating Rules */}
                <div className="bg-base-200/50 rounded-lg p-4 space-y-3">
                  <div className="text-lg font-semibold text-base-content flex items-center gap-2">
                    <IconBulb size={20} className="text-warning" />
                    How to Create Rules
                  </div>
                  <div className="text-sm text-base-content/80 space-y-2">
                    <p>
                      Rules work like: <span className="font-semibold text-primary">IF</span> [Good] [Operator] [Value] <span className="font-semibold text-primary">THEN</span> [Action]
                    </p>
                    <div className="space-y-1.5 pl-2 border-l-2 border-primary/30">
                      <div className="flex items-start gap-2">
                        <IconGripVertical size={14} className="text-base-content/50 mt-0.5 shrink-0" />
                        <span>Drag the <span className="font-semibold">≡</span> icon to reorder rules (they run in order!)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <IconPlus size={14} className="text-secondary mt-0.5 shrink-0" />
                        <span>Click <span className="font-semibold">"Add New Rule"</span> to create more rules</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <IconTrash size={14} className="text-error mt-0.5 shrink-0" />
                        <span>Click <span className="font-semibold">"Delete"</span> on any rule to remove it</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <IconDeviceFloppy size={14} className="text-success mt-0.5 shrink-0" />
                        <span>Don't forget to <span className="font-semibold">"Save Behaviors"</span> when you're done!</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creating Entities */}
                <div className="bg-base-200/50 rounded-lg p-4 space-y-3">
                  <div className="text-lg font-semibold text-base-content flex items-center gap-2">
                    <IconPlus size={20} className="text-info" />
                    Creating New Entities
                  </div>
                  <div className="text-sm text-base-content/80 space-y-2">
                    <p>
                      Go to the <span className="font-semibold text-primary">Player</span> tab and select <span className="font-semibold text-primary">Create</span> to create new custom entities.
                    </p>
                    <p>
                      New entities start with <span className="font-semibold">zero goods</span> and can be customized with your own behavior rules.
                    </p>
                    <p>
                      After creating, you'll automatically switch to the <span className="font-semibold">My Meeples</span> tab to see your new entity.
                    </p>
                  </div>
                </div>
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
