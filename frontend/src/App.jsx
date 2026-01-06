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
import { UserProvider } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
      </Route>
    </>
  )
)

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={CLIENT_ID}>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  )
}

export default App