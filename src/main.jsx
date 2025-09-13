import React from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './context/userContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Signin from './routes/auth/Signin.jsx'
import Profile from './routes/Profile.jsx'
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
  },
  {
    path: '/profile',
    element: <Profile />
  }
])
createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
)
