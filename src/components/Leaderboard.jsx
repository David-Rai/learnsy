import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Crown, Medal, Trophy, Users, Target, Flame } from 'lucide-react'
import { getStats } from '../utils/getStats'
import supabase from '../config/supabase'
import BottomNav from './BottomNav'
import LeaderboardLoader from './LeaderBoardLoader'
import { useLeaderStore } from '../context/store'

const Leaderboard = () => {
  const loading = useLeaderStore(state => state.loading)
  const setLoading = useLeaderStore(state => state.setLoading)
  const leaders = useLeaderStore(state => state.leaders)
  const setLeaders = useLeaderStore(state => state.setLeaders)

  useEffect(() => {
    async function getLeaders() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('board')
          .select("*")
          .order("point", { ascending: false })
        if (error) {
          console.error('Error fetching leaderboard:', error)
          setLeaders([])
        } else {
          setLeaders(data || [])
        }
      } catch (err) {
        console.error(err)
        setLeaders([])
      } finally {
        setLoading(false)
      }
    }

    if (leaders.length === 0) {
      getLeaders()
    }

  }, [leaders, setLeaders])


  if (loading) return <LeaderboardLoader />

  if (!leaders.length) {
    console.log("no leaders")

    return (
      <main className="min-h-screen flex flex-col">
        <div className="bg-bg flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-text px-4">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Users className="w-12 h-12 text-text opacity-80" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No players yet</h2>
          <p className="text-base opacity-70 text-center max-w-sm">Be the first to join the leaderboard and claim your spot!</p>
        </div>
        <BottomNav />
      </main>
    )
  }

  const topThree = leaders.slice(0, 3)
  const otherPlayers = leaders.slice(3)

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
            <div className="flex items-center justify-center gap-2 mt-3 text-xs md:text-sm text-gray-400 font-medium">
              <Target className="w-4 h-4" />
              <span>{leaders.length} Players</span>
            </div>
          </div>
        </header>

        {/* Top Three Podium */}
        {topThree.length > 0 && (
          <section className="px-4 mb-8 md:mb-12">
            <div className="max-w-6xl mx-auto">
              {/* Mobile: Row layout */}
              <div className="flex items-end justify-center gap-2">
                {topThree[1] && <TopPlayer leader={topThree[1]} position={2} isMobile />}
                {topThree[0] && <TopPlayer leader={topThree[0]} position={1} isMobile />}
                {topThree[2] && <TopPlayer leader={topThree[2]} position={3} isMobile />}
              </div>
            </div>
          </section>
        )}

        {/* Other Players */}
        {otherPlayers.length > 0 && (
          <section className="px-4 pb-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-text mb-4 md:mb-6 text-center md:text-left">
                Mid Players
              </h2>
              <div className="max-h-96 space-y-3">
                {otherPlayers.map((leader, index) => (
                  <OtherPlayer key={leader.user_id} leader={leader} position={index + 4} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </main>
  )
}

const getPositionConfig = (position) => {
  const configs = {
    1: {
      height: { mobile: 'h-36', desktop: 'h-48' },
      width: { mobile: 'w-28', desktop: 'w-40' },
      avatar: { mobile: 'w-20 h-20', desktop: 'w-28 h-28' },
      icon: Crown,
      iconColor: 'text-yellow-400',
      iconBg: 'from-yellow-400/20 to-yellow-500/20'
    },
    2: {
      height: { mobile: 'h-32', desktop: 'h-40' },
      width: { mobile: 'w-24', desktop: 'w-36' },
      avatar: { mobile: 'w-16 h-16', desktop: 'w-24 h-24' },
      icon: Medal,
      iconColor: 'text-gray-300',
      iconBg: 'from-gray-300/20 to-gray-400/20'
    },
    3: {
      height: { mobile: 'h-28', desktop: 'h-36' },
      width: { mobile: 'w-24', desktop: 'w-32' },
      avatar: { mobile: 'w-14 h-14', desktop: 'w-20 h-20' },
      icon: Medal,
      iconColor: 'text-amber-600',
      iconBg: 'from-amber-600/20 to-amber-700/20'
    }
  }
  return configs[position] || configs[1]
}

const TopPlayer = ({ leader, position, isMobile = false }) => {
  const [stats, setStats] = useState(null)
  const { leaderDetails = [], addNewLeaderDetail } = useLeaderStore()

  useEffect(() => {
    const getDetails = async () => {
      const details = await getStats(leader.user_id)

      //adding into the zustand store
      const d = {
        [leader.id]: details
      }

      if (details) {
        addNewLeaderDetail(d)
      }
      setStats(details)
    }

    if (leaderDetails.length === 0) {
      getDetails()
    }

  
    if (leaderDetails.length > 0) {
      const thisStats = leaderDetails.find(l => Object.keys(l)[0] === String(leader.id))
      setStats(thisStats[String(leader.id)])
    }
  }, [])

  const config = getPositionConfig(position)
  const IconComponent = config.icon

  return (
    <div className="flex flex-col items-center relative">
      {/* Position Badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-[var(--secondary)] rounded-full p-2 shadow-lg">
          <IconComponent className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} ${config.iconColor}`} />
        </div>
      </div>

      {/* Avatar */}
      <div className={`${isMobile ? config.avatar.mobile : config.avatar.desktop} rounded-full overflow-hidden mb-3 shadow-xl ring-2 ring-[var(--primary)]/30`}>
        <img
          src={leader.avatar}
          alt={leader.username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Username */}
      <h3 className={`text-center font-bold ${isMobile ? 'text-sm' : 'text-base md:text-lg'} text-text mb-3`}>
        {leader.username.split(' ')[0]}
      </h3>

      {/* Points */}
      {stats && (
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Flame className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-orange-400`} />
          <p className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold text-text`}>
            {stats.point}
          </p>
        </div>
      )}

      {/* Podium Card */}
      <div className={`bg-gradient-to-br ${config.iconBg} backdrop-blur-sm rounded-t-3xl ${isMobile ? config.height.mobile : config.height.desktop} ${isMobile ? config.width.mobile : config.width.desktop} flex items-center justify-center relative overflow-hidden shadow-lg`}>
        <span className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold text-text opacity-90`}>
          {position}
        </span>
      </div>
    </div>
  )
}

const OtherPlayer = ({ leader, position }) => {
  const [stats, setStats] = useState(null)
  const { leaderDetails = [], addNewLeaderDetail } = useLeaderStore()

  useEffect(() => {
    const getDetails = async () => {
      const details = await getStats(leader.user_id)

      //adding into the zustand store
      const d = {
        [leader.id]: details
      }

      if (details) {
        addNewLeaderDetail(d)
      }
      setStats(details)
    }

    if (leaderDetails.length === 0) {
      getDetails()
    }

  
    if (leaderDetails.length > 0) {
      const thisStats = leaderDetails.find(l => Object.keys(l)[0] === String(leader.id))
      setStats(thisStats[String(leader.id)])
    }
  }, [])

  return (
    <div className="bg-[var(--secondary)] rounded-xl p-3 md:p-4
     flex items-center gap-3 md:gap-4 shadow-lg hover:shadow-xl
      transition-all duration-300 hover:scale-[1.02]">
      {/* Rank Badge */}
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 
      bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 rounded-full flex items-center justify-center shadow-md">
        <span className="text-sm md:text-base font-bold text-white">{position}</span>
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-[var(--primary)]/20">
        <img
          src={leader.avatar}
          alt={leader.username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-text truncate text-base md:text-lg mb-1">
          {leader.username}
        </h3>
        {stats && (
          <div className="flex items-center gap-2">
            <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
            <span className="text-sm md:text-base text-text opacity-80">{stats.point} points</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard