import supabase from "../config/supabase"

//Getting user points
export const getPoints = async (id) => {
    try {
        //for getting the points of users
        const { data, error } = await supabase.from("board")
            .select()
            .eq("user_id", id)
            .single()

        if (error) {
            console.log("Error fetching answers:", error);
            return 0;
        }

        if (data) {
            return data.point
        }
    } catch (err) {
        console.log(err)
        return 0
    }
}


