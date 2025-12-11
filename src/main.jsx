import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
 import { ToastContainer } from 'react-toastify';
import Task from './components/Task.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
    <ThemeProvider>
    <BrowserRouter>
    <App />

    <ToastContainer
    position="top-center"
autoClose={1000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
    />
  </BrowserRouter>
  </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
