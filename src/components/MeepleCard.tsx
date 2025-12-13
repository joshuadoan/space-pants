import { useReducer } from "react";
import type { Meeple } from "../entities/Meeple";
import { MeepleType } from "../entities/types";
import {
  IconBuilding,
  IconCurrencyDollar,
  IconMoodSmile,
  IconUser,
  IconUsers,
  IconStar,
  IconArrowUp,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconHeart,
  IconBolt,
  IconEdit
} from "@tabler/icons-react";
import { IconShip } from "@tabler/icons-react";
import { IconPick } from "@tabler/icons-react";
import { IconMeteor } from "@tabler/icons-react";
import { IconSatellite } from "@tabler/icons-react";
import { IconBeer } from "@tabler/icons-react";
import { IconRefresh } from "@tabler/icons-react";
import { MeepleStateType, MeepleStats } from "../entities/types";
import type { LogicRule } from "../entities/types";
import { getGoodLabel } from "../utils/goodsMetadata";
import { GoodsDisplay } from "./GoodsDisplay";
import { RulesForm } from "./RulesForm";
import { RulesReadOnly } from "./RulesReadOnly";

type EditStateAction =
  | { type: "start-edit" }
  | { type: "cancel-edit" }
  | { type: "save-edit" };

type EditState = {
  isEditing: boolean;
};

const initialEditState: EditState = {
  isEditing: false,
};

function editStateReducer(state: EditState, action: EditStateAction): EditState {
  switch (action.type) {
    case "start-edit":
      return { isEditing: true };
    case "cancel-edit":
    case "save-edit":
      return { isEditing: false };
    default:
      return state;
  }
}

function MeepleRulesSection({ 
  meeple, 
  onScrollToCard 
}: { 
  meeple: Meeple;
  onScrollToCard?: () => void;
}) {
  const [editState, dispatch] = useReducer(editStateReducer, initialEditState);

  const handleSave = (rules: LogicRule[]) => {
    meeple.rules = rules;
    dispatch({ type: "save-edit" });
    // Scroll after a brief delay to ensure state update is complete
    setTimeout(() => {
      onScrollToCard?.();
    }, 100);
  };

  const handleCancel = () => {
    dispatch({ type: "cancel-edit" });
    // Scroll after a brief delay to ensure state update is complete
    setTimeout(() => {
      onScrollToCard?.();
    }, 100);
  };

  if (editState.isEditing) {
    return (
      <>
        <div className="divider my-1"></div>
        <RulesForm
          rules={meeple.rules}
          onUpdateRules={handleSave}
          onCancel={handleCancel}
          defaultExpanded={true}
        />
      </>
    );
  }

  return (
    <>
      <div className="divider my-1"></div>
      <div className="space-y-2">
        <div className="flex items-center justify-end">
          <button
            className="btn btn-sm btn-primary btn-outline"
            onClick={() => dispatch({ type: "start-edit" })}
            title="Edit rules"
          >
            <IconEdit size={14} />
            Edit Rules
          </button>
        </div>
        <RulesReadOnly
          rules={meeple.rules}
          activeRuleId={meeple.activeRuleId}
        />
      </div>
    </>
  );
}

