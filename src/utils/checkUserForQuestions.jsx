import supabase from "../config/supabase";
import useHomeStore from "../context/store";
import removePreviousQuestions from "./removePreviousQuestions";
import getQuestions from "./getQuestions";

// Accept setUser as a parameter
const checkUserForQuestions = async () => {
  const { setUser  } = useHomeStore.getState()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (user?.id) {
    setUser(user)
    console.log("user existed")
    removePreviousQuestions()
  } else {
    console.log("new user")
    getQuestions()
  }
}


export default checkUserForQuestions