import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import { AuditProvider } from './context/AuditContext'
import { NetworkProvider } from './context/NetworkContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <AuditProvider>
        <NetworkProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </NetworkProvider>
      </AuditProvider>
    </UserProvider>
  </StrictMode>,
)

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
