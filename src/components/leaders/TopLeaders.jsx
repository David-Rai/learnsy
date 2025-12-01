import React, { memo } from 'react'
import { useNavigate } from 'react-router'

const TopLeader = memo(({ l, rank }) => {
  const { username, avatar, points, total_questions, wrong_questions,user_id } = l
  const right_questions = total_questions - wrong_questions
  const navigate=useNavigate()
  const accuracy = total_questions === 0 ? 0 : ((right_questions / total_questions) * 100).toFixed(1)

  return (
    
    <section
      onClick={() => navigate(`/profile/${user_id}`)}
    className="flex flex-col items-center justify-center cursor-pointer bg-[var(--bg)] text-[var(--text)] p-6 rounded-2xl shadow-lg w-full max-w-sm mx-auto">
      <div className="relative flex flex-col items-center">
        <img
          src={avatar}
          alt={username}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[var(--primary)] shadow-lg object-cover"
        />
        <div className="absolute -bottom-3 text-white bg-[var(--primary)] font-bold text-lg px-4 py-1 rounded-full shadow-md">
          #{rank}
        </div>
      </div>

      <h2 className="mt-6 text-xl md:text-2xl font-semibold text-center">{username}</h2>

      <div className="flex justify-center gap-8 mt-4 font-mono">
        <div className="text-center">
          <p className="font-bold text-[var(--right)]">{accuracy}%</p>
          <p className="text-xs opacity-70">Accuracy</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-[var(--primary)]">{points}</p>
          <p className="text-xs opacity-70">Points</p>
        </div>
      </div>
    </section>
  )
})

export default TopLeader
