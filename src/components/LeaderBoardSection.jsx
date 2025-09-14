
// Leaderboard Component
const LeaderboardSection = () => {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getLeaders() {
      try {
        setLoading(true)
        
        // Get leaderboard data
        const { data: boardData, error: boardError } = await supabase
          .from('board')
          .select("*")
          .order("point", { ascending: false })
          .limit(10) // Limit to top 10 for better performance

        if (boardError) {
          console.error('Error fetching board:', boardError)
          return
        }

        // Process each leader to get their stats and user info
        const leadersWithStats = await Promise.all(
          boardData.map(async (leader, index) => {
            try {
              // Get user stats
              const stats = await getStats(leader.user_id)
              
              // Get user profile info
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('user_meta')
                .eq('id', leader.user_id)
                .single()

              // Log what we found for debugging
              if (!userData) {
                console.log(`No user data found for user_id: ${leader.user_id}`)
              } else {
                console.log(`Found user data:`, userData)
              }

              return {
                ...leader,
                stats: stats || {},
                username: userData?.user_meta?.username || 'Anonymous',
                avatar: userData?.user_meta?.avatar || null,
                position: index + 1
              }
            } catch (error) {
              console.error('Error processing leader:', error)
              return {
                ...leader,
                stats: {},
                username: 'Anonymous',
                avatar: null,
                position: index + 1
              }
            }
          })
        )

        setLeaders(leadersWithStats)
      } catch (error) {
        console.error('Error in getLeaders:', error)
      } finally {
        setLoading(false)
      }
    }

    getLeaders()
  }, [])

  const getRankBadgeColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900'
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100'
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
    }
  }

  const getRankIcon = (position) => {
    if (position <= 3) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading leaderboard...</p>
      </div>
    )
  }

  if (leaders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No players yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Be the first to join the leaderboard!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leaders.map((leader) => (
        <div
          key={leader.id}
          className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200"
        >
          {/* Left side - Rank, Avatar, User info */}
          <div className="flex items-center space-x-4">
            {/* Rank badge */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankBadgeColor(leader.position)}`}>
              {getRankIcon(leader.position) || leader.position}
            </div>
            
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              {leader.avatar ? (
                <img
                  src={leader.avatar}
                  alt={leader.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {leader.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* User info */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {leader.username}
                </h3>
                {leader.isCurrentUser && (
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full font-medium">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  {leader.stats.accuracy || 0}%
                </span>
                <span>{leader.stats.total || 0} games</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  ✓ {leader.stats.correct || 0}
                </span>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  ✗ {leader.stats.wrong || 0}
                </span>
              </div>
            </div>
            
            {/* Points */}
            <div className="text-right">
              <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {leader.point || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                pts
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Footer stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Showing top {leaders.length} players</span>
          <span>
            Top score: {leaders[0]?.point || 0} points
          </span>
        </div>
      </div>
    </div>
  )
}
