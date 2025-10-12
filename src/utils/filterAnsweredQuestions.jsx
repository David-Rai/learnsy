// import useHomeStore from "../context/store"

// //filtering the already answered questions from the questions array
// const filterAnsweredQuestions = (data = []) => {
//     const {
//         answers = [],
//         updateLessonQuestionsCompletely,
//         lessons = [],
//         currentLesson
//     }
//         = useHomeStore.getState()

//     //Getting the selected category
//     const currentSelectedLesson = lessons.find(c => c.name === currentLesson.name);

//     if (!currentSelectedLesson?.questions || currentLesson?.questions?.length === 0) {
//         return console.log("zero questions to filter");
//     }

//     const answeredIds = new Set(answers.map(a => a.id));
//     let unanswered = data.length > 0 ? data.filter(q => !answeredIds.has(q.id))
//         : currentSelectedLesson?.questions.filter(q => !answeredIds.has(q.id))

//     updateLessonQuestionsCompletely(currentLesson.name, unanswered);
//     return
// }

// export default filterAnsweredQuestions