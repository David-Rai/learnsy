import useHomeStore from "../context/store"

//filtering the already answered questions from the questions array
const filterAnsweredQuestions = (data = []) => {
    const { questions = [], answers, setQuestions } = useHomeStore.getState()

    if (questions.length === 0) return 


    //filtering the questions
    const answeredIds = new Set(answers.map(a => a.id));
    let unanswered = data.length > 0 ? data.filter(q => !answeredIds.has(q.id)) :
        questions.filter(q => !answeredIds.has(q.id))

    if (unanswered.length > 0) {
        setQuestions(unanswered)
        // console.log("already", answeredIds)
        // console.log("unanswered", unanswered)
    }
}

export default filterAnsweredQuestions