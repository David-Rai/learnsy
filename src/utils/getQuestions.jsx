import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"
import filterAnsweredQuestions from "./filterAnsweredQuestions.jsx"

//Initial questions
export default async function getQuestions() {
    const {
        answers = [],
        selectedCategory,
        categories = [],
    } = useHomeStore.getState()

    //current selected category
    const currentCategory = categories.find(c => c.name === selectedCategory)
    if (currentCategory?.questions.length > 0) return
    await fetchQuestions()
}

