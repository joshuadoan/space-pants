import { useEffect, useReducer } from "react";
import { useFps } from "react-fps";
import {
  IconUser,
  IconShip,
  IconPick,
  IconMeteor,
  IconSatellite,
  IconBeer,
  IconMoodSmile,
  IconCurrencyDollar,
  IconUsers,
} from "@tabler/icons-react";

import { useGame } from "./hooks/useGame";
import { useKeyboardControls } from "./hooks/useKeyboardControls";
import { useGameEntities } from "./hooks/useGameEntities";

import { Tabs } from "./components/Tabs";
import { GoodsDisplay } from "./components/GoodsDisplay";

import { Asteroid } from "./entities/Asteroid";
import { Meeple } from "./entities/Meeple";
import { Miner } from "./entities/Miner";
import { Player } from "./entities/Player";
import { SpaceBar } from "./entities/SpaceBar";
import { SpaceStation } from "./entities/SpaceStation";
import { Trader } from "./entities/Trader";
import { MeepleStateType, MeepleType } from "./entities/types";

import "./App.css";
import { Rules } from "./components/Rules";

type TabType =
  | "player"
  | "traders"
  | "miners"
  | "stations"
  | "asteroids"
  | "spacebars"
  | "all";

type SetActiveTabAction = {
  type: "set-active-tab";
  payload: TabType;
};

type ZoomToEntityAction = {
  type: "zoom-to-entity";
  payload: Meeple | null;
};

type Action = SetActiveTabAction | ZoomToEntityAction;

type State = {
  activeTab: TabType;
  activeEntity: Meeple | null;
};

const initialState: State = {
  activeTab: "miners",
  activeEntity: null,
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

  // Consolidate keyboard controls (game movement + scroll prevention)
  useKeyboardControls(
    gameRef.current,
    gameEntitiesState.meeples.find((meeple) => meeple instanceof Player) || null
  );

  const { avgFps, maxFps, currentFps } = useFps(20);

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
        <nav className="w-sm flex flex-col overflow-y-auto border-r border-base-300">
          {{
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
          }[state.activeTab].map((entity, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-base-300 rounded-lg p-4 m-2"
            >
              <div className="card-body p-0 gap-2">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className="font-semibold text-base text-base-content truncate flex-1 cursor-pointer hover:text-primary"
                    title={`Click to zoom to ${entity.name}`}
                    role="button"
                    onClick={() => {
                      dispatch({ type: "zoom-to-entity", payload: entity });
                    }}
                  >
                    {entity.name}
                  </h3>
                  <span className="text-sm text-base-content/50">
                    pos {Math.round(entity.pos.x)}° {Math.round(entity.pos.y)}°
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {
                    {
                      [MeepleType.Player]: (
                        <span className="badge badge-sm badge-success badge-outline flex items-center gap-1">
                          <IconUser size={14} />
                          Player
                        </span>
                      ),
                      [MeepleType.Trader]: (
                        <span className="badge badge-sm badge-primary badge-outline flex items-center gap-1">
                          <IconShip size={14} />
                          Trader
                        </span>
                      ),
                      [MeepleType.Miner]: (
                        <span className="badge badge-sm badge-secondary badge-outline flex items-center gap-1">
                          <IconPick size={14} />
                          Miner
                        </span>
                      ),
                      [MeepleType.Asteroid]: (
                        <span className="badge badge-sm badge-accent badge-outline flex items-center gap-1">
                          <IconMeteor size={14} />
                          Asteroid
                        </span>
                      ),
                      [MeepleType.SpaceStation]: (
                        <span className="badge badge-sm badge-info badge-outline flex items-center gap-1">
                          <IconSatellite size={14} />
                          Space Station
                        </span>
                      ),
                      [MeepleType.SpaceBar]: (
                        <span className="badge badge-sm badge-warning badge-outline flex items-center gap-1">
                          <IconBeer size={14} />
                          Space Bar
                        </span>
                      ),
                    }[entity.type]
                  }
                  {
                    {
                      [MeepleStateType.Idle]: (
                        <span className="badge badge-sm badge-ghost badge-outline flex items-center gap-1">
                          <IconMoodSmile size={14} />
                          Idle
                        </span>
                      ),
                      [MeepleStateType.Mining]: (
                        <span className="badge badge-sm badge-secondary badge-outline flex items-center gap-1">
                          <IconPick size={14} />
                          Mining
                        </span>
                      ),
                      [MeepleStateType.Traveling]: (
                        <span className="badge badge-sm badge-primary badge-outline flex items-center gap-1">
                          <IconShip size={14} />
                          Traveling to{" "}
                          {entity.state.type === MeepleStateType.Traveling &&
                            entity.state.target.type}
                        </span>
                      ),
                      [MeepleStateType.Trading]: (
                        <span className="badge badge-sm badge-warning badge-outline flex items-center gap-1">
                          <IconCurrencyDollar size={14} />
                          Trading
                        </span>
                      ),
                      [MeepleStateType.Socializing]: (
                        <span className="badge badge-sm badge-info badge-outline flex items-center gap-1">
                          <IconUsers size={14} />
                          Socializing
                        </span>
                      ),
                    }[entity.state.type]
                  }
                </div>
                <div className="divider my-1"></div>
                <GoodsDisplay goods={entity.goods} />
                {/* <-- Visitors */}
                <div className="divider my-1"></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-base-content flex items-center gap-1">
                      <IconUsers size={16} />
                      Visitors
                    </span>
                    <span className="badge badge-sm badge-ghost">
                      {entity.visitors.size}
                    </span>
                  </div>
                  {entity.visitors.size > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(entity.visitors).map((visitor) => (
                        <div
                          key={visitor.name}
                          className="badge badge-sm badge-primary badge-outline hover:badge-primary transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch({
                              type: "zoom-to-entity",
                              payload: visitor,
                            });
                          }}
                          title={`Click to zoom to ${visitor.name}`}
                        >
                          {
                            {
                              [MeepleType.Player]: <IconUser size={14} />,
                              [MeepleType.Trader]: <IconShip size={14} />,
                              [MeepleType.Miner]: <IconPick size={14} />,
                              [MeepleType.Asteroid]: <IconMeteor size={14} />,
                              [MeepleType.SpaceStation]: <IconSatellite size={14} />,
                              [MeepleType.SpaceBar]: <IconBeer size={14} />,
                            }[visitor.type]
                          }{" "}
                          {visitor.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-base-content/50 italic">
                      No visitors
                    </div>
                  )}
                </div>
                {state?.activeEntity?.id === entity.id && (
                  <>
                    <div className="divider my-1"></div>
                    <Rules
                      rules={entity.rules}
                      onUpdateRules={(rules) => {
                        entity.rules = rules;
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
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
