import React from 'react'
import { useState, useEffect } from 'react'
import { Crown, Medal, Trophy, Star, Users } from 'lucide-react'
import { getStats } from '../utils/getStats'
import supabase from '../config/supabase'
import BottomNav from './BottomNav'
import Loader from './Loader'

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getLeaders() {
      try {
        setLoading(true)

        // Get leaderboard data from Supabase
        const { data, error: boardError } = await supabase
          .from('board')
          .select("*")
          .order("point", { ascending: false })
        // .limit(10) // Uncomment to limit to top 10 for better performance

        if (boardError) {
          console.error('Error fetching board:', boardError)
          setLoading(false)
          return
        }

        console.log(data)
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
      <main className="home" style={{ 
        '--bg': 'oklch(12.9% 0.042 264.695)',
        '--text': '#FFFFFF',
        '--right': '#48FF00',
        '--wrong': '#FF385A',
        '--secondary': 'oklch(20.8% 0.042 265.755)',
        '--primary': 'oklch(58.5% 0.233 277.117)'
      }}>
        <div className="bg-[var(--bg)] flex flex-col items-center justify-center h-[calc(100%-80px)] text-[var(--text)] px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] rounded-full flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-[var(--text)] opacity-70" />
          </div>
          <p className="text-lg font-semibold mb-2">No players yet</p>
          <p className="text-sm opacity-70 text-center">Be the first to join the leaderboard!</p>
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="home" style={{ 
      '--bg': 'oklch(12.9% 0.042 264.695)',
      '--text': '#FFFFFF',
      '--right': '#48FF00',
      '--wrong': '#FF385A',
      '--secondary': 'oklch(20.8% 0.042 265.755)',
      '--primary': 'oklch(58.5% 0.233 277.117)'
    }}>
      <div className="bg-[var(--bg)] w-full h-[calc(100%-80px)] overflow-y-auto">
        {/* Header */}
        <div className="text-center py-6 px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-[var(--primary)]" />
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)]">Leaderboard</h1>
          </div>
          <p className="text-sm opacity-70 text-[var(--text)]">Top performers this season</p>
        </div>

        {/* Top Three Podium */}
        {leaders.length > 0 && (
          <section className="px-4 mb-8">
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
              {/* Mobile: Stack vertically, Desktop: Podium order */}
              <div className="flex flex-col md:flex-row items-end gap-4 md:gap-6 w-full md:w-auto">
                {/* 2nd Place (left on desktop, second on mobile) */}
                {leaders[1] && (
                  <div className="order-2 md:order-1">
                    <TopPlayer leader={leaders[1]} position={2} />
                  </div>
                )}
                
                {/* 1st Place (center on desktop, first on mobile) */}
                {leaders[0] && (
                  <div className="order-1 md:order-2">
                    <TopPlayer leader={leaders[0]} position={1} />
                  </div>
                )}
                
                {/* 3rd Place (right on desktop, third on mobile) */}
                {leaders[2] && (
                  <div className="order-3 md:order-3">
                    <TopPlayer leader={leaders[2]} position={3} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Rest of the players */}
        {leaders.length > 3 && (
          <section className="px-4 pb-6">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4 text-center">Other Players</h2>
            <div className="max-w-2xl mx-auto space-y-3">
              {leaders.slice(3).map((leader, index) => (
                <OtherPlayer key={leader.user_id} leader={leader} position={index + 4} />
              ))}
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

  const getPositionStyles = () => {
    switch (position) {
      case 1:
        return {
          podiumHeight: 'h-32 md:h-40',
          avatarSize: 'w-20 h-20 md:w-24 md:h-24',
          iconColor: 'text-yellow-400',
          icon: Crown,
          bgGradient: 'from-yellow-400/20 to-yellow-600/20'
        }
      case 2:
        return {
          podiumHeight: 'h-24 md:h-32',
          avatarSize: 'w-16 h-16 md:w-20 md:h-20',
          iconColor: 'text-gray-300',
          icon: Medal,
          bgGradient: 'from-gray-300/20 to-gray-500/20'
        }
      case 3:
        return {
          podiumHeight: 'h-20 md:h-28',
          avatarSize: 'w-14 h-14 md:w-18 md:h-18',
          iconColor: 'text-amber-600',
          icon: Medal,
          bgGradient: 'from-amber-600/20 to-amber-800/20'
        }
      default:
        return {
          podiumHeight: 'h-24',
          avatarSize: 'w-16 h-16',
          iconColor: 'text-[var(--primary)]',
          icon: Star,
          bgGradient: 'from-[var(--primary)]/20 to-[var(--secondary)]/20'
        }
    }
  }

  const styles = getPositionStyles()
  const IconComponent = styles.icon

  return (
    <div className="flex flex-col items-center relative">
      {/* Position indicator */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-[var(--secondary)] rounded-full p-2 border-2 border-[var(--primary)]">
          <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${styles.iconColor}`} />
        </div>
      </div>

      {/* Player card */}
      <div className={`bg-gradient-to-b ${styles.bgGradient} bg-[var(--secondary)] rounded-t-2xl ${styles.podiumHeight} w-24 md:w-32 flex flex-col items-center justify-start pt-6 relative overflow-hidden border border-[var(--primary)]/30`}>
        {/* Avatar */}
        <div className={`${styles.avatarSize} rounded-full border-3 border-[var(--primary)] overflow-hidden mb-2 bg-[var(--bg)]`}>
          <img 
            src={leader.avatar} 
            alt={leader.username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <h3 className="text-xs md:text-sm font-bold text-[var(--text)] text-center leading-tight px-1">
          {leader.username.split(' ')[0]}
        </h3>

        {/* Stats */}
        {stats && (
          <div className="text-center mt-1">
            <p className="text-xs text-[var(--primary)] font-semibold">
              {stats.point}pts
            </p>
          </div>
        )}
      </div>

      {/* Podium base */}
      <div className="w-24 md:w-32 h-6 bg-[var(--secondary)] rounded-b-lg border-t border-[var(--primary)]/30 flex items-center justify-center">
        <span className="text-lg md:text-xl font-bold text-[var(--text)]">#{position}</span>
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

  return (
    <div className="bg-[var(--secondary)] rounded-xl p-4 flex items-center gap-4 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-200 hover:shadow-lg">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-[var(--primary)]">#{position}</span>
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[var(--primary)]/30 overflow-hidden bg-[var(--bg)]">
        <img 
          src={leader.avatar} 
          alt={leader.username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-[var(--text)] truncate">
          {leader.username}
        </h3>
        {stats && (
          <p className="text-sm text-[var(--text)] opacity-70">
            Rank #{stats.rank}
          </p>
        )}
      </div>

      {/* Points */}
      {stats && (
        <div className="flex-shrink-0 text-right">
          <p className="font-bold text-[var(--primary)] text-lg">
            {stats.point}
          </p>
          <p className="text-xs text-[var(--text)] opacity-70">points</p>
        </div>
      )}
    </div>
  )
}

export default Leaderboard