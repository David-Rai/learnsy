import React from 'react'
import { useNavigate } from 'react-router'
import BottomNav from './BottomNav'

const Intro = () => {
const navigate=useNavigate()

  return (
    <main className='home'>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h1 className="text-4xl font-bold mb-4 animate-bounce">QuizReels</h1>
        <p className="mb-8 text-lg text-center">Pick a category and start your MCQ journey!</p>
        <button
          className="bg-white text-indigo-600 px-6 py-3 rounded-full hover:scale-105 transition-transform"
          onClick={()=>navigate("/explore")}
        >
          Get Started
        </button>
      </div>

      <BottomNav />
    </main>
  )
}

export default Intro