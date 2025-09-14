import supabase from "../config/supabase"

export const getTotalAttempts = async (id) => {
    try {
        const { count } = await supabase.from("user_answer")
            .select("*", { count: "exact", head: true })
            .eq("user_id", id)
        if (count) {
            return count
        }
        return 0
    } catch (err) {
        console.log(err)
        return 0
    }
}

