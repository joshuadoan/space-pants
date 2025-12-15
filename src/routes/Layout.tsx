import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IconRocket } from "@tabler/icons-react";
import { useGame, type TabType } from "../hooks/useGame";
import { Tabs } from "../components/Tabs";
import { MeepleType } from "../entities/types";
import { NavigationHandler } from "./NavigationHandler";
import { PlayerGoodsDisplay } from "./PlayerGoodsDisplay";

export function Layout() {
  const navigate = useNavigate();
  const {
    meepleCounts,
    meeples,
    zoom,
    setZoom,
    zoomToEntity,
  } = useGame();

  const [activeTab, setActiveTab] = useState<TabType>("traders");

  const handleTabChange = (tab: TabType) => {
    zoomToEntity(null);
    navigate("/");
    setActiveTab(tab);
  };

  return (
    <main className="w-screen h-screen flex flex-col">
      <NavigationHandler />
      {/* Mobile message banner */}
      <div className="md:hidden bg-warning text-warning-content text-center py-2 px-4 text-sm font-semibold sticky top-0 z-50">
        Desktop is better
      </div>
      {/* Sticky navbar at the top */}
      <div className="navbar bg-base-100 shadow-lg sticky md:top-0 top-10 z-40">
        <div className="flex-1 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2 px-2 w-full">
            <div className="flex items-center gap-2">
              <IconRocket size={28} className="text-primary" />
              <h1 className="text-2xl font-bold text-base-content">
                Space Pants
              </h1>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-base-content/70">Zoom</span>
                <span className="text-sm font-semibold text-base-content">{zoom.toFixed(1)}x</span>
              </div>
              <div className="w-32">
                <input
                  type="range"
                  min="0.3"
                  max="5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="range range-secondary range-sm"
                />
              </div>
            </div>
          </div>
          <div className="hidden md:block w-full">
            <div className="flex items-center justify-between gap-4 mb-2">
              <Tabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                meepleCounts={meepleCounts}
                customMeeplesCount={meeples.filter((m) => m.type === MeepleType.Custom).length}
              />
              <PlayerGoodsDisplay />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with outlet and canvas */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <Outlet context={{ activeTab, setActiveTab }} />
        </div>
        <div className="flex-1">
          <canvas id="game-canvas" className="w-full h-full" />
        </div>
      </div>
    </main>
  );
}

