import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { IconBrandGithub } from "@tabler/icons-react";
import { Counts } from "./Counts";
import { CameraControlIndicator } from "./CameraControlIndicator";
import { useGame } from "../Game/useGame";
import { useEffect } from "react";
import { MeepleRoles } from "../types";
import { MeepleInventoryItem } from "../types";
import cx from "classnames";

export const Layout = () => {
  const {
    hasStarted,
    meeples,
    setFilterBy,
    filterBy,
    setCameraControl,
    cameraControl,
    selectedMeeple,
    setSelectedMeeple,
  } = useGame();

  const { meepleId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const selectedMeeple = meeples.find(
      (meeple) => meeple.id.toString() === meepleId
    );

    setSelectedMeeple(selectedMeeple || null);
  }, [meepleId]);

  useEffect(() => {
    if (!!selectedMeeple) {
      setCameraControl("meeple");
    } else {
      setCameraControl("player");
    }
  }, [selectedMeeple]);

  // total counts for roles, inventory
  const counts = {
    ...Object.fromEntries(
      Object.values(MeepleRoles).map((role) => [
        role,
        meeples.filter((meeple) => meeple.roleId === role).length,
      ])
    ),
    ...Object.fromEntries(
      Object.values(MeepleInventoryItem).map((item) => [
        item,
        meeples.reduce((acc, meeple) => acc + meeple.inventory[item], 0),
      ])
    ),
  };

  const roleEntries = Object.entries(counts).filter(([key]) =>
    Object.values(MeepleRoles).includes(key as MeepleRoles)
  ) as [MeepleRoles, number][];

  const inventoryEntries = Object.entries(counts).filter(([key]) =>
    Object.values(MeepleInventoryItem).includes(key as MeepleInventoryItem)
  ) as [MeepleInventoryItem, number][];

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="block md:hidden bg-yellow-400 text-black text-center py-2 px-4 font-semibold z-50">
        desktop is better
      </div>
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/joshuadoan/space-pants"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="View on GitHub"
            >
              <IconBrandGithub size={24} />
            </a>
            <h1 className="text-2xl font-bold">space-pants</h1>
          </div>
          <p className="text-sm text-gray-500">A space simulation</p>
        </div>
        <div className="hidden md:block p-2">
          <Counts
            roleEntries={roleEntries}
            inventoryEntries={inventoryEntries}
          />
        </div>
      </header>
      <main className="flex flex-1 min-h-0">
        <div className="hidden md:flex md:flex-col w-sm min-h-0">
          <div className="flex flex-col gap-2 justify-between">
            <CameraControlIndicator cameraControl={cameraControl} />
            <div role="tablist" className="tabs tabs-box">
              <Link
                role="tab"
                className={cx("tab", {
                  // main route /
                  "tab-active": location.pathname === "/",
                })}
                to="/"
              >
                Meeples
              </Link>
              <Link
                role="tab"
                className={cx("tab", {
                  "tab-active": location.pathname === "/stats",
                })}
                to="/stats"
              >
                Stats
              </Link>
              <Link
                role="tab"
                className={cx("tab", {
                  // docs route /docs
                  "tab-active": location.pathname === "/instructions",
                })}
                to="/instructions"
              >
                Help
              </Link>
            </div>
          </div>
          <Outlet
            context={{
              selectedMeeple,
              meepleId,
              hasStarted,
              meeples,
              setFilterBy,
              filterBy,
            }}
          />
        </div>
        <div className="w-full h-full">
          <canvas id="game-canvas" className="w-full h-full" />
        </div>
      </main>
    </div>
  );
};
