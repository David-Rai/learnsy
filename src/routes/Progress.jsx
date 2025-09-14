import { useNavigate } from 'react-router'
import supabase from '../config/supabase'
import { getStats } from '../utils/getStats'
import { checkUser } from '../utils/checkUser'
import { useUser } from '../context/userContext'
import React from 'react'
import BottomNav from '../components/BottomNav'
import { useState, useEffect } from 'react'

const Progress = () => {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const [stats,setStats]=useState(null)

  //getting my datas
  useEffect(() => {
   checkUser(setUser).then(async a => {
      if (a.exist) {
        const id = a.user.id
        const s=await getStats(id)
        setStats(s)

      } else {
        navigate('/signup')
      }
    })
  }, [])

  return (
    <main className='home'>
      {/* my progress in cricle stats */}
      <section>
              <p>Points: {stats?.point}</p>
              <p>Total: {stats?.total}</p>
              <p>Correct: {stats?.correct}</p>
              <p>Wrong: {stats?.wrong}</p>
              <p>Accuracy: {stats?.accuracy.toFixed(2)}%</p>
              <p>Rank: {stats?.rank}</p>
      </section>

      {/* here goes the leaderboard */}
      <section>

      </section>
      {/* Bottom navigation */}
      <BottomNav />
    </main>
  )
}

export default Progress