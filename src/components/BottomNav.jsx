import { useState ,useEffect} from 'react';
import { useLocation } from 'react-router';
import React from 'react'
import { useNavigate } from 'react-router'
import {
    FaHome,
    FaCompass,
    FaUser,
    FaChartLine,
} from 'react-icons/fa';

const BottomNav = () => {
    const location=useLocation()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        const path = location.pathname.replace("/", "") // remove leading slash
        setActiveTab(path || "home") // default to home if empty
      }, [location.pathname])

    return (
        <div className="absolute w-full bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-30">
            <div className="flex items-center justify-around py-2 px-4">
                {/* Home */}
                <button
                    onClick={() => {
                        setActiveTab("home")
                        navigate("/")
                    }}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "home"
                        ? "text-indigo-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaHome className="w-6 h-6 mb-1" />
                    <span className="text-xs md:text-sm font-medium">Home</span>
                </button>

                {/* Explore */}
                <button
                       onClick={() => {
                        setActiveTab("explore")
                        navigate("/explore")
                    }}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "explore"
                        ? "text-indigo-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaCompass className="w-6 h-6 mb-1" />
                    <span className="text-xs md:text-sm font-medium">Explore</span>
                </button>

                {/* Progress */}
                <button
                     onClick={() => {
                        setActiveTab("progress")
                        navigate("/progress")
                    }}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "progress"
                        ? "text-indigo-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaChartLine className="w-6 h-6 mb-1" />
                    <span className="text-xs md:text-sm font-medium">Leaderboard</span>
                </button>

                {/* Profile */}
                <button
                       onClick={() => {
                        setActiveTab("profile")
                        navigate("/profile")
                    }}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "profile"
                        ? "text-indigo-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaUser className="w-6 h-6 mb-1" />
                    <span className="text-xs md:text-sm font-medium">Profile</span>
                </button>
            </div>
        </div>
    )
}

export default BottomNav
