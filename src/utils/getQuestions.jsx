import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"

//Initial questions
export default async function getQuestions() {
    const {
        lessons = [],
        currentLesson
    } = useHomeStore.getState()

    const selectedLesson = lessons.find(l => l.name === currentLesson.name)

    if (selectedLesson?.questions.length > 0) return console.log("no intial fetch questions")

    //fetching questions
    fetchQuestions()
}

