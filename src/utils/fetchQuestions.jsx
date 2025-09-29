import supabase from "../config/supabase";
import useHomeStore from "../context/store";

export default async function fetchQuestions() {
  const { BATCH_SIZE,
    maxReached,
    setMaxReached,
    questions = [],
    answers = [],
    addNewCategory,
    updateCategoryQuestions,
    isCategorySelected,
    activeTab,
    selectedCategory,
    updateCategoryMaxReached,
    categories
  } = useHomeStore.getState()

  //when category is selected
  if (isCategorySelected && activeTab === "explore") {

    let query = supabase
      .from("questions")
      .select("*", { count: "exact" })
      .limit(BATCH_SIZE)
      .eq('category', selectedCategory)

    const currentCategory = categories.find(c => c.name === selectedCategory);
    const fetchedIds = currentCategory?.questions?.map(q => q.id) || [];

    if (currentCategory?.maxReached) return []

    if (fetchedIds.length > 0) {
      const idsString = `(${fetchedIds.join(',')})`;
      query = query.not("id", "in", idsString)
    }


    const { data, error, count } = await query
    if (error) {
      console.log(error)
      return []
    }

    console.log("fetched data",data)

    if (currentCategory?.questions.length === count || count === 0) {
      console.log("max reached");
      updateCategoryMaxReached(selectedCategory, true);
    } else {
      updateCategoryMaxReached(selectedCategory, false);
    }


    await updateCategoryQuestions(selectedCategory, data)
    return
  }

  if (maxReached) return [];


  let totalquestions = [...questions, ...answers]
  // Always safe because we default questions = []
  const fetchedIds = totalquestions.map(q => q.id);

  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .limit(BATCH_SIZE)

  if (fetchedIds.length > 0) {
    const idsString2 = `(${fetchedIds.join(',')})`;
    query = query.not("id", "in", idsString2)
  }


  const { data, error, count } = await query

  if (questions.length === count || count === 0) {
    console.log("max reached");
    setMaxReached(true);
  } else {
    setMaxReached(false);
  }

  if (data) return data;

  return [];
}
