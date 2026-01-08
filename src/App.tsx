import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Main } from "./components/Main";
import { Detail } from "./components/Detail";

function App() {
  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/:meepleId" element={<Detail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
