import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import './index.css'
import './styles/MobileResponsive.css' // NEW: Comprehensive mobile responsive styles
import '@fortawesome/fontawesome-free/css/all.min.css'

// Create a QueryClient instance
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Optional: Adds devtools in development; remove for production if desired */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)