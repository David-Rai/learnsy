import React from 'react'
import { useState, useEffect } from 'react'
import { Crown, Medal, Trophy, Star, Users, Target, CheckCircle } from 'lucide-react'
import { getStats } from '../utils/getStats'
import supabase from '../config/supabase'
import BottomNav from './BottomNav'
import Loader from './Loader'

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  // Define CSS variables for the color palette
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

        const { data, error: boardError } = await supabase
          .from('board')
          .select("*")
          .order("point", { ascending: false })

        if (boardError) {
          console.error('Error fetching board:', boardError)
          setLoading(false)
          return
        }

        setLeaders(data || [])
        setLoading(false)

      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }

    getLeaders()
  }, [])

  if (loading) {
    return <Loader />
  }

  if (leaders.length === 0) {
    return (
      <main className="min-h-screen" style={colorVariables}>
        <div className="bg-[var(--bg)] flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-[var(--text)] px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] rounded-full flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-[var(--text)] opacity-80" />
          </div>
          <p className="text-lg font-semibold mb-2">No players yet</p>
          <p className="text-sm opacity-80 text-center">Be the first to join the leaderboard!</p>
        </div>
        <BottomNav />
      </main>
    )
  }

  const topThree = leaders.slice(0, 3)
  const otherPlayers = leaders.slice(3)

  return (
    <main className="min-h-screen" style={colorVariables}>
      <div className="bg-[var(--bg)] min-h-[calc(100vh-80px)] pb-6">
        {/* Header */}
        <div className="text-center py-6 px-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[var(--primary)]" />
            <h1 className="text-2xl md:text-4xl font-bold text-[var(--text)]">Leaderboard</h1>
          </div>
          <p className="text-sm md:text-base opacity-80 text-[var(--text)]">Top performers this season</p>
        </div>

        {/* Top Three Podium */}
        {topThree.length > 0 && (
          <section className="px-4 mb-8">
            <div className="max-w-6xl mx-auto">
              {/* Mobile: Stack vertically */}
              <div className="flex flex-col items-center gap-6 md:hidden">
                {topThree.map((leader, index) => (
                  <TopPlayer key={leader.user_id} leader={leader} position={index + 1} />
                ))}
              </div>
              
              {/* Desktop: Podium layout */}
              <div className="hidden md:flex items-end justify-center gap-4 lg:gap-8">
                {/* 2nd Place */}
                {topThree[1] && <TopPlayer leader={topThree[1]} position={2} />}
                
                {/* 1st Place */}
                {topThree[0] && <TopPlayer leader={topThree[0]} position={1} />}
                
                {/* 3rd Place */}
                {topThree[2] && <TopPlayer leader={topThree[2]} position={3} />}
              </div>
            </div>
          </section>
        )}

        {/* Rest of the players */}
        {otherPlayers.length > 0 && (
          <section className="px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--text)] mb-4 text-center md:text-left">
                Other Players
              </h2>
              <div className="bg-[var(--secondary)] rounded-2xl p-4 shadow-lg border border-[var(--primary)]/20">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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

const TopPlayer = ({ leader, position }) => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const getDetails = async () => {
      const details = await getStats(leader.user_id)
      setStats(details)
    }
    getDetails()
  }, [leader.user_id])

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'text-[var(--right)]'
    if (accuracy < 50) return 'text-[var(--wrong)]'
    return 'text-[var(--text)]'
  }

  const getPositionStyles = () => {
    switch (position) {
      case 1:
        return {
          podiumHeight: 'h-40 md:h-48 lg:h-56',
          avatarSize: 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28',
          iconColor: 'text-yellow-400',
          icon: Crown,
          bgGradient: 'from-yellow-400/20 to-yellow-600/20',
          borderStyle: 'border-2 border-yellow-400/50'
        }
      case 2:
        return {
          podiumHeight: 'h-32 md:h-40 lg:h-48',
          avatarSize: 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24',
          iconColor: 'text-gray-300',
          icon: Medal,
          bgGradient: 'from-gray-300/20 to-gray-500/20',
          borderStyle: 'border-2 border-gray-300/50'
        }
      case 3:
        return {
          podiumHeight: 'h-28 md:h-36 lg:h-44',
          avatarSize: 'w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20',
          iconColor: 'text-amber-600',
          icon: Medal,
          bgGradient: 'from-amber-600/20 to-amber-800/20',
          borderStyle: 'border-2 border-amber-600/50'
        }
      default:
        return {
          podiumHeight: 'h-32',
          avatarSize: 'w-16 h-16',
          iconColor: 'text-[var(--primary)]',
          icon: Star,
          bgGradient: 'from-[var(--primary)]/20 to-[var(--secondary)]/20',
          borderStyle: 'border-2 border-[var(--primary)]/30'
        }
    }
  }

  const styles = getPositionStyles()
  const IconComponent = styles.icon
  const accuracy = stats ? ((stats.correct_answers / stats.total_questions) * 100) : 0

  return (
    <div className="flex flex-col items-center relative w-full md:w-auto">
      {/* Position indicator */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-[var(--secondary)] rounded-full p-2 border-2 border-[var(--primary)] shadow-lg">
          <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${styles.iconColor}`} />
        </div>
      </div>

      {/* Player card */}
      <div className={`bg-gradient-to-b ${styles.bgGradient} bg-[var(--secondary)] rounded-t-2xl ${styles.podiumHeight} w-full max-w-48 md:w-32 lg:w-40 flex flex-col items-center justify-start pt-8 relative overflow-hidden ${styles.borderStyle} shadow-xl`}>
        {/* Avatar */}
        <div className={`${styles.avatarSize} rounded-full border-2 border-[var(--primary)] overflow-hidden mb-3 bg-[var(--bg)] shadow-lg`}>
          <img 
            src={leader.avatar} 
            alt={leader.username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <h3 className="text-sm md:text-base font-bold text-[var(--text)] text-center leading-tight px-2 mb-1">
          {leader.username.split(' ')[0]}
        </h3>

        {/* Points */}
        {stats && (
          <div className="text-center mb-2">
            <p className="text-lg md:text-xl font-bold text-[var(--primary)]">
              {stats.point}pts
            </p>
          </div>
        )}

        {/* Accuracy */}
        {stats && stats.total_questions > 0 && (
          <div className="flex items-center justify-center gap-1 mb-2">
            <Target className={`w-3 h-3 md:w-4 md:h-4 ${getAccuracyColor(accuracy)}`} />
            <span className={`text-xs md:text-sm font-semibold ${getAccuracyColor(accuracy)}`}>
              {accuracy.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Podium base */}
      <div className="w-full max-w-48 md:w-32 lg:w-40 h-8 bg-[var(--secondary)] rounded-b-lg border-t-2 border-[var(--primary)]/30 flex items-center justify-center shadow-lg">
        <span className="text-xl md:text-2xl font-bold text-[var(--text)]">#{position}</span>
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

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'text-[var(--right)]'
    if (accuracy < 50) return 'text-[var(--wrong)]'
    return 'text-[var(--text)]'
  }

  const accuracy = stats && stats.total_questions > 0 ? 
    ((stats.correct_answers / stats.total_questions) * 100) : 0

  return (
    <div className="bg-[var(--bg)] rounded-xl p-4 flex items-center gap-4 border border-[var(--primary)]/30 hover:border-[var(--primary)]/60 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      {/* Rank */}
      <div className="flex-shrink-0 w-10 h-10 bg-[var(--primary)]/20 rounded-full flex items-center justify-center border border-[var(--primary)]/30">
        <span className="text-base font-bold text-[var(--primary)]">#{position}</span>
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[var(--primary)]/40 overflow-hidden bg-[var(--secondary)]">
        <img 
          src={leader.avatar} 
          alt={leader.username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-[var(--text)] truncate text-base">
          {leader.username}
        </h3>
        {stats && (
          <p className="text-sm text-[var(--text)] opacity-80">
            {stats.point} points
          </p>
        )}
      </div>

      {/* Accuracy */}
      {stats && stats.total_questions > 0 && (
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <Target className={`w-4 h-4 ${getAccuracyColor(accuracy)}`} />
              <span className={`text-sm font-semibold ${getAccuracyColor(accuracy)}`}>
                {accuracy.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-[var(--text)] opacity-70 mt-1">accuracy</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Add custom scrollbar styles
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--secondary);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
    opacity: 0.8;
  }
`

// Inject styles
const styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

export default Leaderboard