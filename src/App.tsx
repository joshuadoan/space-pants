import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Main } from "./components/Main";

function App() {
  return (
    <div className="p-2">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/:meepleId" element={<Main />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
