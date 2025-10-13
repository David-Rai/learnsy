import React, { memo } from 'react'
import { useNavigate } from 'react-router'

const MidLeader = memo(({ l, rank }) => {
  const navigate = useNavigate()

  const { username, avatar, points, total_questions, wrong_questions, user_id } = l
  const right_questions = total_questions - wrong_questions
  const accuracy = total_questions === 0 ? 0 : ((right_questions / total_questions) * 100).toFixed(1)

  return (
    <section onClick={() => navigate(`/profile/${user_id}`)} className="cursor-pointer flex items-center justify-between p-3 md:p-4 bg-[var(--secondary)] rounded-xl shadow hover:shadow-lg transition-all duration-200">
      <div className="flex-shrink-0 w-10 text-center font-bold text-lg md:text-xl text-text">{rank}</div>

      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <img
          src={avatar}
          alt={username}
          loading="lazy"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-[var(--primary)]/20"
        />
        <p className="truncate font-semibold text-text text-sm md:text-base">{username}</p>
      </div>

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
})

export default MidLeader
