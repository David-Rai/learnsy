import React, { useEffect } from 'react';
import MemberControls from './MemberControls';
import useHomeStore, { useAdminStore ,useMemberStore} from '../context/store';
import checkMember from '../utils/checkMember'
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
  const { isAdminChecked, isAdmin } = useAdminStore()
  const { isMemberChecked, isMember } = useMemberStore()

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


  //Checking member or not
  useEffect(() => {
    if (!isAdminChecked) checkAdmin()
    if (!isMemberChecked) checkMember()
  }, [])

  return (
    <div className="hidden lg:flex lg:flex-col bg-secondary w-64 h-screen p-4 z-50">
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => {
            setActiveTab(item.name);
            navigate(item.path);
          }}
          className={`flex items-center gap-3 py-3 px-4 mb-2 rounded-lg transition-colors cursor-pointer ${activeTab === item.name
            ? "text-text bg-primary"
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
              ? "text-text bg-primary"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
          >
            <span className="text-lg"><LayoutDashboard /></span>
            <span className="font-medium">Dashboard</span>
          </button>
        )
      }

      {/* Member contorls*/}
      {
        isMember && (
     <MemberControls />    
        )
      }
    </div>
  );
};

export default Sidebar;
