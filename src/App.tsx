import { Routes, Route, Outlet, Link } from "react-router-dom";
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
      <nav className="h-10 bg-green-400">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 flex h-full">
        <div className="w-sm h-full">
          <Outlet />
        </div>
        <div className="flex-1 h-full bg-blue-500">
          <canvas id="game-canvas" className="w-full h-full" />
        </div>
      </main>
    </div>
  );
};
