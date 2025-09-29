import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"
import filterAnsweredQuestions from "./filterAnsweredQuestions.jsx"

export default async function getQuestions() {
    const { setQuestions, answers = [], questions = [], isCategorySelected, SelectedCategory, addQuestions } = useHomeStore.getState()

    if (isCategorySelected) {
        fetchQuestions()
        return
    }

    if (questions.length > 0) return

    const data = await fetchQuestions()
    if (answers.length === 0) return setQuestions(data)
    filterAnsweredQuestions(data)
}

