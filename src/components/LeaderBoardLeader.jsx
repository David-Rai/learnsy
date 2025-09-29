import React from 'react'
import { Trophy, Target } from 'lucide-react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

const LeaderboardLoader = () => {
  return (
    <main className="h-screen bg-bg text-text pb-20 md:flex md:pb-0">
      {/* Sidebar */}
      <Sidebar />

      {/* Main container */}
      <div className="h-[calc(100vh-80px)] md:h-full pb-6 overflow-x-hidden custom-scrollbar w-full">
        {/* Header Skeleton */}
        <header className="text-center py-6 px-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-[var(--secondary)] rounded-full shadow-lg animate-pulse">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[var(--primary)] opacity-50" />
            </div>
            <div className="h-8 md:h-10 w-48 bg-[var(--secondary)] rounded-lg animate-pulse"></div>
          </div>
          <div className="h-4 w-56 bg-[var(--secondary)] rounded mx-auto mb-3 animate-pulse"></div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Target className="w-4 h-4 opacity-50 animate-pulse" />
            <div className="h-4 w-20 bg-[var(--secondary)] rounded animate-pulse"></div>
          </div>
        </header>

        {/* Top Three Podium Skeleton */}
        <section className="px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: Row layout */}
            <div className="flex items-end justify-center gap-2 md:hidden">
              <TopPlayerSkeleton position={2} isMobile />
              <TopPlayerSkeleton position={1} isMobile />
              <TopPlayerSkeleton position={3} isMobile />
            </div>

            {/* Desktop: Podium layout */}
            <div className="hidden md:flex items-end justify-center gap-6">
              <TopPlayerSkeleton position={2} />
              <TopPlayerSkeleton position={1} />
              <TopPlayerSkeleton position={3} />
            </div>
          </div>
        </section>

        {/* Other Players Skeleton */}
        <section className="px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-6 w-32 bg-[var(--secondary)] rounded mb-4 animate-pulse"></div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
              {[4, 5, 6, 7, 8].map((position) => (
                <OtherPlayerSkeleton key={position} position={position} />
              ))}
            </div>
          </div>
        </section>
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
      avatar: { mobile: 'w-20 h-20', desktop: 'w-28 h-28' }
    },
    2: {
      height: { mobile: 'h-32', desktop: 'h-40' },
      width: { mobile: 'w-24', desktop: 'w-36' },
      avatar: { mobile: 'w-16 h-16', desktop: 'w-24 h-24' }
    },
    3: {
      height: { mobile: 'h-28', desktop: 'h-36' },
      width: { mobile: 'w-24', desktop: 'w-32' },
      avatar: { mobile: 'w-14 h-14', desktop: 'w-20 h-20' }
    }
  }
  return configs[position] || configs[1]
}

const TopPlayerSkeleton = ({ position, isMobile = false }) => {
  const config = getPositionConfig(position)

  return (
    <div className="flex flex-col items-center relative">
      {/* Position Badge Skeleton */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-[var(--secondary)] rounded-full p-2 shadow-lg animate-pulse">
          <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} bg-[var(--bg)] rounded-full opacity-50`}></div>
        </div>
      </div>

      {/* Avatar Skeleton */}
      <div className={`${isMobile ? config.avatar.mobile : config.avatar.desktop} rounded-full mb-3 shadow-xl ring-2 ring-[var(--primary)]/30 bg-[var(--secondary)] animate-pulse`}>
      </div>

      {/* Username Skeleton */}
      <div className={`${isMobile ? 'h-4 w-16' : 'h-5 w-20 md:w-24'} bg-[var(--secondary)] rounded mb-3 animate-pulse`}></div>

      {/* Points Skeleton */}
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <div className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} bg-[var(--secondary)] rounded-full animate-pulse opacity-50`}></div>
        <div className={`${isMobile ? 'h-6 w-16' : 'h-7 w-20 md:w-24'} bg-[var(--secondary)] rounded animate-pulse`}></div>
      </div>

      {/* Podium Card Skeleton */}
      <div className={`bg-[var(--secondary)] backdrop-blur-sm rounded-t-3xl ${isMobile ? config.height.mobile : config.height.desktop} ${isMobile ? config.width.mobile : config.width.desktop} flex items-center justify-center relative overflow-hidden shadow-lg animate-pulse`}>
        <span className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold text-text opacity-30`}>
          {position}
        </span>
      </div>
    </div>
  )
}

const OtherPlayerSkeleton = ({ position }) => {
  return (
    <div className="bg-[var(--secondary)] rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4 shadow-lg animate-pulse">
      {/* Rank Badge Skeleton */}
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[var(--bg)] rounded-full opacity-50"></div>

      {/* Avatar Skeleton */}
      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--bg)] opacity-50"></div>

      {/* User Info Skeleton */}
      <div className="flex-grow min-w-0 space-y-2">
        <div className="h-4 md:h-5 bg-[var(--bg)] rounded w-32 opacity-50"></div>
        <div className="h-3 md:h-4 bg-[var(--bg)] rounded w-20 opacity-30"></div>
      </div>
    </div>
  )
}

export default LeaderboardLoader