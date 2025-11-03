import React, { memo } from 'react'
import { useNavigate } from 'react-router'

const MidLeader = memo(({ l, rank }) => {
  const navigate = useNavigate()
  const { username, points, total_questions, wrong_questions, user_id } = l
  const right_questions = total_questions - wrong_questions
  const accuracy = total_questions === 0 ? 0 : ((right_questions / total_questions) * 100).toFixed(1)

  return (
    <section
      onClick={() => navigate(`/profile/${user_id}`)}
      className="cursor-pointer flex items-center justify-between p-3 sm:p-4 bg-[var(--secondary)] rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
    >
      <span className="w-8 sm:w-10 text-center font-bold text-base sm:text-lg text-[var(--text)]">{rank}</span>

      <p className="flex-1 truncate font-semibold text-[var(--text)] text-sm sm:text-base">{username}</p>

      <div className="flex gap-3 sm:gap-5 font-mono text-xs sm:text-sm">
        <div className="text-center">
          <p className="font-bold text-[var(--right)]">{accuracy}%</p>
          <p className="opacity-70">Acc</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-[var(--primary)]">{points}</p>
          <p className="opacity-70">Pts</p>
        </div>
      </div>
    </section>
  )
})

export default MidLeader
