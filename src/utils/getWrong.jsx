import supabase from "../config/supabase";

// Get number of wrong answers
export const getWrong = async (id) => {
    try {
      const { count, error } = await supabase
        .from("user_answer")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id)
        .eq("isRight", false);
  
      if (error) {
        console.log("Error fetching wrong answers:", error.message);
        return 0;
      }
  
      return count ?? 0; // return 0 if count is null/undefined
    } catch (err) {
      console.log("Unexpected error:", err);
      return 0;
    }
  };
  