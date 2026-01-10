import { Outlet } from "react-router-dom";
import { Counts } from "./Counts";

export const Layout = () => {


  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="block md:hidden bg-yellow-400 text-black text-center py-2 px-4 font-semibold z-50">
        desktop is better
      </div>
      <header className="p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">space-pants</h1>
        </div>
        <Counts />
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
