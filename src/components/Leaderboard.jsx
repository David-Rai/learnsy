// Leaderboard.jsx
import React, { useEffect } from 'react'
import supabase from '../config/supabase'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { Trophy } from 'lucide-react'
import { useLeaderStore } from '../context/store'
import TopLeader from './leaders/TopLeaders'
import MidLeader from './leaders/MidLeaders'
import Loader from './Loader'

const Leaderboard = () => {
  const leaders = useLeaderStore(state => state.leaders) || []
  const setLeaders = useLeaderStore(state => state.setLeaders)

  // Fetch leaderboard once on mount
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data, error } = await fetchLeadersRPC()
        if (error) {
          console.error(error)
          return
        }
        setLeaders(data)
      } catch (err) {
        console.error(err)
      }
    }

    if (leaders.length === 0) fetchLeaders()
  }, [leaders.length, setLeaders])

  // RPC call to Supabase
  const fetchLeadersRPC = async () => {
    return await supabase.rpc('get_leaderboard_stats')
  }

  //loader
  if(leaders.length === 0){
    return (
      <Loader />
    )
  }
  return (
    <main className="h-screen bg-bg text-text pb-20 md:flex md:pb-0">
      <Sidebar />

      <div className="h-[calc(100vh-80px)] md:h-full pb-6 overflow-x-hidden custom-scrollbar w-full">
        {/* Header */}
        <header className="bg-secondary shadow-lg py-6 md:py-8 px-4 mb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-bg rounded-full shadow-xl border-b-4 border-yellow-600">
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 drop-shadow-lg">
                Leaderboard
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-300 font-medium">
              Top performers this season ({leaders.length} players)
            </p>
          </div>
        </header>

        {/* Top Leader */}
        {leaders[0] && <TopLeader l={leaders[0]} rank={1} />}

        {/* Other Leaders */}
        <div className="flex flex-col gap-3 mt-4">
          {leaders.slice(1).map((l, index) => (
            <MidLeader key={index} l={l} rank={index + 2} />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

export default Leaderboard
