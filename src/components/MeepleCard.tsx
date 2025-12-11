import type { Meeple } from "../entities/Meeple";
import { MeepleType } from "../entities/types";
import {
  IconBuilding,
  IconCurrencyDollar,
  IconMoodSmile,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { IconShip } from "@tabler/icons-react";
import { IconPick } from "@tabler/icons-react";
import { IconMeteor } from "@tabler/icons-react";
import { IconSatellite } from "@tabler/icons-react";
import { IconBeer } from "@tabler/icons-react";
import { MeepleStateType } from "../entities/types";
import { GoodsDisplay } from "./GoodsDisplay";
import { RulesForm } from "./RulesForm";
import { Player } from "../entities/Player";
import { RulesReadOnly } from "./RulesReadOnly";

export function MeepleCard({
  meeple,
  onMeepleNameClick,
  activeEntity,
}: {
  meeple: Meeple;
  onMeepleNameClick: () => void;
  activeEntity: Meeple | null;
}) {
  return (
    <div className="card-body p-0 gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3
          className="font-semibold text-base text-base-content truncate flex-1 cursor-pointer hover:text-primary underline"
          title={`Click to zoom to ${meeple.name}`}
          role="button"
          onClick={onMeepleNameClick}
        >
          {meeple.name}
        </h3>
        <span className="text-sm text-base-content/50">
          pos {Math.round(meeple.pos.x)}° {Math.round(meeple.pos.y)}°
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
            [MeepleType.SpaceApartments]: (
              <span className="badge badge-sm badge-info badge-outline flex items-center gap-1">
                <IconBuilding size={14} />
                Space Apartments
              </span>
            ),
          }[meeple.type]
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
                {meeple.state.type === MeepleStateType.Traveling &&
                  meeple.state.target.type}
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
            [MeepleStateType.Transacting]: (
              <span className="badge badge-sm badge-warning badge-outline flex items-center gap-1">
                <IconCurrencyDollar size={14} />
                Transacting
              </span>
            ),
            [MeepleStateType.Chilling]: (
              <span className="badge badge-sm badge-ghost badge-outline flex items-center gap-1">
                <IconMoodSmile size={14} />
                Chilling
              </span>
            ),
          }[meeple.state.type]
        }
      </div>
      <div className="divider my-1"></div>
      <GoodsDisplay goods={meeple.goods} />
      {/* <-- Visitors */}
      {(meeple.type === MeepleType.Asteroid ||
        meeple.type === MeepleType.SpaceStation ||
        meeple.type === MeepleType.SpaceBar ||
        meeple.type === MeepleType.SpaceApartments) && (
        <>
          <div className="divider my-1"></div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-base-content flex items-center gap-1">
                <IconUsers size={16} />
                Visitors
              </span>
              <span className="badge badge-sm badge-ghost">
                {meeple.visitors.size}
              </span>
            </div>
            {meeple.visitors.size > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {Array.from(meeple.visitors).map((visitor) => (
                  <div
                    key={visitor.name}
                    className="badge badge-sm badge-primary badge-outline hover:badge-primary transition-colors cursor-pointer"
                    onClick={onMeepleNameClick}
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
                        [MeepleType.SpaceApartments]: <IconBuilding size={14} />,
                      }[visitor.type]
                    }{" "}
                    {visitor.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-base-content/50 italic">No visitors</div>
            )}
          </div>
        </>
      )}
      {activeEntity && activeEntity.id === meeple.id && (
        <>
          <div className="divider my-1"></div>
          {
            meeple instanceof Player ? (
              <RulesForm
                rules={meeple.rules}
                onUpdateRules={(rules) => {
                  meeple.rules = rules;
                }}
              />
            ) : ( 
              <RulesReadOnly
                rules={meeple.rules}
              />
            )
          }
        </>
      )}
    </div>
  );
}
