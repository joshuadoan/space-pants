import { useEffect, useMemo, useReducer, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import cx from "classnames";

import { Meeple } from "../entities/Meeple";
import {
  CurrencyType,
  MiningType,
  ProductType,
  RoleId,
  UserActionType,
  type GoodType,
} from "../entities/types";
import { useGame } from "../hooks/useGame";
import { useMeepleFilters } from "../hooks/useMeepleFilters";
import { IconComponent } from "../utils/iconMap";
import { MeepleDetails } from "./MeepleDetail";
import { DEFAULT_ZOOM_VALUE, ZoomSlider } from "./ZoomSlider";
import { RulesVisualizer } from "./RulesVisualizer";
import { JournalVisualizer } from "./JournalVisualizer";
import { Help } from "./Help";

type State = {
  showUi: boolean;
  mainTab: "meeples" | "help";
  activeTab: "stats" | "rules" | "journal";
};

type ActionToggleShowUi = {
  type: "toggle-show-ui";
  payload: boolean;
};

type ActionSetMainTab = {
  type: "set-main-tab";
  payload: "meeples" | "help";
};

type ActionSetActiveTab = {
  type: "set-active-tab";
  payload: "stats" | "rules" | "journal";
};

type Action = ActionToggleShowUi | ActionSetMainTab | ActionSetActiveTab;

const initialState: State = {
  showUi: true,
  mainTab: "meeples",
  activeTab: "rules",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "toggle-show-ui":
      return { ...state, showUi: action.payload };
    case "set-main-tab":
      return { ...state, mainTab: action.payload };
    case "set-active-tab":
      return { ...state, activeTab: action.payload };
  }
};

