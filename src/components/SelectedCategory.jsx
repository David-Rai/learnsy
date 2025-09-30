import React from 'react'
import { observe } from '../utils/observe'
import useHomeStore from '../context/store'
import Loader from './Loader'
import Question from '../utils/Question'
import { useState, useEffect, useRef } from 'react'
import SocialIcons from './SocialIcons'
import checkUserForQuestions from '../utils/checkUserForQuestions'
import filterAnsweredQuestions from '../utils/filterAnsweredQuestions'
import CompletedAll from './CompletedAll'

const SelectedCategory = () => {
  const {
    answers = [],
    hintVisible,
    categories,
    setSelectedCategory,
    explorePageCategory
  }
    = useHomeStore()

  const targetRef = useRef(null);
  const scrollContain = useRef(null)
  const currentCategory = categories.find(c => c.name === explorePageCategory.value);
  const currentQuestions = currentCategory?.questions || [];

  useEffect(() => {
    //setting the categories
    setSelectedCategory(explorePageCategory.value)

    //checking if answered
    if (answers.length > 0) {
      filterAnsweredQuestions(currentQuestions)
    }

    //fetching the questions
    checkUserForQuestions()
  }, [])



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

  // Intersection Observer
  useEffect(() => {
    if (currentCategory.maxReached) return
    const observer = observe()
    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };

  }, [currentQuestions, currentCategory.maxReached]);

  // Loading state
  if (currentQuestions.length === 0) {
    if (currentCategory?.maxReached) {
      return (
        <CompletedAll />
      )
    }
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {Array.isArray(currentQuestions) &&
        currentQuestions.map((q, index) => (
          <div
            key={index} // Use unique ID if available
            className="question-container snap-start flex flex-col justify-center items-center h-full"
          >
            {/* Question */}
            <div className="flex-1 flex items-center justify-center w-full">
              <Question q={q} />
            </div>

            {/* Socials icons */}
            <SocialIcons q={q} />

            {/* Intersection Observer trigger */}
            {index === currentCategory?.questions.length - 2 && (
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