import { useReducer } from "react";
import type { Meeple } from "../entities/Meeple/Meeple";
import { MeepleType } from "../entities/types";
import {
  IconBuilding,
  IconCurrencyDollar,
  IconMoodSmile,
  IconUsers,
  IconHeart,
  IconBolt,
  IconEdit,
  IconHome
} from "@tabler/icons-react";
import { IconShip } from "@tabler/icons-react";
import { IconPick } from "@tabler/icons-react";
import { IconMeteor } from "@tabler/icons-react";
import { IconSatellite } from "@tabler/icons-react";
import { IconBeer } from "@tabler/icons-react";
import { IconRocket } from "@tabler/icons-react";
import { IconRefresh } from "@tabler/icons-react";
import { IconPackage, IconBulb, IconPlus } from "@tabler/icons-react";
import { MeepleStateType, MeepleStats } from "../entities/types";
import type { LogicRule } from "../entities/types";
import { getGoodLabel } from "../utils/goodsMetadata";
import { GoodsDisplay } from "./GoodsDisplay";
import { RulesForm } from "./RulesForm";
import { RulesReadOnly } from "./RulesReadOnly";

type TabType = "goods" | "rules" | "create";

type TabStateAction =
  | { type: "set-tab"; payload: TabType };

type TabState = {
  activeTab: TabType;
};

const initialTabState: TabState = {
  activeTab: "goods",
};

function tabStateReducer(state: TabState, action: TabStateAction): TabState {
  switch (action.type) {
    case "set-tab":
      return { activeTab: action.payload };
    default:
      return state;
  }
}

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

function MeepleTabsSection({ 
  meeple, 
  activeEntity,
  onScrollToCard 
}: { 
  meeple: Meeple;
  activeEntity: Meeple | null;
  onScrollToCard?: () => void;
}) {
  const [tabState, dispatchTab] = useReducer(tabStateReducer, initialTabState);
  const [editState, dispatchEdit] = useReducer(editStateReducer, initialEditState);
  const isActive = activeEntity && activeEntity.id === meeple.id;

  const handleSave = (rules: LogicRule[]) => {
    meeple.rules = rules;
    dispatchEdit({ type: "save-edit" });
    // Scroll after a brief delay to ensure state update is complete
    setTimeout(() => {
      onScrollToCard?.();
    }, 100);
  };

  const handleCancel = () => {
    dispatchEdit({ type: "cancel-edit" });
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
            tabState.activeTab === "goods" 
              ? "tab-active bg-primary text-primary-content shadow-lg scale-105" 
              : "hover:bg-base-300/50"
          }`}
          onClick={() => dispatchTab({ type: "set-tab", payload: "goods" })}
        >
          <IconPackage size={18} />
          Goods
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
          <IconBulb size={18} />
          Behaviors
        </a>
        <a
          role="tab"
          className={`tab flex items-center gap-2 font-semibold transition-all duration-200 ${
            tabState.activeTab === "create" 
              ? "tab-active bg-info text-info-content shadow-lg scale-105" 
              : "hover:bg-base-300/50"
          }`}
          onClick={() => dispatchTab({ type: "set-tab", payload: "create" })}
        >
          <IconPlus size={18} />
          Create
        </a>
      </div>
      <div className="mt-3">
        {tabState.activeTab === "goods" && (
          <GoodsDisplay goods={meeple.goods} />
        )}
        {tabState.activeTab === "rules" && (
          <div className="space-y-2">
            {editState.isEditing ? (
              <RulesForm
                rules={meeple.rules}
                onUpdateRules={handleSave}
                onCancel={handleCancel}
                mode="edit"
              />
            ) : (
              <>
                <div className="flex items-center justify-end mb-2">
                  <button
                    className="btn btn-sm btn-primary btn-outline"
                    onClick={() => dispatchEdit({ type: "start-edit" })}
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
              </>
            )}
          </div>
        )}
        {tabState.activeTab === "create" && (
          <div className="space-y-2">
            <RulesForm
              rules={[]}
              onUpdateRules={() => {}}
              mode="create"
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
      {meeple.home && (
        <div className="flex items-center gap-1.5 mb-2 text-xs text-base-content/70">
          <IconHome size={14} className="text-accent" />
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
            [MeepleType.Player]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Player</div>
                </div>
                <span className="badge badge-sm badge-primary badge-outline flex items-center gap-1">
                  <IconRocket size={14} className="cursor-pointer" />
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
                  <IconShip size={14} className="cursor-pointer" />
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
                  <IconBuilding size={14} className="cursor-pointer" />
                  Pirate Den
                </span>
              </div>
            ),
            [MeepleType.Custom]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Custom</div>
                </div>
                <span className="badge badge-sm badge-ghost badge-outline flex items-center gap-1">
                  <IconShip size={14} className="cursor-pointer" />
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
            [MeepleStateType.Patrolling]: (
              <div className="tooltip">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">Patrolling</div>
                </div>
                <span className="badge badge-sm badge-error badge-outline flex items-center gap-1">
                  <IconShip size={14} className="cursor-pointer" />
                  Patrolling
                </span>
              </div>
            ),
          }[meeple.state.type]
        }
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
                        [MeepleType.Trader]: <IconShip size={14} className="cursor-pointer" />,
                        [MeepleType.Miner]: <IconPick size={14} className="cursor-pointer" />,
                        [MeepleType.Asteroid]: <IconMeteor size={14} className="cursor-pointer" />,
                        [MeepleType.SpaceStation]: <IconSatellite size={14} className="cursor-pointer" />,
                        [MeepleType.SpaceBar]: <IconBeer size={14} className="cursor-pointer" />,
                        [MeepleType.SpaceApartments]: <IconBuilding size={14} className="cursor-pointer" />,
                        [MeepleType.Bartender]: <IconBeer size={14} className="cursor-pointer" />,
                        [MeepleType.Player]: <IconRocket size={14} className="cursor-pointer" />,
                        [MeepleType.Pirate]: <IconShip size={14} className="cursor-pointer" />,
                        [MeepleType.PirateDen]: <IconBuilding size={14} className="cursor-pointer" />,
                        [MeepleType.Custom]: <IconShip size={14} className="cursor-pointer" />,
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
      <div className="divider my-1"></div>
      <MeepleTabsSection 
        meeple={meeple} 
        activeEntity={activeEntity}
        onScrollToCard={onScrollToCard}
      />
    </div>
  );
}