export const MeeplesList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { id } = useParams<{ id: string }>();
  const {
    isLoading,
    game,
    zoomToEntity,
    centerCameraInGame,
    setZoom,
  } = useGame();
  const navigate = useNavigate();

  const meeples =
    game?.currentScene.actors.filter(
      (actor): actor is Meeple => actor instanceof Meeple
    ) || [];

  const { filteredMeeples, selectedFilter, setFilter } =
    useMeepleFilters(meeples);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredMeeples.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated height of each MeepleDetails item (will be measured dynamically)
    overscan: 5, // Render 5 extra items above and below viewport for smooth scrolling
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined, // Dynamic sizing for smooth scrolling (not supported in Firefox)
  });

  const selectedMeeple = useMemo(() => {
    return meeples.find((meeple) => String(meeple.id) === id);
  }, [id, meeples]);

  const aggregatedMiningStats = useMemo(() => {
    return meeples.reduce((acc: Record<MiningType, number>, meeple) => {
      for (const goodType of Object.values(MiningType)) {
        acc[goodType] =
          (acc[goodType] || 0) + (meeple.state.inventory[goodType] || 0);
      }
      return acc;
    }, {} as Record<GoodType, number>);
  }, [meeples]);

  const aggregatedProductStats = useMemo(() => {
    return meeples.reduce((acc: Record<ProductType, number>, meeple) => {
      for (const goodType of Object.values(ProductType)) {
        acc[goodType] =
          (acc[goodType] || 0) + (meeple.state.inventory[goodType] || 0);
      }
      return acc;
    }, {} as Record<ProductType, number>);
  }, [meeples]);

  const aggregatedCurrencyStats = useMemo(() => {
    return meeples.reduce((acc: Record<CurrencyType, number>, meeple) => {
      for (const goodType of Object.values(CurrencyType)) {
        acc[goodType] =
          (acc[goodType] || 0) + (meeple.state.inventory[goodType] || 0);
      }
      return acc;
    }, {} as Record<CurrencyType, number>);
  }, [meeples]);

  useEffect(() => {
    if (selectedMeeple) {
      zoomToEntity(selectedMeeple);
    }
  }, [selectedMeeple]);

  useEffect(() => {
    centerCameraInGame();
  }, []);

  useEffect(() => {
    if (id && !selectedMeeple) {
      navigate("/");
    }
  }, [id, selectedMeeple, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full p-2">
      <nav className="p-2 flex justify-between">
        <button
          onClick={() =>
            dispatch({ type: "toggle-show-ui", payload: !state.showUi })
          }
          className="btn btn-sm btn-outline flex items-center gap-1.5"
        >
          <IconComponent icon={UserActionType.HideUi} size={14} />
          <span>{state.showUi ? "Hide UI" : "Show UI"}</span>
        </button>
        <div className="flex items-center gap-2">
          {/* <-- stats  */}
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(aggregatedMiningStats).map(
              ([goodType, quantity]) => (
                <div
                  key={goodType}
                  className="badge badge-outline flex items-center gap-1.5 px-2 py-1"
                >
                  <IconComponent icon={goodType as MiningType} size={14} />
                  <span className="font-medium">{quantity}</span>
                </div>
              )
            )}
            {Object.entries(aggregatedProductStats).map(
              ([goodType, quantity]) => (
                <div
                  key={goodType}
                  className="badge badge-outline flex items-center gap-1.5 px-2 py-1"
                >
                  <IconComponent icon={goodType as ProductType} size={14} />
                  <span className="font-medium">{quantity}</span>
                </div>
              )
            )}
            {Object.entries(aggregatedCurrencyStats).map(
              ([goodType, quantity]) => (
                <div
                  key={goodType}
                  className="badge badge-outline flex items-center gap-1.5 px-2 py-1"
                >
                  <IconComponent icon={goodType as CurrencyType} size={14} />
                  <span className="font-medium">{quantity}</span>
                </div>
              )
            )}
          </div>
          <ZoomSlider
            zoom={game?.currentScene.camera.zoom || DEFAULT_ZOOM_VALUE}
            setZoom={setZoom}
          />
        </div>
      </nav>
      <div
        className={cx("flex justify-between items-center", {
          hidden: !state.showUi,
        })}
      >
        <div className="p-2 flex flex-col gap-2">
          <div className="tabs tabs-boxed">
            <button
              onClick={() => dispatch({ type: "set-main-tab", payload: "meeples" })}
              className={cx("tab flex items-center gap-1.5", {
                "tab-active": state.mainTab === "meeples",
              })}
            >
              <span>Meeples</span>
            </button>
            <button
              onClick={() => dispatch({ type: "set-main-tab", payload: "help" })}
              className={cx("tab flex items-center gap-1.5", {
                "tab-active": state.mainTab === "help",
              })}
            >
              <span>Help</span>
            </button>
          </div>
          {state.mainTab === "meeples" && (
            <>
              {id ? (
                <Link
                  to="/"
                  className="btn btn-sm btn-outline flex items-center gap-1.5"
                >
                  <IconComponent icon={UserActionType.Back} size={14} />
                  <span>Back</span>
                </Link>
              ) : (
                <div className="tabs tabs-boxed">
                  <button
                    onClick={() => setFilter(null)}
                    className={cx("tab flex items-center gap-1.5", {
                      "tab-active": selectedFilter === null,
                    })}
                  >
                    <span>All</span>
                  </button>
                  {Object.values(RoleId).map((roleId) => {
                    const isActive = selectedFilter === roleId;
                    return (
                      <button
                        key={roleId}
                        onClick={() => setFilter(roleId)}
                        className={cx("tab flex items-center gap-1.5", {
                          "tab-active": isActive,
                        })}
                      >
                        <IconComponent icon={roleId} size={14} />
                        <span>{roleId}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div
        className={cx("flex-1 p-2 overflow-y-auto", {
          hidden: !state.showUi,
        })}
        ref={!id && state.mainTab === "meeples" ? parentRef : undefined}
      >
        {state.mainTab === "help" && <Help />}
        {state.mainTab === "meeples" && !id && (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const meeple = filteredMeeples[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="mb-2"
                >
                  <MeepleDetails
                    className="w-sm"
                    key={meeple.id}
                    id={meeple.id}
                    name={meeple.name}
                    roleId={meeple.roleId}
                    state={meeple.state}
                    stats={{ ...meeple.state.stats }}
                    inventory={{ ...meeple.state.inventory }}
                    isSelected={id === String(meeple.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
        {state.mainTab === "meeples" && selectedMeeple ? (
          <div className="flex flex-col h-full">
            <MeepleDetails
              className="w-sm"
              key={selectedMeeple.id}
              id={selectedMeeple.id}
              name={selectedMeeple.name}
              roleId={selectedMeeple.roleId}
              state={selectedMeeple.state}
              stats={{ ...selectedMeeple.state.stats }}
              inventory={{ ...selectedMeeple.state.inventory }}
              isSelected={id === String(selectedMeeple.id)}
            />
            <div className="tabs tabs-boxed mb-2 shrink-0">
              <button
                onClick={() => dispatch({ type: "set-active-tab", payload: "rules" })}
                className={cx("tab flex items-center gap-1.5", {
                  "tab-active": state.activeTab === "rules",
                })}
              >
                <span>Rules</span>
              </button>
              <button
                onClick={() => dispatch({ type: "set-active-tab", payload: "journal" })}
                className={cx("tab flex items-center gap-1.5", {
                  "tab-active": state.activeTab === "journal",
                })}
              >
                <span>Journal</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {state.activeTab === "rules" && (
                <RulesVisualizer
                  className="w-sm"
                  rules={selectedMeeple.rulesMapRules}
                  stats={{ ...selectedMeeple.state.stats }}
                  inventory={{ ...selectedMeeple.state.inventory }}
                  currentStateName={selectedMeeple.state.name}
                />
              )}
              {state.activeTab === "journal" && (
                <JournalVisualizer
                  journal={[...selectedMeeple.journal]}
                  className="w-sm"
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
