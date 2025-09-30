import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"
import filterAnsweredQuestions from "./filterAnsweredQuestions.jsx"

export default async function getQuestions() {
    const {
        setQuestions,
        answers = [],
        questions = [],
        isCategorySelected,
        selectedCategory,
        categories=[],
        activeTab
    } = useHomeStore.getState()

    //Checking if categories exist
    if (isCategorySelected && activeTab === "explore") {
        const currentCategory = categories.find(c => c.name === selectedCategory)
        if (currentCategory?.questions.length > 0) return
       await fetchQuestions()
        return
    }

    //if no categories exist then
    if (questions.length > 0) return

    const data = await fetchQuestions()
    if (answers.length === 0) return setQuestions(data)//no answers
    filterAnsweredQuestions(data)//questions and answers are present
}

