import supabase from "../config/supabase";

export
    const getStats = async (id) => {
        const { data, error } = await supabase
        .rpc("get_user_stats", { uid: id })
        .single()
        if (data) {
            return data
        }
    }
