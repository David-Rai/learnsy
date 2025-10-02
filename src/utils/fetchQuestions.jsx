import supabase from "../config/supabase";
import useHomeStore from "../context/store";

export default async function fetchQuestions() {
  const { BATCH_SIZE,
    answers = [],
    updateCategoryQuestions,
    selectedCategory,
    updateCategoryMaxReached,
    categories
  } = useHomeStore.getState()


  //fetching for selected category
  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .limit(BATCH_SIZE)

    //no home route then
  if (selectedCategory !== 'home') {
    query = query.eq('category', selectedCategory)
  }

  const currentCategory = categories.find(c => c.name === selectedCategory);

  if (currentCategory?.maxReached) return

  //already fetch and answered questions
  const questionsIds = currentCategory?.questions
  let totalquestions = [...questionsIds, ...answers]
  const fetchedIds = totalquestions.map(q => q.id);

  if (fetchedIds.length > 0) {
    const idsString = `(${fetchedIds.join(',')})`;
    query = query.not("id", "in", idsString)
  }

  //Quering into database
  const { data, error, count } = await query

  //error handling
  if (error) {
    console.log(error)
    return []
  }

  if (data.length < BATCH_SIZE) {
    console.log('max reached')
    updateCategoryMaxReached(selectedCategory, true);
  }

  //updating the category
  await updateCategoryQuestions(selectedCategory, data)
  return
}
