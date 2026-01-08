import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="block md:hidden bg-yellow-400 text-black text-center py-2 px-4 font-semibold z-50">
        desktop is better
      </div>
      <main className="flex h-full">
        <div className="w-sm h-full">
          <header className="p-4">
            <h1 className="text-2xl font-bold">space-pants</h1>
            <p className="text-sm text-gray-500">A space simulation</p>
          </header>
          <Outlet />
        </div>
        <div className="w-full h-full">
          <canvas id="game-canvas" className="w-full h-full" />
        </div>
      </main>
    </div>
  );
};

