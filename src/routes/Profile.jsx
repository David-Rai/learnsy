import { useState } from 'react'
import React from 'react'
import { useUser } from '.././context/userContext'
import supabase from '../config/supabase'
import BottomNav from '../components/BottomNav'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { getStats } from '../utils/getStats'

const Profile = () => {
    const { user, setUser } = useUser()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null); // null initially

    useEffect(() => {
      async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          console.log("user existed");
          const s = await getStats(user.id);
          console.log(s); // fixed typo
          setStats(s);
        } else {
          navigate("/signup");
        }
      }
      checkUser();
    }, []);
    
    
    return (
        <main className='relative min-h-screen bg-black text-white'>
            {/* Header */}
            <nav className='w-full h-[60px] flex items-center justify-between px-4 border-b border-gray-800'>
                <div className="flex items-center" onClick={()=> navigate(-1)}>
                    <button className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <h1 className="text-lg font-semibold">{user?.user_metadata.username}</h1>
                <div className="flex items-center space-x-4">
                    <button className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Profile Section */}
            <section className="px-4 py-6 pb-24">
                <div className="flex items-center space-x-4 mb-4">
                    {/* Profile Image */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5">
                            <img
                                src="https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2560%2Cc_limit/Monkey-Selfie.jpg"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-black"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-black rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">🏆</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex justify-around">
                        <div className="text-center">
                            <div className="text-lg font-semibold">{(stats?.accuracy || 0).toFixed(1)}%</div>
                            <div className="text-xs text-gray-400">Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">#{stats?.rank}</div>
                            <div className="text-xs text-gray-400">Rank</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">{stats?.point}</div>
                            <div className="text-xs text-gray-400">Points</div>
                        </div>
                    </div>
                </div>

                {/* Username and Bio */}
                <div className="mb-4">
                    <h2 className="text-sm font-semibold mb-1">{user?.user_metadata.username}</h2>
                    <div className="flex items-center mb-2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-xs px-2 py-1 rounded-full font-medium">
                            Rank #{stats?.rank}
                        </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        🎯 Learning enthusiast | 📚 Knowledge seeker<br />
                        🌟 Making progress every day<br />
                        📍 On the path to mastery
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mb-6">
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Edit Profile
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Share Profile
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 py-2 px-3 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </button>
                </div>

                {/* Highlights */}
                <div className="flex space-x-4 overflow-x-auto pb-2 mb-6">
                    {['Learning', 'Achievements', 'Goals', 'Progress'].map((highlight, index) => (
                        <div key={index} className="flex-shrink-0 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center mb-2">
                                <span className="text-2xl">
                                    {index === 0 && '📚'}
                                    {index === 1 && '🏆'}
                                    {index === 2 && '🎯'}
                                    {index === 3 && '📊'}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">{highlight}</span>
                        </div>
                    ))}
                </div>

                {/* Content Tabs */}
                <div className="border-t border-gray-800">
                    <div className="flex">
                        <button className="flex-1 py-3 border-b-2 border-white">
                            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" />
                            </svg>
                        </button>
                        <button className="flex-1 py-3 border-b-2 border-transparent text-gray-500">
                            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 110-2h4z" />
                            </svg>
                        </button>
                        <button className="flex-1 py-3 border-b-2 border-transparent text-gray-500">
                            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-3 gap-1 p-1">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <div key={index} className="aspect-square bg-gray-800 rounded-sm flex items-center justify-center">
                                <div className="text-gray-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <BottomNav />
            </div>
        </main>
    )
}

export default Profile