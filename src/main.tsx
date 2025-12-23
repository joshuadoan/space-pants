import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { ToastProvider } from "./components/Toast.tsx";
import { GameProvider } from "./hooks/useGame.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GameProvider>
        <ToastProvider>
          <App />
          <canvas/>
        </ToastProvider>
      </GameProvider>
    </BrowserRouter>
  </StrictMode>
);
