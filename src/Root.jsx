import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'

const Layout = () => {
  return (
    <div className='h-screen w-full bg-bg md:flex md:flex-row rootLayout'>
      <Sidebar />
        <main className="h-[calc(100%-80px)] md:h-screen bg-bg w-full flex flex-col overflow-hidden">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout
