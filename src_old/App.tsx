import { Routes, Route } from "react-router-dom";
import { Layout } from "./routes/Layout";
import { MainGameRoute } from "./routes/MainGameRoute";
import { MeepleDetailRoute } from "./routes/MeepleDetailRoute";

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
