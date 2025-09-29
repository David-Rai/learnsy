import supabase from "../config/supabase";
import filterAnsweredQuestions from "./FilterAnsweredQuestions";
import useHomeStore from "../context/store";

export default async function fetchQuestions() {
  const { BATCH_SIZE, maxReached, setMaxReached, questions = [], answers = [], isCategorySelected, activeTab, selectedCategory } = useHomeStore.getState()

  if (maxReached) return [];

  let totalquestions = [...questions, ...answers]
  // Always safe because we default questions = []
  const fetchedIds = totalquestions.map(q => q.id);

  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .limit(BATCH_SIZE)

  if (isCategorySelected && activeTab === "explore") {
    console.log('active tab', activeTab)
    console.log('category is selected buddy', selectedCategory)
    query = query.eq('category', selectedCategory)
  }

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
