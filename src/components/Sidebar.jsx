import React, { useEffect } from 'react';
import useHomeStore, { useAdminStore } from '../context/store';
import checkAdmin from '../utils/checkAdmin';
import { LayoutDashboard } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router';
import {
  FaHome,
  FaCompass,
  FaUser,
  FaChartLine,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useHomeStore();
  const { isAdmin, setIsAdmin } = useAdminStore()

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    setActiveTab(path || "home");
  }, [location.pathname, setActiveTab]);

  const menuItems = [
    { name: "home", icon: <FaHome />, label: "Home", path: "/" },
    { name: "explore", icon: <FaCompass />, label: "Explore", path: "/explore" },
    { name: "leaderboard", icon: <FaChartLine />, label: "Leaderboard", path: "/leaderboard" },
    { name: "profile", icon: <FaUser />, label: "Profile", path: "/goto_profile" },
  ];


  //checking admin or not
  useEffect(() => {
    checkAdmin()
  }, [])

  return (
    <div className="hidden lg:flex lg:flex-col bg-secondary w-64 h-screen p-4">
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => {
            setActiveTab(item.name);
            navigate(item.path);
          }}
          className={`flex items-center gap-3 py-3 px-4 mb-2 rounded-lg transition-colors cursor-pointer ${activeTab === item.name
            ? "text-primary bg-gray-700"
            : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}

      {/* Dashboard button */}
      {
        isAdmin && (
          <button
            key='dashboard'
            onClick={() => {
              setActiveTab('dashboard');
              navigate('/dashboard');
            }}
            className={`flex items-center gap-3 py-3 px-4 mb-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'dashboard'
              ? "text-primary bg-gray-700"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
          >
            <span className="text-lg"><LayoutDashboard /></span>
            <span className="font-medium">Dashboard</span>
          </button>
        )
      }
    </div>
  );
};

export default Sidebar;
