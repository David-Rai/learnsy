import { useNavigate } from 'react-router'
import supabase from '../config/supabase'
import { getStats } from '../utils/getStats'
import { checkUser } from '../utils/checkUser'
import { useUser } from '../context/userContext'
import React from 'react'
import BottomNav from '../components/BottomNav'
import { useState, useEffect } from 'react'

// Circular Progress Bar Component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, gradient = "from-emerald-400 to-green-600" }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Create unique gradient ID for each progress circle
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90 drop-shadow-sm"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-emerald-400" stopColor="currentColor" />
            <stop offset="100%" className="text-green-600" stopColor="currentColor" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out filter drop-shadow-sm"
        />
      </svg>
      {/* Percentage text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ title, value, icon, gradientFrom, gradientTo, bgGradient }) => (
  <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-transparent hover:scale-105">
    {/* Background gradient overlay */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${bgGradient || 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}></div>

    <div className="relative p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        {icon && (
          <div className={`${gradientFrom && gradientTo
            ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}`
            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            } rounded-xl p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  </div>
)

const Progress = () => {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  //getting my datas
  useEffect(() => {
    checkUser(setUser).then(async a => {
      if (a.exist) {
        const id = a.user.id
        const s = await getStats(id)
        setStats(s)
      } else {
        navigate('/signup')
      }
    })
  }, [])

  // Loading state
  if (!stats) {
    return (
      <main className='home min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto'>
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className='relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-y-auto pb-24'>
      {/* Fixed Header with Gradient */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              My Progress
            </h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Accuracy Progress Circle */}
        <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8 text-center">
            Overall Accuracy
          </h2>
          <div className="flex justify-center">
            <div className="relative">
              <CircularProgress
                percentage={stats.accuracy || 0}
                size={160}
                strokeWidth={14}
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <StatsCard
            title="Current Rank"
            value={`#${stats.rank || 'N/A'}`}
            gradientFrom="from-purple-500"
            gradientTo="to-pink-500"
            bgGradient="bg-gradient-to-br from-purple-500 to-pink-500"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          />

          <StatsCard
            title="Accuracy Rate"
            value={`${(stats.accuracy || 0).toFixed(1)}%`}
            gradientFrom="from-indigo-500"
            gradientTo="to-violet-600"
            bgGradient="bg-gradient-to-br from-indigo-500 to-violet-600"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          />

          <StatsCard
            title="Total Points"
            value={stats.point || 0}
            gradientFrom="from-yellow-400"
            gradientTo="to-orange-500"
            bgGradient="bg-gradient-to-br from-yellow-400 to-orange-500"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
          />

          <StatsCard
            title="Total Questions"
            value={stats.total || 0}
            gradientFrom="from-blue-500"
            gradientTo="to-cyan-500"
            bgGradient="bg-gradient-to-br from-blue-500 to-cyan-500"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            }
          />

          <StatsCard
            title="Correct Answers"
            value={stats.correct || 0}
            gradientFrom="from-emerald-500"
            gradientTo="to-green-600"
            bgGradient="bg-gradient-to-br from-emerald-500 to-green-600"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
          />

          <StatsCard
            title="Wrong Answers"
            value={stats.wrong || 0}
            gradientFrom="from-red-500"
            gradientTo="to-rose-600"
            bgGradient="bg-gradient-to-br from-red-500 to-rose-600"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            }
          />

        </section>

        {/* Progress Breakdown */}
        <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
            Performance Breakdown
          </h2>
          <div className="space-y-6">
            {/* Correct Answers Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Correct Answers</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {stats.correct || 0} / {stats.total || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${stats.total ? (stats.correct / stats.total) * 100 : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Wrong Answers Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wrong Answers</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {stats.wrong || 0} / {stats.total || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-red-500 to-rose-600 h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${stats.total ? (stats.wrong / stats.total) * 100 : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
            Leaderboard
          </h2>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Leaderboard coming soon...</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Track your ranking among other players</p>
          </div>
        </section>
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </main>
  )
}

export default Progress