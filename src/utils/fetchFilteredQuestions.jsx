import supabase from "../config/supabase";

export default async function fetchFilteredQuestions(id,maxReached,setMaxReached,questions,BATCH_SIZE) {
        if (maxReached) return

        const notQuestions = await supabase.from("user_answer").select().eq("user_id", id)
        const ids = notQuestions.data.map(q => q.q_id); // get array of q_id
        const idsString = `(${ids.join(',')})`;

        const fetchedIds = questions.map(q => q.id); // get array of q_id
        const idsString2 = `(${fetchedIds.join(',')})`;

        const { data, error, count } = await supabase
            .from('questions')
            .select('*', { count: 'exact' })
            .not('id', 'in', idsString)
            .not('id', 'in', idsString2)
            .limit(BATCH_SIZE)
        // .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1)


        if (error) console.error(error);

        if (questions.length === count) {
            console.log("max reached")
            setMaxReached(true)
        } else {
            setMaxReached(false)
        }

        // setPage(prevPage => prevPage + 1);
        return data || [] // array of questions
    }
