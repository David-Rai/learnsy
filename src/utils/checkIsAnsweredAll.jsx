import useHomeStore from "../context/store";

const checkIsAnsweredAll = () => {
  const {
    answers,
    currentLesson,
    lessons = [],
    updateIsAnsweredAllQuestions
  } = useHomeStore.getState();

  const currentSelectedLesson = lessons.find(
    (l) => l.name === currentLesson.name
  );

  //Checking if all answers are answered
  if (
    currentSelectedLesson?.questions &&
    currentSelectedLesson?.maxReached === true
  ) {
    const totalQuestions = currentSelectedLesson.questions.map((q) => q.id);
    const totalAnsweredQuestions = answers
      .filter((a) => totalQuestions.includes(a.id))
      .map((a) => a.id);

      if(totalQuestions.length === totalAnsweredQuestions.length){
        updateIsAnsweredAllQuestions(currentLesson.name,true)
        console.log("All answers are answered")
      }
  }
};

export default checkIsAnsweredAll;
