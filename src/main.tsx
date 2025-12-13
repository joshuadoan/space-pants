import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './components/Toast.tsx'
import { GameProvider } from './hooks/useGame'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GameProvider>
  </StrictMode>,
)
