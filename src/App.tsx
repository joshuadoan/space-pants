import { Routes, Route, Outlet } from "react-router-dom";
import { MeeplesList } from "./components/MeeplesList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MeeplesList />} />
        <Route path="meeple/:id" element={<MeeplesList />} />
      </Route>
    </Routes>
  );
}

export default App;

const Layout = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <main className="flex-1 flex h-full">
        <canvas id="game-canvas" className="absolute inset-0 w-full h-full" />
        <div className="h-full w-full opacity-80">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
