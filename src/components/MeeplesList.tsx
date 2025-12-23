import { useGame } from "../hooks/useGame";
import { IconComponent } from "../utils/iconMap";
import { RoleId, UserActionType } from "../entities/types";
import { useMeepleFilters } from "../hooks/useMeepleFilters";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CurrencyType,
  Meeple,
  MeepleStateType,
  MiningType,
  ProductType,
  VitalsType,
} from "../entities/Meeple";
import { useEffect, useMemo, useReducer } from "react";
import { evaluateCondition } from "../utils/evaluateCondition";
import cx from "classnames";
import {
  IconPlayerPause,
  IconRoute,
  IconArrowsExchange,
} from "@tabler/icons-react";

type State = {
  showUi: boolean;
};

type ActionToggleShowUi = {
  type: "toggle-show-ui";
  payload: boolean;
};

type Action = ActionToggleShowUi;

const initialState: State = {
  showUi: true,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "toggle-show-ui":
      return { ...state, showUi: action.payload };
  }
};

export const MeeplesList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { id } = useParams<{ id: string }>();
  const { isLoading, game, zoomToEntity, centerCameraInGame } = useGame();
  const navigate = useNavigate();

  const meeples =
    game?.currentScene.actors.filter(
      (actor): actor is Meeple => actor instanceof Meeple
    ) || [];

  const { filteredMeeples, selectedFilter, setFilter } = useMeepleFilters(meeples);
  const selectedMeeple = useMemo(() => {
    return meeples.find((meeple) => String(meeple.id) === id);
  }, [id]);

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
  }, [id, selectedMeeple]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full  p-2">
      <nav className="p-2">
        <button
          onClick={() =>
            dispatch({ type: "toggle-show-ui", payload: !state.showUi })
          }
          className="btn btn-sm btn-outline flex items-center gap-1.5"
        >
          <IconComponent icon={UserActionType.HideUi} size={14} />
          <span>{state.showUi ? "Hide UI" : "Show UI"}</span>
        </button>
      </nav>
      <div 
      className={cx("flex justify-between items-center", {
        "hidden": !state.showUi,
      })}>
        <div className="p-2">
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
        </div>
      </div>
      <ul className={cx("overflow-y-auto flex-1 flex flex-col gap-3 p-2 w-sm", {
        "hidden": !state.showUi,
      })}>
        {filteredMeeples
          .filter((meeple) => (id ? String(meeple.id) === id : true))
          .map((meeple) => (
            <li
              key={meeple.id}
              className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md"
            >
              <Link
                className="cursor-pointer hover:text-primary underline"
                to={`/meeple/${meeple.id}`}
              >
                {meeple.name}
              </Link>
              <div className="flex items-center gap-1.5 text-sm text-base-content/70">
                <IconComponent icon={meeple.roleId} size={14} />
                <span>{meeple.roleId}</span>
              </div>
              <div className="flex items-center gap-2">
                {meeple.state.type === MeepleStateType.Idle && (
                  <div className="badge badge-lg gap-1.5 bg-info/20 text-info border-info/30">
                    <IconPlayerPause size={14} />
                    <span className="font-semibold capitalize">
                      {meeple.state.type}
                    </span>
                    {meeple.state.target && (
                      <span className="text-info/70 text-xs">
                        → {meeple.state.target.name}
                      </span>
                    )}
                  </div>
                )}
                {meeple.state.type === MeepleStateType.Traveling && (
                  <div className="badge badge-lg gap-1.5 bg-warning/20 text-warning border-warning/30">
                    <IconRoute size={14} />
                    <span className="font-semibold capitalize">
                      {meeple.state.type}
                    </span>
                    <span className="text-warning/70 text-xs">
                      → {meeple.state.target.name}
                    </span>
                  </div>
                )}
                {meeple.state.type === MeepleStateType.Transacting && (
                  <div className="badge badge-lg gap-1.5 bg-success/20 text-success border-success/30">
                    <IconArrowsExchange size={14} />
                    <span className="font-semibold capitalize">
                      {meeple.state.type}
                    </span>
                    <span className="text-success/70 text-xs">
                      {meeple.state.transactionType === "add" ? "+" : "-"}
                      {meeple.state.quantity} {meeple.state.good} with{" "}
                      {meeple.state.target.name}
                    </span>
                  </div>
                )}
              </div>
              {id && (
                <div className="flex flex-col gap-4">
                  <div className="card card-compact bg-base-200 shadow-sm">
                    <div className="card-body p-3">
                      <h4 className="card-title text-base text-primary">
                        Stats
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(meeple.stats).map(([key, value]) => {
                          const vitalsType = key as VitalsType;
                          return (
                            <div
                              key={vitalsType}
                              className="tooltip tooltip-top"
                              data-tip={vitalsType}
                            >
                              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-base-100">
                                <IconComponent
                                  icon={vitalsType}
                                  size={16}
                                  className="text-primary"
                                />
                                <span className="text-sm font-semibold text-primary">
                                  {value}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="card card-compact bg-base-200 shadow-sm">
                    <div className="card-body p-3">
                      <h4 className="card-title text-base text-secondary">
                        Inventory
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(meeple.inventory).map(
                          ([key, value]) => {
                            const goodType = key as
                              | MiningType
                              | ProductType
                              | CurrencyType;
                            return (
                              <div
                                key={goodType}
                                className="tooltip tooltip-top"
                                data-tip={goodType}
                              >
                                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-base-100">
                                  <IconComponent
                                    icon={goodType}
                                    size={16}
                                    className="text-secondary"
                                  />
                                  <span className="text-sm font-semibold text-secondary">
                                    {value}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {meeple.instructions.map((instruction) => (
                      <div
                        key={instruction.id}
                        className="card card-compact bg-base-200 shadow-sm"
                      >
                        <div className="card-body p-3">
                          <div className="flex flex-col gap-2 mt-2">
                            {instruction.conditions.map((condition, index) => {
                              const isMet = evaluateCondition(
                                condition,
                                condition.target?.inventory
                              );
                              return (
                                <div
                                  key={index}
                                  className={cx(
                                    "flex items-center gap-2 p-2 rounded-lg border",
                                    {
                                      "bg-success/10 border-success/30": isMet,
                                      "bg-error/10 border-error/30": !isMet,
                                    }
                                  )}
                                >
                                  <span className="text-sm text-base-content flex-1">
                                    <span className="text-base-content/70">
                                      if
                                    </span>{" "}
                                    <span className="font-medium">
                                      {condition.good}
                                    </span>{" "}
                                    <span className="text-base-content/70">
                                      {condition.operator}
                                    </span>{" "}
                                    <span className="font-semibold text-primary">
                                      {condition.value}
                                    </span>{" "}
                                    <span className="text-base-content/70">
                                      targeting
                                    </span>{" "}
                                    <span className="font-medium text-secondary">
                                      {condition.target.name}
                                    </span>{" "}
                                    <span className="text-base-content/70">
                                      then
                                    </span>{" "}
                                    <span className="text-base-content/70">
                                      {instruction.name}
                                    </span>
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
