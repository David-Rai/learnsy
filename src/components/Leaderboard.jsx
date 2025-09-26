import React, { useState, useEffect } from 'react'
import { Crown, Medal, Trophy, Star, Users, Target, Flame } from 'lucide-react'
import { getStats } from '../utils/getStats'
import supabase from '../config/supabase'
import BottomNav from './BottomNav'
import Loader from './Loader'

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  // CSS color palette variables
  const colorVariables = {
    '--bg': 'oklch(12.9% 0.042 264.695)',
    '--text': '#FFFFFF',
    '--right': '#48FF00',
    '--wrong': '#FF385A',
    '--secondary': 'oklch(20.8% 0.042 265.755)',
    '--primary': 'oklch(58.5% 0.233 277.117)'
  }

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
    getLeaders()
  }, [])

  if (loading) return <Loader />

  if (!leaders.length) {
    return (
      <main className="min-h-screen flex flex-col" style={colorVariables}>
        <div className="bg-[var(--bg)] flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-[var(--text)] px-4">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Users className="w-12 h-12 text-[var(--text)] opacity-80" />
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
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-20" style={colorVariables}>
      <div className="min-h-[calc(100vh-80px)] pb-6">
        {/* Header */}
        <header className="text-center py-6 px-4 bg-gradient-to-b from-[var(--secondary)]/30 to-transparent">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-[var(--primary)]/30 to-[var(--secondary)] rounded-full">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[var(--primary)]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--right)] to-[var(--primary)] bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm md:text-base opacity-80 text-[var(--text)]">Top performers this season</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm opacity-70">
            <Target className="w-4 h-4" />
            <span>{leaders.length} Players</span>
          </div>
        </header>

        {/* Top Three Podium */}
        {topThree.length > 0 && (
          <section className="px-4 mb-8">
            <div className="max-w-6xl mx-auto">
              {/* Mobile: Row layout with closer spacing */}
              <div className="flex items-end justify-center gap-2 md:hidden">
                {topThree[1] && <TopPlayer leader={topThree[1]} position={2} isMobile />}
                {topThree[0] && <TopPlayer leader={topThree[0]} position={1} isMobile />}
                {topThree[2] && <TopPlayer leader={topThree[2]} position={3} isMobile />}
              </div>

              {/* Desktop: Podium layout */}
              <div className="hidden md:flex items-end justify-center gap-4 lg:gap-8">
                {topThree[1] && <TopPlayer leader={topThree[1]} position={2} />}
                {topThree[0] && <TopPlayer leader={topThree[0]} position={1} />}
                {topThree[2] && <TopPlayer leader={topThree[2]} position={3} />}
              </div>
            </div>
          </section>
        )}

        {/* Other Players */}
        {otherPlayers.length > 0 && (
          <section className="px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--text)] mb-4 text-center md:text-left">
                Other Players
              </h2>
              <div className="bg-gradient-to-br from-[var(--secondary)] via-[var(--secondary)] to-[var(--bg)] rounded-2xl p-4 shadow-lg border border-[var(--primary)]/20">
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {otherPlayers.map((leader, index) => (
                    <OtherPlayer key={leader.user_id} leader={leader} position={index + 4} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <BottomNav />
    </main>
  )
}

// Helper function for position configuration
const getPositionConfig = (position) => {
  const configs = {
    1: {
      heights: { mobile: 'h-32', desktop: 'h-40 md:h-48 lg:h-56' },
      avatars: { mobile: 'w-16 h-16', desktop: 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28' },
      widths: { mobile: 'w-24', desktop: 'w-32 lg:w-40' },
      icon: Crown,
      iconColor: 'text-yellow-400',
      gradient: 'from-yellow-400/20 via-yellow-500/15 to-yellow-600/20',
      border: 'border-yellow-400/50'
    },
    2: {
      heights: { mobile: 'h-28', desktop: 'h-32 md:h-40 lg:h-48' },
      avatars: { mobile: 'w-14 h-14', desktop: 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24' },
      widths: { mobile: 'w-20', desktop: 'w-28 lg:w-36' },
      icon: Medal,
      iconColor: 'text-gray-300',
      gradient: 'from-gray-300/20 via-gray-400/15 to-gray-500/20',
      border: 'border-gray-300/50'
    },
    3: {
      heights: { mobile: 'h-24', desktop: 'h-28 md:h-36 lg:h-44' },
      avatars: { mobile: 'w-12 h-12', desktop: 'w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20' },
      widths: { mobile: 'w-18', desktop: 'w-24 lg:w-32' },
      icon: Medal,
      iconColor: 'text-amber-600',
      gradient: 'from-amber-600/20 via-amber-700/15 to-amber-800/20',
      border: 'border-amber-600/50'
    }
  }
  return configs[position] || configs[1]
}

const TopPlayer = ({ leader, position, isMobile = false }) => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const getDetails = async () => {
      const details = await getStats(leader.user_id)
      setStats(details)
    }
    getDetails()
  }, [leader.user_id])

  const config = getPositionConfig(position)
  const IconComponent = config.icon

  const accuracy = stats && stats.total_questions > 0
    ? (stats.correct_answers / stats.total_questions) * 100
    : 0

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'text-[var(--right)]'
    if (accuracy < 50) return 'text-[var(--wrong)]'
    return 'text-[var(--text)]'
  }

  return (
    <div className="flex flex-col items-center relative">
      {/* Position Crown/Medal */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className={`bg-gradient-to-br ${config.gradient} bg-[var(--secondary)] rounded-full p-2 border-2 ${config.border} shadow-lg`}>
          <IconComponent className={`w-4 h-4 ${isMobile ? '' : 'md:w-5 md:h-5'} ${config.iconColor}`} />
        </div>
      </div>

      {/* Player Card */}
      <div className={`bg-gradient-to-b ${config.gradient} bg-[var(--secondary)] rounded-t-2xl ${
        isMobile ? config.heights.mobile : config.heights.desktop
      } ${
        isMobile ? config.widths.mobile : config.widths.desktop
      } flex flex-col items-center justify-start pt-6 relative overflow-hidden border-2 ${config.border} shadow-xl hover:shadow-2xl transition-all duration-300`}>
        
        {/* Avatar */}
        <div className={`${
          isMobile ? config.avatars.mobile : config.avatars.desktop
        } rounded-full border-2 border-[var(--primary)] overflow-hidden mb-2 bg-[var(--bg)] shadow-lg`}>
          <img 
            src={leader.avatar} 
            alt={leader.username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username and Points - Same column on mobile */}
        <div className="text-center px-1 space-y-1">
          <h3 className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} font-bold text-[var(--text)] leading-tight`}>
            {leader.username.split(' ')[0]}
          </h3>

          {/* Points with Fire Icon */}
          {stats && (
            <div className="flex items-center justify-center gap-1">
              <Flame className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-orange-400`} />
              <p className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} font-bold text-[var(--primary)]`}>
                {stats.point}
              </p>
            </div>
          )}

          {/* Accuracy */}
          {stats && stats.total_questions > 0 && (
            <div className="flex items-center justify-center gap-1">
              <Target className={`w-3 h-3 ${getAccuracyColor(accuracy)}`} />
              <span className={`text-xs font-semibold ${getAccuracyColor(accuracy)}`}>
                {accuracy.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Podium Base */}
      <div className={`${
        isMobile ? config.widths.mobile : config.widths.desktop
      } h-6 bg-gradient-to-b from-[var(--secondary)] to-[var(--bg)] rounded-b-lg border-t-2 border-[var(--primary)]/30 flex items-center justify-center shadow-lg`}>
        <span className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'} font-bold text-[var(--text)]`}>
          #{position}
        </span>
      </div>
    </div>
  )
}

