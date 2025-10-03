import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Signin from './routes/auth/Signin.jsx'
import Profile from './routes/Profile.jsx'
import Home from './routes/Home'
import Explore from './routes/Explore.jsx'
import Leaderboard from './components/Leaderboard.jsx'
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
  ,
  {
    path: '/explore',
    element: <Explore />
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
