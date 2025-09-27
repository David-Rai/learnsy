import fetchQuestions from "./fetchQuestions"

export default async function getQuestions(setQuestions,maxReached,setMaxReached) {
        console.log("started fetching data....")
        const data = await fetchQuestions(maxReached,setMaxReached)
        setQuestions(data)
    }

