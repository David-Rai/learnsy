import React from 'react'
import { Outlet } from 'react-router'
import Nav from './components/BottomNav'

const Layout = () => {
  return (
    <div>
      <Nav /> {/* Rendered once, persistent across all pages */}
      <main>
        <Outlet /> {/* This renders the matched route element */}
      </main>
    </div>
  )
}

export default Layout
