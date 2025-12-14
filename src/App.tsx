import { useMemo, useReducer, useRef } from "react";
import { useFps } from "react-fps";
import {
  IconBulb,
  IconClick,
  IconDice,
  IconDeviceFloppy,
  IconGripVertical,
  IconPlus,
  IconRocket,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { Vector } from "excalibur";

import { cloneElement, isValidElement } from "react";
import { MeepleCard } from "./components/MeepleCard";
import { Tabs } from "./components/Tabs";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./entities/game-config";
import { MeepleStats, Resources, type GoodType, MeepleType } from "./entities/types";
import { BUILT_IN_BEHAVIORS } from "./entities/ruleTemplates";
import { EntityGraphicStyle } from "./entities/utils/createSpaceShipOutOfShapes";
import { useGame, type TabType } from "./hooks/useGame";
import { getGoodIcon, getGoodLabel, getGoodMetadata } from "./utils/goodsMetadata";

import "./App.css";


type SetActiveTabAction = {
  type: "set-active-tab";
  payload: TabType;
};

type Action = SetActiveTabAction;

type State = {
  activeTab: TabType;
};

function App() {
  const {
    zoomToEntity,
    activeMeeple,
    meepleCounts,
    getFilteredEntities,
    createMeeple,
    meeples,
    zoom,
    setZoom,
    players,
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
  }, { activeTab: "traders" }); // Start with traders (ships tab)

  // Note: Removed auto-switch to my-meeples tab since we start with traders tab now

  const { avgFps, maxFps, currentFps } = useFps(20);

  const filteredEntities = useMemo(
    () => getFilteredEntities(state.activeTab),
    [getFilteredEntities, state.activeTab]
  );

  // Form state for creating new meeple
  type CreateMeepleFormState = {
    name: string;
    graphicStyle: EntityGraphicStyle;
    templateId: string; // Empty string means no template
    useRandomPosition: boolean;
    positionX: number;
    positionY: number;
  };

  type CreateMeepleFormAction =
    | { type: "set-name"; payload: string }
    | { type: "set-graphic-style"; payload: EntityGraphicStyle }
    | { type: "set-template-id"; payload: string }
    | { type: "set-use-random-position"; payload: boolean }
    | { type: "set-position-x"; payload: number }
    | { type: "set-position-y"; payload: number }
    | { type: "reset" };

  const [formState, dispatchForm] = useReducer(
    (state: CreateMeepleFormState, action: CreateMeepleFormAction): CreateMeepleFormState => {
      switch (action.type) {
        case "set-name":
          return { ...state, name: action.payload };
        case "set-graphic-style":
          return { ...state, graphicStyle: action.payload };
        case "set-template-id":
          return { ...state, templateId: action.payload };
        case "set-use-random-position":
          return { ...state, useRandomPosition: action.payload };
        case "set-position-x":
          return { ...state, positionX: action.payload };
        case "set-position-y":
          return { ...state, positionY: action.payload };
        case "reset":
          return {
            name: "",
            graphicStyle: EntityGraphicStyle.Default,
            templateId: "",
            useRandomPosition: true,
            positionX: WORLD_WIDTH / 2,
            positionY: WORLD_HEIGHT / 2,
          };
        default:
          return state;
      }
    },
    {
      name: "",
      graphicStyle: EntityGraphicStyle.Default,
      templateId: "",
      useRandomPosition: true,
      positionX: WORLD_WIDTH / 2,
      positionY: WORLD_HEIGHT / 2,
    }
  );

  const handleCreateEntity = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!formState.name.trim()) {
      return; // Don't create if name is empty
    }

    const position = formState.useRandomPosition
      ? undefined
      : new Vector(
          Math.max(0, Math.min(WORLD_WIDTH, formState.positionX)),
          Math.max(0, Math.min(WORLD_HEIGHT, formState.positionY))
        );

    // Find the selected template if one is chosen
    const selectedTemplate = formState.templateId
      ? BUILT_IN_BEHAVIORS.find((b) => b.id === formState.templateId)
      : undefined;

    const newMeeple = createMeeple(
      formState.graphicStyle,
      formState.name.trim(),
      position,
      selectedTemplate
    );
    
    if (newMeeple) {
      zoomToEntity(newMeeple);
      // Switch to my-meeples tab to see the newly created entity
      dispatch({ type: "set-active-tab", payload: "my-meeples" });
      // Reset form
      dispatchForm({ type: "reset" });
    }
  };

  const handleRandomizePosition = () => {
    dispatchForm({
      type: "set-position-x",
      payload: Math.random() * WORLD_WIDTH,
    });
    dispatchForm({
      type: "set-position-y",
      payload: Math.random() * WORLD_HEIGHT,
    });
  };

  // Compact goods display for header
  const getBadgeColor = (good: GoodType): string => {
    if (good === Resources.Money) {
      return "badge-success";
    }
    if (good === Resources.Ore) {
      return "badge-secondary";
    }
    // Products
    return "badge-primary";
  };

  const compactGoodsEntries = Object.entries(players.goods).filter(
    ([key, quantity]) => 
      quantity !== undefined && 
      quantity > 0 && 
      key !== MeepleStats.Health && 
      key !== MeepleStats.Energy
  );

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
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-base-content/70">Zoom</span>
                <span className="text-sm font-semibold text-base-content">{zoom.toFixed(1)}x</span>
              </div>
              <div className="w-32">
                <input
                  type="range"
                  min="0.3"
                  max="5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="range range-secondary range-sm"
                />
              </div>
            </div>
          </div>
          <div className="hidden md:block w-full">
            <div className="flex items-center justify-between gap-4 mb-2">
              <Tabs
                activeTab={state.activeTab}
                onTabChange={(tab) =>
                  dispatch({ type: "set-active-tab", payload: tab })
                }
                meepleCounts={meepleCounts}
                customMeeplesCount={meeples.filter((m) => m.type === MeepleType.Custom).length}
              />
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-base-200/50 rounded-lg border border-base-300 shadow-sm">
                  <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wide whitespace-nowrap">
                    Player
                  </span>
                  <div className="h-4 w-px bg-base-300" />
                  {compactGoodsEntries.length === 0 ? (
                    <span className="text-xs text-base-content/50 italic">No goods</span>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {compactGoodsEntries.map(([key, quantity]) => {
                        const good = key as GoodType;
                        const metadata = getGoodMetadata(good);
                        const icon = getGoodIcon(good, 14);
                        const label = metadata?.label || getGoodLabel(good);
                        const badgeColor = getBadgeColor(good);

                        const iconWithPointer = isValidElement(icon)
                          ? cloneElement(icon as React.ReactElement<{ className?: string }>, {
                              className: `${(icon.props as { className?: string }).className ?? ""} cursor-pointer`.trim(),
                            })
                          : icon;

                        return (
                          <div key={key} className="tooltip tooltip-bottom">
                            <div className="tooltip-content">
                              <div className="text-sm font-semibold text-base-content">
                                {label}: {quantity}
                              </div>
                            </div>
                            <div
                              className={`badge ${badgeColor} badge-sm gap-1 px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200 flex items-center`}
                            >
                              {iconWithPointer}
                              <span className="font-semibold text-xs">{quantity}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                onScrollToCard={() => {
                  const cardElement = cardRefs.current.get(entity.id);
                  cardElement?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }}
                isSelected={activeMeeple?.id === entity.id}
              />
            </div>
          ))}
          {state.activeTab === "create" && (
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border border-base-300 rounded-lg p-4 m-2">
              <div className="card-body">
                <h2 className="text-xl font-bold mb-4">Create New Entity</h2>
                <form onSubmit={handleCreateEntity} className="space-y-4">
                  {/* Name Input */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter entity name"
                      className="input input-bordered w-full"
                      value={formState.name}
                      onChange={(e) =>
                        dispatchForm({ type: "set-name", payload: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Graphic Style Selector */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Graphic Style</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={formState.graphicStyle}
                      onChange={(e) =>
                        dispatchForm({
                          type: "set-graphic-style",
                          payload: e.target.value as EntityGraphicStyle,
                        })
                      }
                    >
                      <option value={EntityGraphicStyle.Default}>Default</option>
                      <option value={EntityGraphicStyle.Miner}>Miner</option>
                      <option value={EntityGraphicStyle.Miner2}>Miner 2</option>
                      <option value={EntityGraphicStyle.Trader}>Trader</option>
                      <option value={EntityGraphicStyle.Trader2}>Trader 2</option>
                      <option value={EntityGraphicStyle.Bartender}>Bartender</option>
                      <option value={EntityGraphicStyle.Bartender2}>Bartender 2</option>
                      <option value={EntityGraphicStyle.Pirate}>Pirate</option>
                      <option value={EntityGraphicStyle.Police}>Police</option>
                      <option value={EntityGraphicStyle.CruiseShip}>Cruise Ship</option>
                      <option value={EntityGraphicStyle.GalacticZoo}>Galactic Zoo</option>
                      <option value={EntityGraphicStyle.SpaceStation}>Space Station</option>
                      <option value={EntityGraphicStyle.SpaceBar}>Space Bar</option>
                      <option value={EntityGraphicStyle.SpaceApartments}>Space Apartments</option>
                    </select>
                  </div>

                  {/* Template Selector */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Template</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={formState.templateId}
                      onChange={(e) =>
                        dispatchForm({
                          type: "set-template-id",
                          payload: e.target.value,
                        })
                      }
                    >
                      <option value="">None (Default Rules Only)</option>
                      {BUILT_IN_BEHAVIORS.map((behavior) => (
                        <option key={behavior.id} value={behavior.id}>
                          {behavior.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Position Options */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Position</span>
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={formState.useRandomPosition}
                        onChange={(e) =>
                          dispatchForm({
                            type: "set-use-random-position",
                            payload: e.target.checked,
                          })
                        }
                      />
                      <span className="label-text">Use random position</span>
                    </div>
                    {!formState.useRandomPosition && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="form-control flex-1">
                            <label className="label">
                              <span className="label-text text-xs">X</span>
                            </label>
                            <input
                              type="number"
                              className="input input-bordered input-sm"
                              min="0"
                              max={WORLD_WIDTH}
                              value={formState.positionX}
                              onChange={(e) =>
                                dispatchForm({
                                  type: "set-position-x",
                                  payload: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="form-control flex-1">
                            <label className="label">
                              <span className="label-text text-xs">Y</span>
                            </label>
                            <input
                              type="number"
                              className="input input-bordered input-sm"
                              min="0"
                              max={WORLD_HEIGHT}
                              value={formState.positionY}
                              onChange={(e) =>
                                dispatchForm({
                                  type: "set-position-y",
                                  payload: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs opacity-0">Random</span>
                            </label>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline"
                              onClick={handleRandomizePosition}
                              title="Randomize position"
                            >
                              <IconDice size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-base-content/50">
                          World size: {WORLD_WIDTH} × {WORLD_HEIGHT}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary flex items-center gap-2"
                      disabled={!formState.name.trim()}
                    >
                      <IconPlus size={16} />
                      Create New Entity
                    </button>
                  </div>
                </form>
                <p className="text-sm text-base-content/70 mt-4">
                  New entities start with zero goods and can be customized with behavior rules.
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
