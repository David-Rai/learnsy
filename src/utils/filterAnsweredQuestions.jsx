import useHomeStore from "../context/store"

//filtering the already answered questions from the questions array
const filterAnsweredQuestions = (data = []) => {
    const {
        answers = [],
        updateCategoryQuestionsCompletely,
        categories,
        selectedCategory,
    }
        = useHomeStore.getState()

    //Getting the selected category
    const currentCategory = categories.find(c => c.name === selectedCategory);

    if (!currentCategory?.questions || currentCategory.questions.length === 0) {
        return console.log("zero questions to filter");
    }

    const answeredIds = new Set(answers.map(a => a.id));
    let unanswered = data.length > 0 ? data.filter(q => !answeredIds.has(q.id))
        : currentCategory?.questions.filter(q => !answeredIds.has(q.id))

    updateCategoryQuestionsCompletely(selectedCategory, unanswered);
    return
}

export default filterAnsweredQuestions