import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Signin from './routes/auth/Signin.jsx'
import Profile from './routes/Profile.jsx'
import Home from './routes/Home'
import Explore from './routes/Explore.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Signup from './routes/auth/Signup.jsx'
import Dashboard from './routes/admins/Dashboard.jsx'
import GotoProfile from './routes/GotoProfile'
import Root from './Root'

//Public routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
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
        path: '/profile/:user_id',
        element: <Profile />
      }
      ,
      {
        path: '/explore',
        element: <Explore />
      }, ,
      {
        path: '/leaderboard',
        element: <Leaderboard />
      },

      {
        path: '/dashboard',
        element: <Dashboard />
      }, {
        path: '/goto_profile',
        element: <GotoProfile />
      }
    ]
  }
])


const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