const OtherPlayer = ({ leader, position }) => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const getDetails = async () => {
      const details = await getStats(leader.user_id)
      setStats(details)
    }
    getDetails()
  }, [leader.user_id])

  const accuracy = stats && stats.total_questions > 0 
    ? (stats.correct_answers / stats.total_questions) * 100 
    : 0

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'text-[var(--right)]'
    if (accuracy < 50) return 'text-[var(--wrong)]'
    return 'text-[var(--text)]'
  }

  return (
    <div className="bg-gradient-to-r from-[var(--bg)] to-[var(--secondary)]/50 rounded-xl p-4 flex items-center gap-4 border border-[var(--primary)]/30 hover:border-[var(--primary)]/60 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      {/* Rank Badge */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)] rounded-full flex items-center justify-center border border-[var(--primary)]/30">
        <span className="text-sm font-bold text-[var(--primary)]">#{position}</span>
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[var(--primary)]/40 overflow-hidden bg-[var(--secondary)] shadow-md">
        <img 
          src={leader.avatar} 
          alt={leader.username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-[var(--text)] truncate text-base mb-1">
          {leader.username}
        </h3>
        {stats && (
          <div className="flex items-center gap-2">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-sm text-[var(--text)] opacity-80">{stats.point}</span>
          </div>
        )}
      </div>

      {/* Accuracy */}
      {stats && stats.total_questions > 0 && (
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center justify-end gap-1 mb-1">
            <Target className={`w-4 h-4 ${getAccuracyColor(accuracy)}`} />
            <span className={`text-sm font-semibold ${getAccuracyColor(accuracy)}`}>
              {accuracy.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-[var(--text)] opacity-70">accuracy</p>
        </div>
      )}
    </div>
  )
}

export default Leaderboard