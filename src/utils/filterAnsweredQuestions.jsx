import useHomeStore from "../context/store"

//filtering the already answered questions from the questions array
const filterAnsweredQuestions = (data) => {
    const { questions, answers, setQuestions } = useHomeStore.getState()

    if (answers.length === 0) return console.log("nothing to filter")

    //filtering the questions
    const answeredIds = answers.map(a => a.id)
    const unanswered = data.filter(q => !answeredIds.includes(q.id))

    if (unanswered.length > 0) {
    setQuestions(unanswered)
    console.log("already", answeredIds)
    console.log("unanswered",unanswered)
    }
}

export default filterAnsweredQuestions