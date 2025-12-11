type TabType = "player" | "traders" | "miners" | "stations" | "asteroids" | "spacebars" | "spaceapartments" | "treasurecollectors" | "all" | "readme";

type TabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

const TABS: { value: TabType; label: string }[] = [
  // { value: "all", label: "All" },
  { value: "player", label: "Player" },
  { value: "traders", label: "Traders" },
  { value: "miners", label: "Miners" },
  { value: "stations", label: "Stations" },
  { value: "asteroids", label: "Asteroids" },
  { value: "spacebars", label: "Space Bars" },
  { value: "spaceapartments", label: "Space Apartments" },
  { value: "treasurecollectors", label: "Treasure Collectors" },
];

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div role="tablist" className="tabs tabs-boxed">
      {TABS.map((tab) => (
        <a
          key={tab.value}
          role="tab"
          className={`tab ${activeTab === tab.value ? "tab-active" : ""}`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </a>
      ))}
      <a
      key="readme-tab"
        role="tab"
        className="tab"
        onClick={() => onTabChange("readme")}
      >
        Readme
      </a>
    </div>
  );
}

