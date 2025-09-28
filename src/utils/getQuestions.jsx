import useHomeStore from "../context/store"
import fetchQuestions from "./fetchQuestions"

const {setQuestions,maxReached,setMaxReached}=useHomeStore.getState()
export default async function getQuestions() {
        const data = await fetchQuestions()
        setQuestions(data)
        console.log("started fetching data....",data)

    }

