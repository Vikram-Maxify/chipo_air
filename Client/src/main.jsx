import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './reducer/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from "react-helmet-async";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <HelmetProvider>
      <App />
      </HelmetProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
