import supabase from "../config/supabase";
import useHomeStore from "../context/store";

const checkIsAnsweredAll = () => {
  const {
    answers,
    currentLesson,
    currentCategory,
    lessons = [],
  } = useHomeStore.getState();
  const currentSelectedLesson = lessons.find(
    (l) => l.name === currentLesson.name
  );

  if(currentSelectedLesson?.questions && currentSelectedLesson?.maxReached === true){
  console.log("checking if all answers are answered");
console.log(currentSelectedLesson)
console.log(answers)
  }

};

export default checkIsAnsweredAll;
