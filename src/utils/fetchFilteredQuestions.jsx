import supabase from "../config/supabase";
import useHomeStore from "../context/store";

export default async function fetchFilteredQuestions() {
    const { maxReached, setMaxReached, questions=[], BATCH_SIZE, user,answers=[] } = useHomeStore.getState()
    const { id } = user
    

    if (maxReached) return []
    //previous
    let totalquestions=[...questions,...answers]
    const fetchedIds = totalquestions.map(q => q.id); // get array of q_id

    const notQuestions = await supabase.from("user_answer").select().eq("user_id", id)
    const ids = notQuestions.data.map(q => q.q_id); // get array of q_id

    let totalIds=[...fetchedIds,...ids] || []

    const idsString2 = `(${totalIds.join(',')})`;

    let query=supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .not('id', 'in', idsString2)
    .limit(BATCH_SIZE)

    const { data, error, count } = await query

    if (error) console.error(error);

    if (questions.length === count || count === 0) {
        console.log("max reached")
        setMaxReached(true)
    } else {
        setMaxReached(false)
    }

    return data || [] // array of questions
}
