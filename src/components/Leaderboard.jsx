import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Crown, Medal, Trophy, Users, Target, Flame } from 'lucide-react'
import { getStats } from '../utils/getStats'
import supabase from '../config/supabase'
import BottomNav from './BottomNav'
import useHomeStore, { useLeaderStore } from '../context/store'

const Leaderboard = () => {
  const leaders = useLeaderStore(state => state.leaders) || []
  const setLeaders = useLeaderStore(state => state.setLeaders) || []

  //Getting all board users
  useEffect(() => {
    const get = async () => {
      const { data, error } = await supabase.rpc('get_leaderboard_stats')
      if (error) {
        return console.error(error);
      }
      console.log(data); // Array of all users with stats
      setLeaders(data)
    }

    // if no leaders fetched then
    if (leaders.length === 0) {
      get()
    }
  }, [])

  return (
    <main className="h-screen bg-bg text-text pb-20 md:flex md:pb-0">
      {/* Sidebar */}
      <Sidebar />

      {/* Main container */}
      <div className="h-[calc(100vh-80px)] md:h-full pb-6 overflow-x-hidden custom-scrollbar w-full">
        {/* Header */}
        <header className="bg-secondary shadow-lg py-6 md:py-8 px-4 mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-bg rounded-full shadow-xl border-b-4 border-yellow-600">
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 drop-shadow-lg">
                Leaderboard
              </h1>
            </div>
            <p className="text-sm md:text-base text-center text-gray-300 font-medium">
              Top performers this season
            </p>
          </div>
        </header>

        {/* TopPlayer */}
        {
          leaders.length > 0 && <Top l={leaders[0]} rank={1} />
        }

        {/* Other Players */}
        <div className='flex flex-col'>
          {
            leaders.length === 0 ? (
              <div>No users </div>
            )
              :
              leaders.slice(1).map((l, index) => <Other l={l} key={l.user_id} rank={index + 2} />)
          }
        </div>
      </div>
      {/* Bottom navigation */}
      <BottomNav />
    </main>
  )
}

const Other = ({ l, rank }) => {
  const { username, avatar, points, total_questions, wrong_questions } = l
  const right_questions = total_questions - wrong_questions
  const accuracy = total_questions === 0 ? 0
    : ((Number(right_questions) / Number(total_questions)) * 100).toFixed(1)

  return (
    <section className="flex items-center justify-between p-3 md:p-4 bg-[var(--secondary)] rounded-xl shadow hover:shadow-lg transition-all duration-200">
      {/* Rank */}
      <div className="flex-shrink-0 w-10 text-center font-bold text-lg md:text-xl text-text">
        {rank}
      </div>

      {/* Avatar and username */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        {/* <img
      src={avatar}
      alt={username}
      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-[var(--primary)]/20"
    /> */}
        <p className="truncate font-semibold text-text text-sm md:text-base">{username}</p>
      </div>

      {/* Stats: accuracy, points, total questions */}
      <div className="flex items-center gap-4 md:gap-6 font-mono text-sm md:text-base">
        <div className="text-center">
          <p className="font-bold">{accuracy}%</p>
          <p className="text-xs text-gray-400">Accuracy</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{points}</p>
          <p className="text-xs text-gray-400">Points</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{total_questions}</p>
          <p className="text-xs text-gray-400">Total Qs</p>
        </div>
      </div>
    </section>

  )
}


// Top player

const Top = ({ l, rank }) => {
  const { username, avatar, points, total_questions, wrong_questions } = l
  const right_questions = total_questions - wrong_questions
  const accuracy = total_questions === 0 ? 0
    : ((Number(right_questions) / Number(total_questions)) * 100).toFixed(1)

  return (
    <section className="flex items-center justify-between p-3 md:p-4 bg-primary rounded-xl shadow hover:shadow-lg transition-all duration-200">
      {/* Rank */}
      <div className="flex-shrink-0 w-10 text-center font-bold text-lg md:text-xl text-text">
        {rank}
      </div>

      {/* Avatar and username */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        {/* <img
      src={avatar}
      alt={username}
      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-[var(--primary)]/20"
    /> */}
        <p className="truncate font-semibold text-text text-sm md:text-base">{username}</p>
      </div>

      {/* Stats: accuracy, points, total questions */}
      <div className="flex items-center gap-4 md:gap-6 font-mono text-sm md:text-base">
        <div className="text-center">
          <p className="font-bold">{accuracy}%</p>
          <p className="text-xs text-gray-400">Accuracy</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{points}</p>
          <p className="text-xs text-gray-400">Points</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{total_questions}</p>
          <p className="text-xs text-gray-400">Total Qs</p>
        </div>
      </div>
    </section>

  )
}

export default Leaderboard