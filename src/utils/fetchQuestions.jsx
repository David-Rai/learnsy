import supabase from "../config/supabase";
import useHomeStore from "../context/store";

const { BATCH_SIZE, maxReached, setMaxReached, questions = [] } = useHomeStore.getState()
export default async function fetchQuestions() {
  if (maxReached) return [];

  // Always safe because we default questions = []
  const fetchedIds = questions.map(q => q.id);

  if (fetchedIds.length > 0) {
    const idsString2 = `(${fetchedIds.join(",")})`;
    const { data, error, count } = await supabase
      .from("questions")
      .select("*", { count: "exact" })
      .not("id", "in", idsString2)
      .limit(BATCH_SIZE);

    if (questions.length === count) {
      console.log("max reached");
      setMaxReached(true);
    } else {
      setMaxReached(false);
    }

    if (data) return data;
  } else {
    const { data, error, count } = await supabase
      .from("questions")
      .select("*", { count: "exact" })
      .limit(BATCH_SIZE);

    if (questions.length === count) {
      console.log("max reached");
      setMaxReached(true);
    } else {
      setMaxReached(false);
    }

    if (data) return data;
  }

  return [];
}
