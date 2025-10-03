import supabase from "../config/supabase";
import useHomeStore from "../context/store";
import removePreviousQuestions from "./removePreviousQuestions";
import getQuestions from "./getQuestions";

// Accept setUser as a parameter
const checkUserForQuestions = async () => {


  //getting questions for initail
  getQuestions()

  // if (user?.id) {
  //   setUser(user)
  //   console.log("user existed")
  //   removePreviousQuestions()
  // } else {
  //   console.log("new user")
  //   getQuestions()
  // }
}


export default checkUserForQuestions