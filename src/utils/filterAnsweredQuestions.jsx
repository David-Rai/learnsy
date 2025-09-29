import useHomeStore from "../context/store"

//filtering the already answered questions from the questions array
const filterAnsweredQuestions = (data = []) => {
    const { questions = [], answers=[], setQuestions,
        updateCategoryQuestionsCompletely,
        categories, isCategorySelected,
        selectedCategory, activeTab 
    }
        = useHomeStore.getState()

    const currentCategory = categories.find(c => c.name === selectedCategory);

    if (isCategorySelected && activeTab === "explore") {
        if (currentCategory?.questions.length === 0) return console.log("zero questions to filter")
        const answeredIds = new Set(answers.map(a => a.id));
    
        let unanswered = data.length > 0 ? data.filter(q => !answeredIds.has(q.id)) 
        :  currentCategory?.questions.filter(q => !answeredIds.has(q.id))

        // console.log("ansswerd ids",answeredIds)
        // console.log("unanswers",unanswered)

        if (unanswered.length > 0) {
            updateCategoryQuestionsCompletely(selectedCategory, unanswered)
        }

        return
    }

    if (questions.length === 0) return setQuestions(data)


    //filtering the questions
    const answeredIds = new Set(answers.map(a => a.id));
    let unanswered = data.length > 0 ? data.filter(q => !answeredIds.has(q.id)) :
        questions.filter(q => !answeredIds.has(q.id))

    if (unanswered.length > 0) {
        setQuestions(unanswered)
    }
}

export default filterAnsweredQuestions