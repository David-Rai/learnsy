import useHomeStore from '../context/store'
import fetchFilteredQuestions from './fetchFilteredQuestions'

//function
export default async function removePreviousQuestions() {
    const { user, setQuestions, maxReached, setMaxReached, questions = [], BATCH_SIZE } = useHomeStore.getState()
    const { id } = user

    console.log("started filtered fetching data....")
    const data = await fetchFilteredQuestions()
    setQuestions(data)
}