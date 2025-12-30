import { useEffect, useMemo, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { MeepleExtraDetail } from "./MeepleExtraDetail";
import { DEFAULT_ZOOM_VALUE, ZoomSlider } from "./ZoomSlider";

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
  const { isLoading, game, zoomToEntity, centerCameraInGame, setZoom } =
    useGame();
  const navigate = useNavigate();

  const meeples =
    game?.currentScene.actors.filter(
      (actor): actor is Meeple => actor instanceof Meeple
    ) || [];

  const { filteredMeeples, selectedFilter, setFilter } =
    useMeepleFilters(meeples);

  const selectedMeeple = useMemo(() => {
    return meeples.find((meeple) => String(meeple.id) === id);
  }, [id, meeples]);

  const displayMeeples = useMemo(() => {
    return filteredMeeples.filter((meeple) =>
      id ? String(meeple.id) === id : true
    );
  }, [filteredMeeples, id]);

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
      <div
        className={cx("flex-1 p-2 w-sm overflow-y-auto", {
          hidden: !state.showUi,
        })}
      >
        {displayMeeples.map((meeple) => (
          <MeepleDetails
            key={meeple.id}
            id={meeple.id}
            name={meeple.name}
            roleId={meeple.roleId}
            state={meeple.state}
            stats={{ ...meeple.state.stats }}
            inventory={{ ...meeple.state.inventory }}
            isSelected={id === String(meeple.id)}
          />
        ))}
        {selectedMeeple ? (
          <>
            <MeepleExtraDetail
              stats={{ ...selectedMeeple.state.stats }}
              inventory={{ ...selectedMeeple.state.inventory }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
