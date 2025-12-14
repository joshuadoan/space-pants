import {
  IconUser,
  IconShip,
  IconPick,
  IconMeteor,
  IconSatellite,
  IconBeer,
  IconBuilding,
  IconMapPin,
  IconUsers,
  IconPlus,
  IconHelp,
  IconTool,
} from "@tabler/icons-react";

type TabType = "traders" | "miners" | "stations" | "asteroids" | "spacebars" | "spaceapartments" | "bartenders" | "pirates" | "piratedens" | "mechanics" | "all" | "player" | "my-meeples" | "create" | "help";

type MainTabType = "ships" | "destinations" | "player" | "help";

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
  { value: "player", label: "Player", icon: IconUser, badgeColor: "badge-success" },
  { value: "ships", label: "Ships", icon: IconShip, badgeColor: "badge-primary" },
  { value: "destinations", label: "Destinations", icon: IconMapPin, badgeColor: "badge-info" },
  { value: "help", label: "Help", icon: IconHelp, badgeColor: "badge-accent" },
];

const SHIP_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "traders", label: "Traders", icon: IconShip, badgeColor: "badge-primary" },
  { value: "miners", label: "Miners", icon: IconPick, badgeColor: "badge-secondary" },
  { value: "bartenders", label: "Bartenders", icon: IconUser, badgeColor: "badge-secondary" },
  { value: "pirates", label: "Pirates", icon: IconShip, badgeColor: "badge-error" },
  { value: "mechanics", label: "Mechanics", icon: IconTool, badgeColor: "badge-info" },
];

const DESTINATION_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "stations", label: "Stations", icon: IconSatellite, badgeColor: "badge-info" },
  { value: "asteroids", label: "Asteroids", icon: IconMeteor, badgeColor: "badge-accent" },
  { value: "spacebars", label: "Space Bars", icon: IconBeer, badgeColor: "badge-warning" },
  { value: "spaceapartments", label: "Space Apartments", icon: IconBuilding, badgeColor: "badge-info" },
  { value: "piratedens", label: "Pirate Dens", icon: IconBuilding, badgeColor: "badge-error" },
];

const PLAYER_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "my-meeples", label: "My Meeples", icon: IconUsers, badgeColor: "badge-success" },
  { value: "create", label: "Create", icon: IconPlus, badgeColor: "badge-success" },
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

