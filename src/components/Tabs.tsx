import {
  IconUser,
  IconShip,
  IconPick,
  IconMeteor,
  IconSatellite,
  IconBeer,
  IconBuilding,
  IconMapPin,
  IconBook,
} from "@tabler/icons-react";

type TabType = "player" | "traders" | "miners" | "stations" | "asteroids" | "spacebars" | "spaceapartments" | "bartenders" | "all" | "readme";

type MainTabType = "player" | "ships" | "destinations" | "readme";

type MeepleCounts = {
  player: number;
  traders: number;
  miners: number;
  asteroids: number;
  stations: number;
  spacebars: number;
  spaceapartments: number;
  bartenders: number;
};

type TabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  meepleCounts: MeepleCounts;
};

// Map TabType to main tab and sub tab
function getMainTabFromTabType(tab: TabType): MainTabType {
  if (tab === "player" || tab === "readme") {
    return tab;
  }
  if (tab === "traders" || tab === "miners" || tab === "bartenders") {
    return "ships";
  }
  return "destinations";
}

function getSubTabFromTabType(tab: TabType): TabType | null {
  if (tab === "player" || tab === "readme") {
    return null;
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
  };
  return colorMap[badgeColor] || "";
}

const MAIN_TABS: { value: MainTabType; label: string; icon?: React.ComponentType<{ size?: number; className?: string }>; badgeColor?: string }[] = [
  { value: "player", label: "Player", icon: IconUser, badgeColor: "badge-success" },
  { value: "ships", label: "Ships", icon: IconShip, badgeColor: "badge-primary" },
  { value: "destinations", label: "Destinations", icon: IconMapPin, badgeColor: "badge-info" },
  { value: "readme", label: "Readme", icon: IconBook, badgeColor: "badge-accent" },
];

const SHIP_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "traders", label: "Traders", icon: IconShip, badgeColor: "badge-primary" },
  { value: "miners", label: "Miners", icon: IconPick, badgeColor: "badge-secondary" },
  { value: "bartenders", label: "Bartenders", icon: IconUser, badgeColor: "badge-secondary" },
];

const DESTINATION_SUBTABS: { value: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badgeColor: string }[] = [
  { value: "stations", label: "Stations", icon: IconSatellite, badgeColor: "badge-info" },
  { value: "asteroids", label: "Asteroids", icon: IconMeteor, badgeColor: "badge-accent" },
  { value: "spacebars", label: "Space Bars", icon: IconBeer, badgeColor: "badge-warning" },
  { value: "spaceapartments", label: "Space Apartments", icon: IconBuilding, badgeColor: "badge-info" },
];

export function Tabs({ activeTab, onTabChange, meepleCounts }: TabsProps) {
  const currentMainTab = getMainTabFromTabType(activeTab);
  const currentSubTab = getSubTabFromTabType(activeTab);

  // Calculate aggregate counts for main tabs
  const shipsCount = meepleCounts.traders + meepleCounts.miners + meepleCounts.bartenders;
  const destinationsCount = meepleCounts.stations + meepleCounts.asteroids + meepleCounts.spacebars + meepleCounts.spaceapartments;

  const handleMainTabChange = (mainTab: MainTabType) => {
    // Update parent component with the appropriate tab
    if (mainTab === "player") {
      onTabChange("player");
    } else if (mainTab === "readme") {
      onTabChange("readme");
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
          if (tab.value === "player") {
            count = meepleCounts.player;
          } else if (tab.value === "ships") {
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
    </div>
  );
}

