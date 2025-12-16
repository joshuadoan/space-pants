import { MAIN_TAB_ICONS, SUBTAB_ICONS, type MainTabType, type TabType } from "../utils/iconMap";

// Tab types are exported from iconMap

type MeepleCounts = {
  traders: number;
  miners: number;
  asteroids: number;
  stations: number;
  spacebars: number;
  spaceapartments: number;
  bartenders: number;
  pirates: number;
  piratedens: number;
  mechanics: number;
};

type TabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  meepleCounts: MeepleCounts;
  customMeeplesCount?: number;
};

// Map TabType to main tab and sub tab
function getMainTabFromTabType(tab: TabType): MainTabType {
  if (tab === "help") {
    return "help";
  }
  if (tab === "economy") {
    return "economy";
  }
  if (tab === "player" || tab === "my-meeples" || tab === "create") {
    return "player";
  }
  if (tab === "traders" || tab === "miners" || tab === "bartenders" || tab === "pirates" || tab === "mechanics") {
    return "ships";
  }
  return "destinations";
}

function getSubTabFromTabType(tab: TabType, customMeeplesCount: number = 0): TabType | null {
  if (tab === "player") {
    // If no custom meeples, default to create tab, otherwise my-meeples
    return customMeeplesCount === 0 ? "create" : "my-meeples";
  }
  if (tab === "my-meeples" || tab === "create") {
    return tab;
  }
  return tab;
}

// Map badge color to text color class
function getIconColorClass(badgeColor: string): string {
  const colorMap: Record<string, string> = {
    "badge-success": "text-success",
    "badge-primary": "text-primary",
    "badge-secondary": "text-secondary",
    "badge-accent": "text-accent",
    "badge-info": "text-info",
    "badge-warning": "text-warning",
    "badge-error": "text-error",
  };
  return colorMap[badgeColor] || "";
}

const MAIN_TABS: { value: MainTabType; label: string; icon?: React.ComponentType<{ size?: number; className?: string }>; badgeColor?: string }[] = [
  { value: "player", label: "Player", icon: MAIN_TAB_ICONS.player, badgeColor: "badge-success" },
  { value: "ships", label: "Ships", icon: MAIN_TAB_ICONS.ships, badgeColor: "badge-primary" },
  { value: "destinations", label: "Destinations", icon: MAIN_TAB_ICONS.destinations, badgeColor: "badge-info" },
  { value: "economy", label: "Economy", icon: MAIN_TAB_ICONS.economy, badgeColor: "badge-warning" },
  { value: "help", label: "Help", icon: MAIN_TAB_ICONS.help, badgeColor: "badge-accent" },
];

const SHIP_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "traders", label: "Traders", icon: SUBTAB_ICONS.traders, badgeColor: "badge-primary" },
  { value: "miners", label: "Miners", icon: SUBTAB_ICONS.miners, badgeColor: "badge-secondary" },
  { value: "bartenders", label: "Bartenders", icon: SUBTAB_ICONS.bartenders, badgeColor: "badge-secondary" },
  { value: "pirates", label: "Pirates", icon: SUBTAB_ICONS.pirates, badgeColor: "badge-error" },
  { value: "mechanics", label: "Mechanics", icon: SUBTAB_ICONS.mechanics, badgeColor: "badge-info" },
];

const DESTINATION_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "stations", label: "Stations", icon: SUBTAB_ICONS.stations, badgeColor: "badge-info" },
  { value: "asteroids", label: "Asteroids", icon: SUBTAB_ICONS.asteroids, badgeColor: "badge-accent" },
  { value: "spacebars", label: "Space Bars", icon: SUBTAB_ICONS.spacebars, badgeColor: "badge-warning" },
  { value: "spaceapartments", label: "Space Apartments", icon: SUBTAB_ICONS.spaceapartments, badgeColor: "badge-info" },
  { value: "piratedens", label: "Pirate Dens", icon: SUBTAB_ICONS.piratedens, badgeColor: "badge-error" },
];

const PLAYER_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "my-meeples", label: "My Meeples", icon: SUBTAB_ICONS["my-meeples"], badgeColor: "badge-success" },
  { value: "create", label: "Create", icon: SUBTAB_ICONS.create, badgeColor: "badge-success" },
];

