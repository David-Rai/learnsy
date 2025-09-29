import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import React from 'react'
import { useNavigate } from 'react-router'
import {
    FaHome,
    FaCompass,
    FaUser,
    FaChartLine,
} from 'react-icons/fa';
import useHomeStore from '../context/store';

const BottomNav = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const {activeTab,setActiveTab}=useHomeStore()
    // const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        const path = location.pathname.replace("/", "") // remove leading slash
        setActiveTab(path || "home") // default to home if empty
    }, [location.pathname])

    return (
        <div className="w-full m-0 p-0 bg-secondary h-[80px] md:hidden">
            <div className="flex items-center justify-around py-2 px-4">
                {/* Home */}
                <button
                    onClick={() => {
                        setActiveTab("home")
                        navigate("/")
                    }}
                    className={`flex flex-col  cursor-pointer items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "home"
                        ? "text-primary"
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
                    className={`flex flex-col cursor-pointer items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "explore"
                        ? "text-primary"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaCompass className="w-6 h-6 mb-1" />
                    <span className="text-xs md:text-sm font-medium">Explore</span>
                </button>

                {/* Progress */}
                <button
                    onClick={() => {
                        setActiveTab("leaderboard")
                        navigate("/leaderboard")
                    }}
                    className={`flex flex-col cursor-pointer items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "leaderboard"
                        ? "text-primary"
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
                    className={`flex flex-col cursor-pointer items-center py-2 px-3 rounded-lg transition-colors ${activeTab === "profile"
                        ? "text-primary"
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
