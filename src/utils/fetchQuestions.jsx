import { useState } from "react";
import supabase from "../config/supabase";
import useHomeStore from "../context/store";

export default async function fetchQuestions() {
  const { BATCH_SIZE,
    answers = [],
    categories,
    currentCategory,
    currentLesson,
    lessons = [],
    setLesson,
    updateLessonMaxReached,
    updateLessonQuestions
  } = useHomeStore.getState()

  const { setUser } = useHomeStore.getState()
  const { data: { user } } = await supabase.auth.getUser()
  const selectedLesson = lessons.find(l => l.name === currentLesson.name)
  let isUser=false//no useState cause this is not react components


  if (user?.id) {
    setUser(user)
    console.log("user existed")
    isUser=true
  } else {
    console.log("new user")
    isUser=false
  }

  //fetching for selected category
  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .limit(BATCH_SIZE)


  if (selectedLesson?.maxReached) return//if maxReached no fetch

  //already fetch and answered questions
  const questionsIds = selectedLesson?.questions
  let totalquestions = [...questionsIds, ...answers]

  //if user dont fetch previous answered questions
  if (isUser) {
    const previousQuestions = await supabase.from("user_answer").select('*').eq("user_id", id)
    const previousIds = previousQuestions.data.map(q => q.q_id); // get array of q_id
    totalquestions = [...totalquestions, ...previousIds]
  }

  const fetchedIds = totalquestions.map(q => q.id);

  //filter for already fetch questions
  if (fetchedIds.length > 0) {
    const idsString = `(${fetchedIds.join(',')})`;
    query = query.not("id", "in", idsString)
  }

  //filter for selected lesson of category
  query = query
    .eq('category', currentCategory.name)
    .eq('lesson', currentLesson.name)

  //******Quering into database********
  const { data, error, count } = await query

  //error handling
  if (error) {
    console.log(error)
    return []
  }

  if (data.length < BATCH_SIZE) {
    console.log('max reached')
    updateLessonMaxReached(selectedLesson.name, true);
  }

  //updating lesson questions list
  updateLessonQuestions(selectedLesson.name, data)
  console.log("questions pushed successfully", useHomeStore.getState().lessons)

}
