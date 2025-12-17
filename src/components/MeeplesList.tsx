import { useGame } from "../hooks/useGame";
import { GoodType, VitalsType } from "../entities/Meeple";
import { IconComponent } from "../utils/iconMap";

export const MeeplesList = () => {
  const { isLoading, meeples, zoomToEntity } = useGame();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="overflow-y-auto h-full flex flex-col gap-2">
      {meeples.map((meeple) => (
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
          <div>{meeple.ruleTemplate.id}</div>
          <div>State: {meeple.state.type}</div>
          <div className="flex gap-2">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <IconComponent icon={VitalsType.Health} />
                {meeple.inventory[VitalsType.Health]}
              </div>
              <div className="flex items-center gap-2">
                <IconComponent icon={VitalsType.Energy} />
                {meeple.inventory[VitalsType.Energy]}
              </div>
              <div className="flex items-center gap-2">
                <IconComponent icon={VitalsType.Happiness} />
                {meeple.inventory[VitalsType.Happiness]}
              </div>
            </div>
            Pos: {Math.round(meeple.pos.x)}°, {Math.round(meeple.pos.y)}°
          </div>
          <ul>
            {Object.entries(meeple.inventory)
              .filter(([key]) =>
                Object.values(GoodType).includes(key as GoodType)
              )
              .map(([key, value], i) => {
                return (
                  <li key={i} className="flex items-center gap-2">
                    <IconComponent icon={key as GoodType} />
                    {value} {key}
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ul>
  );
};