export function MeepleCard({
  meeple,
  onMeepleNameClick,
  activeEntity,
  onScrollToCard,
}: {
  meeple: Meeple;
  onMeepleNameClick: () => void;
  activeEntity: Meeple | null;
  onScrollToCard?: () => void;
}) {
  return (
    <div className="card-body p-0 gap-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3
            className="font-semibold text-base text-base-content truncate cursor-pointer hover:text-primary underline"
            title={`Click to zoom to ${meeple.name}`}
            role="button"
            onClick={onMeepleNameClick}
          >
            {meeple.name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-0.5 text-xs" title="Health">
              <IconHeart 
                size={14} 
                className="text-error cursor-pointer" 
                fill={(meeple.goods[MeepleStats.Health] ?? 0) > 50 ? "currentColor" : "none"}
              />
              <span className="text-base-content/70 font-medium">
                {Math.round(meeple.goods[MeepleStats.Health] ?? 0)}
              </span>
            </span>
            <span className="flex items-center gap-0.5 text-xs" title="Energy">
              <IconBolt 
                size={14} 
                className="text-warning cursor-pointer" 
                fill={(meeple.goods[MeepleStats.Energy] ?? 0) > 50 ? "currentColor" : "none"}
              />
              <span className="text-base-content/70 font-medium">
                {Math.round(meeple.goods[MeepleStats.Energy] ?? 0)}
              </span>
            </span>
          </div>
        </div>
        <span className="text-sm text-base-content/50 shrink-0">
          pos {Math.round(meeple.pos.x)}° {Math.round(meeple.pos.y)}°
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {
          {
            [MeepleType.Player]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Player</div>
                </div>
                <span className="badge badge-sm badge-success badge-outline flex items-center gap-1">
                  <IconUser size={14} className="cursor-pointer" />
                  Player
                </span>
              </div>
            ),
            [MeepleType.Trader]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Trader</div>
                </div>
                <span className="badge badge-sm badge-primary badge-outline flex items-center gap-1">
                  <IconShip size={14} className="cursor-pointer" />
                  Trader
                </span>
              </div>
            ),
            [MeepleType.Miner]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Miner</div>
                </div>
                <span className="badge badge-sm badge-secondary badge-outline flex items-center gap-1">
                  <IconPick size={14} className="cursor-pointer" />
                  Miner
                </span>
              </div>
            ),
            [MeepleType.Asteroid]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Asteroid</div>
                </div>
                <span className="badge badge-sm badge-accent badge-outline flex items-center gap-1">
                  <IconMeteor size={14} className="cursor-pointer" />
                  Asteroid
                </span>
              </div>
            ),
            [MeepleType.SpaceStation]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Space Station</div>
                </div>
                <span className="badge badge-sm badge-info badge-outline flex items-center gap-1">
                  <IconSatellite size={14} className="cursor-pointer" />
                  Space Station
                </span>
              </div>
            ),
            [MeepleType.SpaceBar]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Space Bar</div>
                </div>
                <span className="badge badge-sm badge-warning badge-outline flex items-center gap-1">
                  <IconBeer size={14} className="cursor-pointer" />
                  Space Bar
                </span>
              </div>
            ),
            [MeepleType.SpaceApartments]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Space Apartments</div>
                </div>
                <span className="badge badge-sm badge-info badge-outline flex items-center gap-1">
                  <IconBuilding size={14} className="cursor-pointer" />
                  Space Apartments
                </span>
              </div>
            ),
            [MeepleType.TreasureCollector]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Treasure Collector</div>
                </div>
                <span className="badge badge-sm badge-warning flex items-center gap-1">
                  <IconStar size={14} className="cursor-pointer" />
                  Treasure Collector
                </span>
              </div>
            ),
            [MeepleType.Bartender]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Bartender</div>
                </div>
                <span className="badge badge-sm badge-accent badge-outline flex items-center gap-1">
                  <IconBeer size={14} className="cursor-pointer" />
                  Bartender
                </span>
              </div>
            ),
          }[meeple.type]
        }
        {
          {
            [MeepleStateType.Idle]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Idle</div>
                </div>
                <span className="badge badge-sm badge-ghost badge-outline flex items-center gap-1">
                  <IconMoodSmile size={14} className="cursor-pointer" />
                  Idle
                </span>
              </div>
            ),
            [MeepleStateType.Mining]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Mining</div>
                </div>
                <span className="badge badge-sm badge-secondary badge-outline flex items-center gap-1">
                  <IconPick size={14} className="cursor-pointer" />
                  Mining
                </span>
              </div>
            ),
            [MeepleStateType.Traveling]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">
                    Traveling to {meeple.state.type === MeepleStateType.Traveling &&
                      meeple.state.target.type}
                  </div>
                </div>
                <span className="badge badge-sm badge-primary badge-outline flex items-center gap-1">
                  <IconShip size={14} className="cursor-pointer" />
                  Traveling to{" "}
                  {meeple.state.type === MeepleStateType.Traveling &&
                    meeple.state.target.type}
                </span>
              </div>
            ),
            [MeepleStateType.Trading]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Trading</div>
                </div>
                <span className="badge badge-sm badge-warning badge-outline flex items-center gap-1">
                  <IconCurrencyDollar size={14} className="cursor-pointer" />
                  Trading
                </span>
              </div>
            ),
            [MeepleStateType.Socializing]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Socializing</div>
                </div>
                <span className="badge badge-sm badge-info badge-outline flex items-center gap-1">
                  <IconUsers size={14} className="cursor-pointer" />
                  Socializing
                </span>
              </div>
            ),
            [MeepleStateType.Working]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Working</div>
                </div>
                <span className="badge badge-sm badge-success badge-outline flex items-center gap-1">
                  <IconBeer size={14} className="cursor-pointer" />
                  Working
                </span>
              </div>
            ),
            [MeepleStateType.Transacting]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Transacting</div>
                </div>
                <span className="badge badge-sm badge-warning badge-outline flex items-center gap-1">
                  <IconCurrencyDollar size={14} className="cursor-pointer" />
                  Transacting
                </span>
              </div>
            ),
            [MeepleStateType.Chilling]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Chilling</div>
                </div>
                <span className="badge badge-sm badge-ghost badge-outline flex items-center gap-1">
                  <IconMoodSmile size={14} className="cursor-pointer" />
                  Chilling
                </span>
              </div>
            ),
            [MeepleStateType.Converting]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">
                    Converting ore to {meeple.state.type === MeepleStateType.Converting &&
                      getGoodLabel(meeple.state.productType)}
                  </div>
                </div>
                <span className="badge badge-sm badge-accent badge-outline flex items-center gap-1">
                  <IconRefresh size={14} className="cursor-pointer" />
                  Converting to{" "}
                  {meeple.state.type === MeepleStateType.Converting &&
                    getGoodLabel(meeple.state.productType)}
                </span>
              </div>
            ),
          }[meeple.state.type]
        }
      </div>
      {meeple.type === MeepleType.Player && (
        <>
          <div className="divider my-1"></div>
          <div className="bg-base-200/50 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-base-content/70 flex items-center gap-1">
              <IconMoodSmile size={14} className="cursor-pointer" />
              How to Move
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-base-content/80">
                <IconArrowUp size={16} className="text-primary cursor-pointer" />
                <span>Up</span>
              </div>
              <div className="flex items-center gap-1.5 text-base-content/80">
                <IconArrowDown size={16} className="text-primary cursor-pointer" />
                <span>Down</span>
              </div>
              <div className="flex items-center gap-1.5 text-base-content/80">
                <IconArrowLeft size={16} className="text-primary cursor-pointer" />
                <span>Left</span>
              </div>
              <div className="flex items-center gap-1.5 text-base-content/80">
                <IconArrowRight size={16} className="text-primary cursor-pointer" />
                <span>Right</span>
              </div>
            </div>
          </div>
        </>
      )}
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
                <IconUsers size={16} className="cursor-pointer" />
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
                        [MeepleType.Player]: <IconUser size={14} className="cursor-pointer" />,
                        [MeepleType.Trader]: <IconShip size={14} className="cursor-pointer" />,
                        [MeepleType.Miner]: <IconPick size={14} className="cursor-pointer" />,
                        [MeepleType.Asteroid]: <IconMeteor size={14} className="cursor-pointer" />,
                        [MeepleType.SpaceStation]: <IconSatellite size={14} className="cursor-pointer" />,
                        [MeepleType.SpaceBar]: <IconBeer size={14} className="cursor-pointer" />,
                        [MeepleType.SpaceApartments]: <IconBuilding size={14} className="cursor-pointer" />,
                        [MeepleType.TreasureCollector]: <IconStar size={14} className="cursor-pointer" />,
                        [MeepleType.Bartender]: <IconBeer size={14} className="cursor-pointer" />,
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
        <MeepleRulesSection meeple={meeple} onScrollToCard={onScrollToCard} />
      )}
    </div>
  );
}
