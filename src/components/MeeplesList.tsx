import { useGame } from "../hooks/useGame";
import { IconComponent } from "../utils/iconMap";
import { RoleId, UserActionType } from "../entities/types";
import { useMeepleFilters } from "../hooks/useMeepleFilters";
import { Link, useParams } from "react-router-dom";
import {
  CurrencyType,
  Meeple,
  MiningType,
  ProductType,
  VitalsType,
} from "../entities/Meeple";
import { useEffect } from "react";
import { Instructions } from "./Instructions";
import { evaluateCondition } from "../utils/evaluateCondition";

export const MeeplesList = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading, game, zoomToEntity } = useGame();

  const meeples =
    game?.currentScene.actors.filter(
      (actor): actor is Meeple => actor instanceof Meeple
    ) || [];

  const { filteredMeeples, filters, toggleFilter } = useMeepleFilters(meeples);

  useEffect(() => {
    if (id) {
      const meeple = meeples.find((meeple) => String(meeple.id) === id);
      if (meeple) {
        zoomToEntity(meeple);
      }
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 flex-wrap">
        {id ? (
          <Link
            to="/"
            className="btn btn-sm btn-outline flex items-center gap-1.5"
          >
            <IconComponent icon={UserActionType.Back} size={14} />
            <span>Back</span>
          </Link>
        ) : (
          Object.values(RoleId).map((roleId) => {
            const isActive = filters.includes(roleId);
            return (
              <button
                key={roleId}
                onClick={() => toggleFilter(roleId)}
                className={`btn btn-sm ${
                  isActive ? "btn-primary" : "btn-outline"
                } flex items-center gap-1.5`}
              >
                <IconComponent icon={roleId} size={14} />
                <span>{roleId}</span>
              </button>
            );
          })
        )}
      </div>
      <ul className="overflow-y-auto flex-1 flex flex-col gap-2 p-2">
        {filteredMeeples
          .filter((meeple) => (id ? String(meeple.id) === id : true))
          .map((meeple) => (
            <li
              key={meeple.id}
              className="flex flex-col gap-2 p-2 border border-gray-300 rounded-md"
            >
              <Link
                className="cursor-pointer hover:text-primary underline"
                to={`/meeple/${meeple.id}`}
              >
                {meeple.name}
              </Link>
              <div>{meeple.state.type}</div>
              {id && (
                <div>
                  <ul className="flex flex-col gap-2">
                    {Object.entries(meeple.stats).map(([key, value]) => {
                      const vitalsType = key as VitalsType;
                      return (
                        <li
                          key={vitalsType}
                          className="flex items-center gap-2"
                        >
                          <IconComponent icon={vitalsType} size={16} />
                          <span className="text-sm">
                            {value} {vitalsType}
                          </span>
                        </li>
                      );
                    })}

                    {Object.entries(meeple.inventory).map(([key, value]) => {
                      const goodType = key as
                        | MiningType
                        | ProductType
                        | CurrencyType;
                      return (
                        <li key={goodType} className="flex items-center gap-2">
                          <IconComponent icon={goodType} size={16} />
                          <span className="text-sm">
                            {value} {goodType}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex flex-col gap-3 mt-2">
                    <h3 className="text-sm font-semibold text-base-content">
                      Instructions{" "}
                    </h3>
                    {meeple.instructions.map((instruction) => (
                      <div key={instruction.id}>
                        <div>{instruction.name}</div>
                        {instruction.conditions.map((condition, index) => (
                          <div key={index} className="flex flex-col gap-2">
                            <div>
                              {condition.good} {condition.operator}{" "}
                              {condition.value}{" "}
                              {condition.target?.name === meeple.name
                                ? "self"
                                : condition.target?.name}
                              {evaluateCondition(
                                condition,
                                condition.target?.inventory
                              )
                                ? "✅"
                                : "❌"}
                            </div>
                          </div>
                        ))}
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
