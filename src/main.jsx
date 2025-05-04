import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CrudProvider } from './context/api/crud-user.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CargasAlertsProvider } from './context/api/load-alerts/cargas.jsx'
import { Toasty } from './context/api/load-alerts/toastfy-alerts.jsx'
import { HelmetProvider } from 'react-helmet-async';
import { ProviderTheme } from './context/theme/theme.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ProviderTheme>
        <CargasAlertsProvider>
          <Toasty>
            <CrudProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </CrudProvider>
          </Toasty>
        </CargasAlertsProvider>
      </ProviderTheme>
    </HelmetProvider>
  </StrictMode>
)
