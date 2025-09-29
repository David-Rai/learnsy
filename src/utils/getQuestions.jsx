import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"

export default async function getQuestions() {

    const { setQuestions } = useHomeStore.getState()
    const data = await fetchQuestions()
    setQuestions(data)
}

