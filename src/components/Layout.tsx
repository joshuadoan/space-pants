import { Outlet } from "react-router-dom";
import { IconBrandGithub } from "@tabler/icons-react";
import { Counts } from "./Counts";

export const Layout = () => {


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
        <div className="pb-2">
          <Counts />
        </div>
      </header>
      <main className="flex h-full">
        <div className="w-sm h-full">
          <Outlet />
        </div>
        <div className="w-full h-full">
          <canvas id="game-canvas" className="w-full h-full" />
        </div>
      </main>
    </div>
  );
};
