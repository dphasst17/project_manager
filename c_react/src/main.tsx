import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from "@/contexts/app"
import { ApiProvider } from "@/contexts/api"
import Providers from "@/provider"
createRoot(document.getElementById('root')!).render(
  <Providers>
    <AppProvider>
      <ApiProvider>
        <App />
      </ApiProvider>
    </AppProvider>
  </Providers>
)
