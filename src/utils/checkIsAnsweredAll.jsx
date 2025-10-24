import supabase from "../config/supabase"
import useHomeStore from "../context/store"

const checkIsAnsweredAll=()=>{
const {answers,currentLesson,currentCategory}=useHomeStore.getState()

console.log("checking if all answers are answered")
console.log(currentLesson)
console.log(answers)

}

export default checkIsAnsweredAll
