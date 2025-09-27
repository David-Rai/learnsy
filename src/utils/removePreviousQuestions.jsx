import fetchFilteredQuestions from './fetchFilteredQuestions'

export default async function removePreviousQuestions(id,setQuestions,maxReached,setMaxReached,questions,BATCH_SIZE) {
    console.log("started filtered fetching data....")
    const data = await fetchFilteredQuestions(id,maxReached,setMaxReached,questions,BATCH_SIZE)
    setQuestions(data)
}