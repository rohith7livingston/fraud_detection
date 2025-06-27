import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css' // ✨ Single global CSS import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)