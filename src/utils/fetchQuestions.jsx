import supabase from "../config/supabase";
import useHomeStore from "../context/store";

export default async function fetchQuestions() {
  const { BATCH_SIZE,
    answers = [],
    currentCategory,
    currentLesson,
    lessons = [],
    updateLessonMaxReached,
    updateLessonQuestions
  } = useHomeStore.getState()

  const { setUser } = useHomeStore.getState()
  const { data: { user } } = await supabase.auth.getUser()
  const selectedLesson = lessons.find(l => l.name === currentLesson.name)
  let isUser = false//no useState cause this is not react components


  if (user?.id) {
    setUser(user)
    // console.log("user existed")
    isUser = true
  } else {
    // console.log("new user")
    isUser = false
  }

  //fetching for selected category
  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .limit(BATCH_SIZE)


  if (selectedLesson?.maxReached) return //if maxReached no fetch

  //already fetch and answered questions
  const questions = selectedLesson?.questions || []
  const questionsIds=questions.map(q => q.id)
  const answerIds=answers.map(a => a.id) || []
  let totalquestions = [...questionsIds, ...answerIds]

  //if user dont fetch previous answered questions
  if (isUser) {
    const previousQuestions = await supabase.from("user_answer").select('*').eq("user_id", user.id)
    const previousIds = previousQuestions.data.map(q => q.q_id); // get array of q_id
    totalquestions = [...totalquestions, ...previousIds]
  }


  //filter for already fetch questions
  if (totalquestions?.length > 0) {
    // console.log(totalquestions)
    const idsString = `(${totalquestions.join(',')})`;
    // console.log(idsString)
    query = query.not("id", "in", idsString)
  }

  //filter for selected lesson of category
  query = query
    .eq('category', currentCategory?.name)
    .eq('lesson', currentLesson?.name)

  //******Quering into database********
  const { data, error, count } = await query

  //error handling
  if (error) {
    console.log(error)
    return []
  }

  if (data.length < BATCH_SIZE) {
    // console.log('max reached')
    updateLessonMaxReached(selectedLesson?.name, true);
  }

  //updating lesson questions list
  updateLessonQuestions(selectedLesson?.name, data)
  // console.log("questions pushed successfully", useHomeStore.getState().lessons)

}
