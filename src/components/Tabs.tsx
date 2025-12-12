type TabType = "player" | "traders" | "miners" | "stations" | "asteroids" | "spacebars" | "spaceapartments" | "treasurecollectors" | "bartenders" | "all" | "readme";

type MainTabType = "player" | "ships" | "destinations" | "readme";

type TabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
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

const MAIN_TABS: { value: MainTabType; label: string }[] = [
  { value: "player", label: "Player" },
  { value: "ships", label: "Ships" },
  { value: "destinations", label: "Destinations" },
  { value: "readme", label: "Readme" },
];

const SHIP_SUBTABS: { value: TabType; label: string }[] = [
  { value: "traders", label: "Traders" },
  { value: "miners", label: "Miners" },
  { value: "bartenders", label: "Bartenders" },
];

const DESTINATION_SUBTABS: { value: TabType; label: string }[] = [
  { value: "stations", label: "Stations" },
  { value: "asteroids", label: "Asteroids" },
  { value: "spacebars", label: "Space Bars" },
  { value: "spaceapartments", label: "Space Apartments" },
  { value: "treasurecollectors", label: "Treasure Collectors" },
];

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  const currentMainTab = getMainTabFromTabType(activeTab);
  const currentSubTab = getSubTabFromTabType(activeTab);

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
        {MAIN_TABS.map((tab) => (
          <a
            key={tab.value}
            role="tab"
            className={`tab ${currentMainTab === tab.value ? "tab-active" : ""}`}
            onClick={() => handleMainTabChange(tab.value)}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Subtabs for Ships */}
      {currentMainTab === "ships" && (
        <div role="tablist" className="tabs tabs-boxed">
          {SHIP_SUBTABS.map((tab) => (
            <a
              key={tab.value}
              role="tab"
              className={`tab ${currentSubTab === tab.value ? "tab-active" : ""}`}
              onClick={() => handleSubTabChange(tab.value)}
            >
              {tab.label}
            </a>
          ))}
        </div>
      )}

      {/* Subtabs for Destinations */}
      {currentMainTab === "destinations" && (
        <div role="tablist" className="tabs tabs-boxed">
          {DESTINATION_SUBTABS.map((tab) => (
            <a
              key={tab.value}
              role="tab"
              className={`tab ${currentSubTab === tab.value ? "tab-active" : ""}`}
              onClick={() => handleSubTabChange(tab.value)}
            >
              {tab.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

