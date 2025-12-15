import { useEffect, useReducer } from "react";

import type { Meeple } from "../entities/Meeple/Meeple";
import { MeepleStateType, MeepleStats, MeepleType, type LogicRule } from "../entities/types";
import { getGoodLabel } from "../utils/goodsMetadata";
import { 
  MEEPLE_TYPE_ICONS, 
  STATE_ICONS, 
  GOODS_ICONS, 
  ACTION_ICONS, 
  OTHER_ICONS,
  IconComponent
} from "../utils/iconMap";
import { GoodsDisplay } from "./GoodsDisplay";
import { RulesForm } from "./RulesForm";
import { RulesReadOnly } from "./RulesReadOnly";
import { DiaryDisplay } from "./DiaryDisplay";

type TabType = "details" | "rules" | "create" | "edit";

type TabStateAction =
  | { type: "set-tab"; payload: TabType };

type TabState = {
  activeTab: TabType;
};

const initialTabState: TabState = {
  activeTab: "details",
};

function tabStateReducer(state: TabState, action: TabStateAction): TabState {
  switch (action.type) {
    case "set-tab":
      return { activeTab: action.payload };
    default:
      return state;
  }
}

function MeepleTabsSection({ 
  meeple, 
  onScrollToCard 
}: { 
  meeple: Meeple;
  onScrollToCard?: () => void;
}) {
  const [tabState, dispatchTab] = useReducer(tabStateReducer, initialTabState);
  const isCustomType = meeple.type === MeepleType.Custom;

  // Redirect to rules tab if trying to access create/edit tabs for non-custom types
  useEffect(() => {
    if (!isCustomType && (tabState.activeTab === "create" || tabState.activeTab === "edit")) {
      dispatchTab({ type: "set-tab", payload: "rules" });
    }
  }, [isCustomType, tabState.activeTab]);

  const handleSave = (rules: LogicRule[]) => {
    if (!isCustomType) {
      return; // Safety check: don't allow saving for non-custom types
    }
    meeple.rules = rules;
    // Switch back to behaviors tab after saving
    dispatchTab({ type: "set-tab", payload: "rules" });
    // Scroll after a brief delay to ensure state update is complete
    setTimeout(() => {
      onScrollToCard?.();
    }, 100);
  };

  const handleCancel = () => {
    // Switch back to behaviors tab after canceling
    dispatchTab({ type: "set-tab", payload: "rules" });
    // Scroll after a brief delay to ensure state update is complete
    setTimeout(() => {
      onScrollToCard?.();
    }, 100);
  };

  return (
    <div className="w-full">
      <div role="tablist" className="tabs tabs-boxed bg-base-200/50 p-1 shadow-md rounded-lg">
        <a
          role="tab"
          className={`tab flex items-center gap-2 font-semibold transition-all duration-200 ${
            tabState.activeTab === "details" 
              ? "tab-active bg-primary text-primary-content shadow-lg scale-105" 
              : "hover:bg-base-300/50"
          }`}
          onClick={() => dispatchTab({ type: "set-tab", payload: "details" })}
        >
          <ACTION_ICONS.info size={18} />
          Details
        </a>
        <a
          role="tab"
          className={`tab flex items-center gap-2 font-semibold transition-all duration-200 ${
            tabState.activeTab === "rules" 
              ? "tab-active bg-secondary text-secondary-content shadow-lg scale-105" 
              : "hover:bg-base-300/50"
          }`}
          onClick={() => dispatchTab({ type: "set-tab", payload: "rules" })}
        >
          <ACTION_ICONS.bulb size={18} />
          Behaviors
        </a>
        {isCustomType && (
          <a
            role="tab"
            className={`tab flex items-center gap-2 font-semibold transition-all duration-200 ${
              tabState.activeTab === "create" 
                ? "tab-active bg-info text-info-content shadow-lg scale-105" 
                : "hover:bg-base-300/50"
            }`}
            onClick={() => dispatchTab({ type: "set-tab", payload: "create" })}
          >
            <ACTION_ICONS.add size={18} />
            Create
          </a>
        )}
        {isCustomType && (
          <a
            role="tab"
            className={`tab flex items-center gap-2 font-semibold transition-all duration-200 ${
              tabState.activeTab === "edit" 
                ? "tab-active bg-warning text-warning-content shadow-lg scale-105" 
                : "hover:bg-base-300/50"
            }`}
            onClick={() => dispatchTab({ type: "set-tab", payload: "edit" })}
          >
            <ACTION_ICONS.edit size={18} />
            Edit
          </a>
        )}
      </div>
      <div className="mt-3 px-1">
        {tabState.activeTab === "details" && (
          <div className="w-full">
            <DiaryDisplay diary={meeple.diary} />
          </div>
        )}
        {tabState.activeTab === "rules" && (
          <div className="w-full">
            <RulesReadOnly
              rules={meeple.rules}
              activeRuleId={meeple.activeRuleId}
            />
          </div>
        )}
        {isCustomType && tabState.activeTab === "create" && (
          <div className="w-full">
            <RulesForm
              rules={[]}
              onUpdateRules={() => {}}
              mode="create"
              meepleType={meeple.type}
            />
          </div>
        )}
        {isCustomType && tabState.activeTab === "edit" && (
          <div className="w-full">
            <RulesForm
              rules={meeple.rules}
              onUpdateRules={handleSave}
              onCancel={handleCancel}
              mode="edit"
              meepleType={meeple.type}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function MeepleCard({
  meeple,
  onMeepleNameClick,
  onScrollToCard,
  isSelected = false,
}: {
  meeple: Meeple;
  onMeepleNameClick: () => void;
  onScrollToCard?: () => void;
  isSelected?: boolean;
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
              <IconComponent 
                icon={GOODS_ICONS[MeepleStats.Health]}
                size={14} 
                className="text-error cursor-pointer" 
                fill={(meeple.goods[MeepleStats.Health] ?? 0) > 50 ? "currentColor" : "none"}
              />
              <span className="text-base-content/70 font-medium">
                {Math.round(meeple.goods[MeepleStats.Health] ?? 0)}
              </span>
            </span>
            <span className="flex items-center gap-0.5 text-xs" title="Energy">
              <IconComponent 
                icon={GOODS_ICONS[MeepleStats.Energy]}
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
      {meeple.home && (
        <div className="flex items-center gap-1.5 mb-2 text-xs text-base-content/70">
          <OTHER_ICONS.home size={14} className="text-accent" />
          <span className="font-medium">Home:</span>
          <span className="text-accent font-semibold">{meeple.home.name}</span>
        </div>
      )}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {
          {
            [MeepleType.Trader]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Trader</div>
                </div>
                <span className="badge badge-sm badge-primary badge-outline flex items-center gap-1">
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Trader]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Miner]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Asteroid]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.SpaceStation]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.SpaceBar]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.SpaceApartments]} size={14} className="cursor-pointer" />
                  Space Apartments
                </span>
              </div>
            ),
            [MeepleType.Bartender]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Bartender</div>
                </div>
                <span className="badge badge-sm badge-accent badge-outline flex items-center gap-1">
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Bartender]} size={14} className="cursor-pointer" />
                  Bartender
                </span>
              </div>
            ),
            [MeepleType.Player]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Player</div>
                </div>
                <span className="badge badge-sm badge-primary badge-outline flex items-center gap-1">
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Player]} size={14} className="cursor-pointer" />
                  Player
                </span>
              </div>
            ),
            [MeepleType.Pirate]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Pirate</div>
                </div>
                <span className="badge badge-sm badge-error badge-outline flex items-center gap-1">
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Pirate]} size={14} className="cursor-pointer" />
                  Pirate
                </span>
              </div>
            ),
            [MeepleType.PirateDen]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Pirate Den</div>
                </div>
                <span className="badge badge-sm badge-error badge-outline flex items-center gap-1">
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.PirateDen]} size={14} className="cursor-pointer" />
                  Pirate Den
                </span>
              </div>
            ),
            [MeepleType.Mechanic]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Mechanic</div>
                </div>
                <span className="badge badge-sm badge-info badge-outline flex items-center gap-1">
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Mechanic]} size={14} className="cursor-pointer" />
                  Mechanic
                </span>
              </div>
            ),
            [MeepleType.Custom]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Custom</div>
                </div>
                <span className="badge badge-sm badge-ghost badge-outline flex items-center gap-1">
                  <IconComponent icon={MEEPLE_TYPE_ICONS[MeepleType.Custom]} size={14} className="cursor-pointer" />
                  Custom
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Idle]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Mining]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Traveling]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Trading]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Socializing]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Working]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Transacting]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Chilling]} size={14} className="cursor-pointer" />
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
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Converting]} size={14} className="cursor-pointer" />
                  Converting to{" "}
                  {meeple.state.type === MeepleStateType.Converting &&
                    getGoodLabel(meeple.state.productType)}
                </span>
              </div>
            ),
            [MeepleStateType.Patrolling]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Patrolling</div>
                </div>
                <span className="badge badge-sm badge-error badge-outline flex items-center gap-1">
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Patrolling]} size={14} className="cursor-pointer" />
                  Patrolling
                </span>
              </div>
            ),
            [MeepleStateType.Chasing]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">
                    Chasing {meeple.state.type === MeepleStateType.Chasing &&
                      meeple.state.target.name}
                  </div>
                </div>
                <span className="badge badge-sm badge-error badge-outline flex items-center gap-1">
                  <OTHER_ICONS.target size={14} className="cursor-pointer" />
                  Chasing{" "}
                  {meeple.state.type === MeepleStateType.Chasing &&
                    meeple.state.target.name}
                </span>
              </div>
            ),
            [MeepleStateType.Broken]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Broken</div>
                </div>
                <span className="badge badge-sm badge-error badge-outline flex items-center gap-1">
                  <IconComponent icon={STATE_ICONS[MeepleStateType.Broken]} size={14} className="cursor-pointer" />
                  Broken
                </span>
              </div>
            ),
          }[meeple.state.type]
        }
      </div>
      <div className="mb-2">
        <GoodsDisplay goods={meeple.goods} />
      </div>
      {/* <-- Visitors */}
      {(meeple.type === MeepleType.Asteroid ||
        meeple.type === MeepleType.SpaceStation ||
        meeple.type === MeepleType.SpaceBar ||
        meeple.type === MeepleType.SpaceApartments ||
        meeple.type === MeepleType.PirateDen) && (
        <>
          <div className="divider my-1"></div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-base-content flex items-center gap-1">
                <IconComponent icon={STATE_ICONS[MeepleStateType.Socializing]} size={16} className="cursor-pointer" />
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
                    <IconComponent icon={MEEPLE_TYPE_ICONS[visitor.type]} size={14} className="cursor-pointer" />{" "}
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
      {isSelected && (
        <>
          <div className="divider my-1"></div>
          <MeepleTabsSection 
            meeple={meeple} 
            onScrollToCard={onScrollToCard}
          />
        </>
      )}
    </div>
  );
}
