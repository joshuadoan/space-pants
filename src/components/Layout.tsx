import { Outlet, useParams } from "react-router-dom";
import { IconBrandGithub } from "@tabler/icons-react";
import { Counts } from "./Counts";
import { useGame } from "../Game/useGame";
import { useEffect } from "react";
import { MeepleRoles } from "../types";
import { MeepleInventoryItem } from "../types";

export const Layout = () => {
  const { hasStarted, meeples, setFilterBy, filterBy, lockCameraToMeeple } =
    useGame();

  const { meepleId } = useParams();
  const selectedMeeple = meeples.find(
    (meeple) => meeple.id.toString() === meepleId
  );

  useEffect(() => {
    if (selectedMeeple) {
      lockCameraToMeeple(selectedMeeple);
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
      <header className="p-2 flex justify-between items-center">
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
        <div className="p-2">
          <Counts
            roleEntries={roleEntries}
            inventoryEntries={inventoryEntries}
          />
        </div>
      </header>
      <main className="flex h-full">
        <div className="w-sm h-full">
          {
            !hasStarted && (
              <div className="p-4">
                <h2 className="text-2xl font-bold">Loading...</h2>
              </div>
            )
          }
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
