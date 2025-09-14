import supabase from '../config/supabase'

//Getting the user accuracy
    export const getAccuracy = async (userId) => {
        try {
            // Fetch all answers of the user
            const { data, count, error } = await supabase
                .from("user_answer")
                .select("isRight", { count: "exact" })
                .eq("user_id", userId);

            if (error) {
                console.log("Error fetching answers:", error);
                return 0;
            }

            if (!data || count === 0) return 0;

            // Count how many are correct (true)
            const correctCount = data.filter((row) => row.isRight === true).length;

            // Calculate accuracy as percentage
            const accuracy = (correctCount / count) * 100;

            return accuracy;
        } catch (err) {
            console.log("Error calculating accuracy:", err);
            return 0;
        }
    };
