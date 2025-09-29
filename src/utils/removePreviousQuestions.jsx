import useHomeStore from '../context/store'
import fetchFilteredQuestions from './fetchFilteredQuestions'

//function
export default async function removePreviousQuestions() {
    const { user, setQuestions, answers = [], questions = [] } = useHomeStore.getState()
    const { id } = user

    if (questions.length > 0) return

    console.log("started filtered fetching data....")
    const data = await fetchFilteredQuestions()

    if (answers.length === 0) return setQuestions(data)
    filterAnsweredQuestions(data)
}