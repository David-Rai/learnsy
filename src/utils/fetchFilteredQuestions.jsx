import supabase from "../config/supabase";
import useHomeStore from "../context/store";

export default async function fetchFilteredQuestions() {
    const { selectedCategory,
        BATCH_SIZE
        , user,
        answers = [],
        categories = [],
        updateCategoryMaxReached,
        updateCategoryQuestions
    } = useHomeStore.getState()
    const { id } = user

    //previous
    const currentCategory = categories.find(c => c.name === selectedCategory)

    let totalquestions = [...currentCategory?.questions, ...answers]
    const fetchedIds = totalquestions.map(q => q.id); // get array of q_id

    const notQuestions = await supabase.from("user_answer").select('*').eq("user_id", id)
    const previousIds = notQuestions.data.map(q => q.q_id); // get array of q_id

    let totalIds = [...fetchedIds, ...previousIds] || []

    const idsString = `(${totalIds.join(',')})`;

    let query = supabase
        .from('questions')
        .select('*')
        .not('id', 'in', idsString)
        .limit(BATCH_SIZE)

    if (selectedCategory !== 'home') {
        query = query.eq('category', selectedCategory)
    }

    const { data, error } = await query

    if (error) console.error(error);


    if (data.length < BATCH_SIZE) {
        console.log('max reached')
        updateCategoryMaxReached(selectedCategory, true);
    }

    //updating the category
    await updateCategoryQuestions(selectedCategory, data)
    return
}
