import supabase from "../config/supabase";
import useHomeStore from "../context/store";

export default async function fetchQuestions() {
  const { BATCH_SIZE, maxReached, setMaxReached, questions = [], category } = useHomeStore.getState()

  if (maxReached) return [];

  // Always safe because we default questions = []
  const fetchedIds = questions.map(q => q.id);
  // console.log(category)

  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .limit(BATCH_SIZE)

  if (fetchedIds.length > 0) {
    const idsString2 = `(${fetchedIds.join(',')})`;
    query = query.not("id", "in", idsString2)
  }

  if (category.isCategory) {
    console.log("yes apppying filter of",category.value)
    query=query.eq("category",category.value)
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
