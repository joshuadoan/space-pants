import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { ToastProvider } from "./components/Toast.tsx";
import { GameProvider } from "./hooks/useGame";
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GameProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </GameProvider>
    </BrowserRouter>
  </StrictMode>,
)
