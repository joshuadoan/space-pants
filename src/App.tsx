import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useGame } from "./hooks/useGame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainGameRoute />} />
        <Route path="meeple/:id" element={<Foo />} />
      </Route>
    </Routes>
  );
}

export default App;

const Foo = () => {
  return (
    <div>
      <h1>Foo</h1>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 flex">
        <div className="w-sm">
          <Outlet />
        </div>
        <div className="flex-1 bg-blue-500">
          <canvas id="game-canvas" className="w-full h-full" />
        </div>
      </main>
    </div>
  );
};

const MainGameRoute = () => {
  const { game, isLoading } = useGame();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>MainGameRoute</h1>
      <div>{game?.currentScene.actors.length}</div>
    </div>
  );
};
