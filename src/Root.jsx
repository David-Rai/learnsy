import React from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify'
import IntroPopUp from './components/IntroPopup';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import useHomeStore from './context/store';

const Layout = () => {
  const isIntroDone = useHomeStore(state => state.isIntroDone);

  return !isIntroDone ? (
    <IntroPopUp />
  ) : (
    <div className="h-[100dvh] w-full bg-bg md:flex md:flex-row rootLayout">
      <Sidebar />
      <main className="h-[calc(100%-80px)] md:h-screen bg-bg w-full flex flex-col overflow-hidden">
        <Outlet />
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
};

export default Layout;
