import './style.css'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import Login from "./pages/Login"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} 
      />
    </>
  )
)

const App = () => {
  return <RouterProvider router={router} />
}

export default App
