import useHomeStore from '../context/store'
import fetchFilteredQuestions from './fetchFilteredQuestions'

//function
export default async function removePreviousQuestions() {
    const {
        user,
        answers = [],
        selectedCategory,
        categories = [],
    } = useHomeStore.getState()

    //current selected category
    const currentCategory = categories.find(c => c.name === selectedCategory)
    if (currentCategory?.questions.length > 0) return

    await fetchFilteredQuestions()
}