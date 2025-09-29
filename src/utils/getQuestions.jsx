import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"
import filterAnsweredQuestions from "./FilterAnsweredQuestions"

export default async function getQuestions() {
    const { setQuestions, answers = [], questions = [] } = useHomeStore.getState()
    if (questions.length > 0) return
    const data = await fetchQuestions()
    if (answers.length === 0) return setQuestions(data)
    filterAnsweredQuestions(data)

}

