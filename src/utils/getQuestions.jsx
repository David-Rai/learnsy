import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"
import filterAnsweredQuestions from "./filterAnsweredQuestions.jsx"

export default async function getQuestions() {
    const { setQuestions, answers = [], questions = [], isCategorySelected,
        selectedCategory, categories, addQuestions, activeTab } = useHomeStore.getState()

    if (isCategorySelected && activeTab === "explore") {
        const currentCategory = categories.find(c => c.name === selectedCategory)
        if (currentCategory?.questions.length > 0) return
        fetchQuestions()
        return
    }

    if (questions.length > 0) return

    const data = await fetchQuestions()
    if (answers.length === 0) return setQuestions(data)
    filterAnsweredQuestions(data)
}