export function Tabs({ activeTab, onTabChange, meepleCounts, customMeeplesCount = 0 }: TabsProps) {
  const currentMainTab = getMainTabFromTabType(activeTab);
  const currentSubTab = getSubTabFromTabType(activeTab, customMeeplesCount);

  // Calculate aggregate counts for main tabs
  const shipsCount = meepleCounts.traders + meepleCounts.miners + meepleCounts.bartenders + meepleCounts.pirates + meepleCounts.mechanics;
  const destinationsCount = meepleCounts.stations + meepleCounts.asteroids + meepleCounts.spacebars + meepleCounts.spaceapartments + meepleCounts.piratedens;

  const handleMainTabChange = (mainTab: MainTabType) => {
    // Update parent component with the appropriate tab
    if (mainTab === "help") {
      onTabChange("help");
    } else if (mainTab === "economy") {
      onTabChange("economy");
    } else if (mainTab === "player") {
      // If no custom meeples, default to create tab, otherwise my-meeples
      onTabChange(customMeeplesCount === 0 ? "create" : "my-meeples");
    } else if (mainTab === "ships") {
      onTabChange("traders"); // Default to first sub tab
    } else if (mainTab === "destinations") {
      onTabChange("stations"); // Default to first sub tab
    }
  };

  const handleSubTabChange = (subTab: TabType) => {
    onTabChange(subTab);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Main tabs */}
      <div role="tablist" className="tabs tabs-boxed">
        {MAIN_TABS.map((tab) => {
          const Icon = tab.icon;
          let count: number | undefined;
          if (tab.value === "ships") {
            count = shipsCount;
          } else if (tab.value === "destinations") {
            count = destinationsCount;
          }
          return (
            <a
              key={tab.value}
              role="tab"
              className={`tab ${currentMainTab === tab.value ? "tab-active" : ""} flex items-center gap-1.5`}
              onClick={() => handleMainTabChange(tab.value)}
            >
              {Icon && <Icon size={14} aria-hidden="true" className={tab.badgeColor ? getIconColorClass(tab.badgeColor) : ""} />}
              <span>{tab.label}</span>
              {count !== undefined && <span className={tab.badgeColor ? getIconColorClass(tab.badgeColor) : ""}>{count}</span>}
            </a>
          );
        })}
      </div>

      {/* Subtabs for Ships */}
      {currentMainTab === "ships" && (
        <div role="tablist" className="tabs tabs-boxed">
          {SHIP_SUBTABS.map((tab) => {
            const Icon = tab.icon;
            const count = meepleCounts[tab.value as keyof MeepleCounts];
            return (
              <a
                key={tab.value}
                role="tab"
                className={`tab ${currentSubTab === tab.value ? "tab-active" : ""} flex items-center gap-1.5`}
                onClick={() => handleSubTabChange(tab.value)}
              >
                <Icon size={14} aria-hidden="true" className={getIconColorClass(tab.badgeColor)} />
                <span>{tab.label}</span>
                <span className={getIconColorClass(tab.badgeColor)}>{count}</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Subtabs for Destinations */}
      {currentMainTab === "destinations" && (
        <div role="tablist" className="tabs tabs-boxed">
          {DESTINATION_SUBTABS.map((tab) => {
            const Icon = tab.icon;
            const count = meepleCounts[tab.value as keyof MeepleCounts];
            return (
              <a
                key={tab.value}
                role="tab"
                className={`tab ${currentSubTab === tab.value ? "tab-active" : ""} flex items-center gap-1.5`}
                onClick={() => handleSubTabChange(tab.value)}
              >
                <Icon size={14} aria-hidden="true" className={getIconColorClass(tab.badgeColor)} />
                <span>{tab.label}</span>
                <span className={getIconColorClass(tab.badgeColor)}>{count}</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Subtabs for Player */}
      {currentMainTab === "player" && (
        <div role="tablist" className="tabs tabs-boxed">
          {PLAYER_SUBTABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <a
                key={tab.value}
                role="tab"
                className={`tab ${currentSubTab === tab.value ? "tab-active" : ""} flex items-center gap-1.5`}
                onClick={() => handleSubTabChange(tab.value)}
              >
                <Icon size={14} aria-hidden="true" className={getIconColorClass(tab.badgeColor)} />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

