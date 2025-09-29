import React from 'react'
import supabase from '../config/supabase'
import { observe } from '../utils/observe'
import useHomeStore from '../context/store'
import Loader from './Loader'
import Question from '../utils/Question'
import { useState, useEffect, useRef } from 'react'
import SocialIcons from './SocialIcons'
import getQuestions from '../utils/getQuestions'
import fetchFilteredQuestions from '../utils/fetchFilteredQuestions'
import removePreviousQuestions from '../utils/removePreviousQuestions'
import fetchQuestions from '../utils/fetchQuestions'

const SelectedCategory = ({ selectedCategory }) => {
  const { userLikes, hintVisible, currentHint,
    user, setUser,
    setCurrentHint, setHintVisible,
    setUserLikes, questions = [], maxReached, setMaxReached } = useHomeStore()

  const targetRef = useRef(null);
  const scrollContain = useRef(null)

  //Stoping scrolling on hint container toggle
  useEffect(() => {
    // console.log(scrollContain)
    if (scrollContain.current === null) return
    if (hintVisible) {
      scrollContain.current.style.overflow = "hidden"
    } else {
      scrollContain.current.style.overflow = "auto"
    }
  }, [hintVisible])//dependency

  //checking user
  useEffect(() => {
    async function start() {
      async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.id) {
          setUser(user)
          console.log("user existed")
          removePreviousQuestions()
        } else {
          console.log("new user raixa")
          getQuestions()
        }
      }
      await checkUser()
    }
    start()
  }, [])

  // Intersection Observer
  useEffect(() => {
    if (maxReached) return
    const observer = observe()
    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };
  }, [questions, maxReached]);


  if (maxReached) {
    // alert("done")
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <Loader />
    )
  }
  return (
    <div className="h-full w-full relative">
  {Array.isArray(questions) &&
    questions.map((q, index) => (
      <div
        key={q.id || index} // Use unique ID if available
        className="question-container snap-start flex flex-col justify-center items-center"
        style={{
          height: '100vh',
          minHeight: '100vh'
        }}
      >
        {/* Question */}
        <div className="flex-1 flex items-center justify-center w-full">
          <Question q={q} />
        </div>

        {/* Socials icons */}
        <div className="pb-20"> {/* Add padding to account for bottom nav */}
          <SocialIcons
            q={q}
            userLikes={userLikes}
            hintVisible={hintVisible}
            currentHint={currentHint}
            setCurrentHint={setCurrentHint}
            setHintVisible={setHintVisible}
            setUserLikes={setUserLikes}
          />
        </div>

        {/* Intersection Observer trigger */}
        {index === questions.length - 2 && (
          <div 
            ref={targetRef}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 opacity-0"
          />
        )}
      </div>
    ))}
</div>

  )
}

export default SelectedCategory