import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Signin from './routes/auth/Signin.jsx'
import Home from './routes/Home'
import Signup from './routes/auth/Signup.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/signin',
    element: <Signin />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
