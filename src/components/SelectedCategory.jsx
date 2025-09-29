import React from 'react'
import supabase from '../config/supabase'
import { observe } from '../utils/observe'
import useHomeStore from '../context/store'
import Loader from './Loader'
import Question from '../utils/Question'
import { useState, useEffect, useRef } from 'react'
import SocialIcons from './SocialIcons'
import checkUserForQuestions from '../utils/checkUserForQuestions'

const SelectedCategory = () => {
  const {
    userLikes,
    hintVisible,
    currentHint,
    setCurrentHint,
    setHintVisible,
    setUserLikes,
    questions = [],
    maxReached,
    selectedCategory,
    setMaxReached,
    setCategory } 
    = useHomeStore()

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
    setCategory({ isCategory: true, value: selectedCategory })
    checkUserForQuestions()
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
    <>
      {Array.isArray(questions) &&
        questions.map((q, index) => (
          <div
            key={q.id || index} // Use unique ID if available
            className="question-container snap-start flex flex-col justify-center items-center h-full"
          >
            {/* Question */}
            <div className="flex-1 flex items-center justify-center w-full">
              <Question q={q} />
            </div>

            {/* Socials icons */}
            <SocialIcons
              q={q}
            />

            {/* Intersection Observer trigger */}
            {index === questions.length - 2 && (
              <div
                ref={targetRef}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 opacity-0"
              />
            )}
          </div>
        ))}
    </>

  )
}

export default SelectedCategory