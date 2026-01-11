import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Main } from "./components/Main";
import { Detail } from "./components/Detail";
import { Instructions } from "./components/Instructions";

function App() {
  return (
    <div className="p-2">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/:meepleId" element={<Detail />} />
          <Route path="/instructions" element={<Instructions />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
