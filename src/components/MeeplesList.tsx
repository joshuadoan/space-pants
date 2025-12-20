import { useGame } from "../hooks/useGame";
import { MiningType, ProductType, CurrencyType, VitalsType } from "../entities/Meeple";
import { IconComponent } from "../utils/iconMap";
import { RoleId } from "../entities/types";
import { useMeepleFilters } from "../hooks/useMeepleFilters";

export const MeeplesList = () => {
  const { isLoading, meeples, zoomToEntity } = useGame();
  const { filteredMeeples, filters, toggleFilter } = useMeepleFilters(meeples);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-2 flex-wrap">
        {Object.values(RoleId).map((roleId) => {
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
        })}
      </div>
      <ul className="overflow-y-auto flex-1 flex flex-col gap-2 p-2">
        {filteredMeeples.map((meeple) => (
        <li
          key={meeple.id}
          className="flex flex-col gap-2 p-2 border border-gray-300 rounded-md"
        >
          <div
            className="cursor-pointer hover:text-primary"
            onClick={() => zoomToEntity(meeple)}
          >
            {meeple.name}
          </div>
          <div>{meeple.state.type}</div>
          <div>State: {meeple.state.type}</div>
          <div className="flex gap-2">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <IconComponent icon={VitalsType.Health} />
                {meeple.stats[VitalsType.Health]}
              </div>
              <div className="flex items-center gap-2">
                <IconComponent icon={VitalsType.Energy} />
                {meeple.stats[VitalsType.Energy]}
              </div>
              <div className="flex items-center gap-2">
                <IconComponent icon={VitalsType.Happiness} />
                {meeple.stats[VitalsType.Happiness]}
              </div>
            </div>
            Pos: {Math.round(meeple.pos.x)}°, {Math.round(meeple.pos.y)}°
          </div>
          <ul>
            {Object.entries(meeple.inventory)
              .filter(([key]) =>
                [...Object.values(MiningType), ...Object.values(ProductType), ...Object.values(CurrencyType)].includes(key as MiningType | ProductType | CurrencyType)
              )
              .map(([key, value], i) => {
                return (
                  <li key={i} className="flex items-center gap-2">
                    <IconComponent icon={key as MiningType | ProductType | CurrencyType} />
                    {value} {key}
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
      </ul>
    </div>
  );
};
