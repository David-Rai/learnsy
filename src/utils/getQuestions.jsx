import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"
import filterAnsweredQuestions from "./FilterAnsweredQuestions"

export default async function getQuestions() {
    const { setQuestions , answers } = useHomeStore.getState()
    const data = await fetchQuestions()
    if (answers.length === 0) return setQuestions(data)
    filterAnsweredQuestions(data)

}

