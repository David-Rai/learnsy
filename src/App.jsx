import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Signin from './routes/auth/Signin.jsx'
import Profile from './routes/Profile.jsx'
import Home from './routes/Home'
// import Explore from './routes/Explore.jsx'
import NewExplore from './routes/NewExplore'
import AddQuestion from './routes/admins/AddQuestion'
import { ToastContainer } from 'react-toastify'
import Leaderboard from './components/Leaderboard.jsx'
import Signup from './routes/auth/Signup.jsx'
import Member from './routes/admins/Member'
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
        element: <NewExplore />
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
      }, {
        path: '/member',
        element: <Member />
      },
      {
        path: '/addQuestion',
        element: <AddQuestion />
      }
    ]
  }
])


const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
