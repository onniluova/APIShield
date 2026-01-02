import './style.css'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/Settings"

import ProtectedRoute from "./components/ProtectedRoute"
import { UserProvider } from './context/userContext'
import { ThemeProvider } from './context/themeContext'
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </>
  )
)

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <RouterProvider router={router} />
      </ThemeProvider>
    </UserProvider>
  )
}

export default App