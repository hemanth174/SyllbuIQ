import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/Themecontext/ThemeContext'
import { UserProvider } from './context/userContext/userContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <UserProvider>
        <App />
    </UserProvider>
    </ThemeProvider>
  </StrictMode>
)