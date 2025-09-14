import supabase from "../config/supabase";

// Get number of correct answers
export const getRight = async (id) => {
  try {
    const { count, error } = await supabase
      .from("user_answer")
      .select("*", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("isRight", true);

    if (error) {
      console.log("Error fetching right answers:", error.message);
      return 0;
    }

    return count ?? 0; // return 0 if count is null/undefined
  } catch (err) {
    console.log("Unexpected error:", err);
    return 0;
  }
};
