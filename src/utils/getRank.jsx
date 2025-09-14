import supabase from '../config/supabase'

//Getting user rank
export const getRank = async (id) => {
    const { data: userData, error: userError } = await supabase
        .from("board")
        .select("point")
        .eq("user_id", id)
        .single();

    if (userError || !userData) return null;

    const userPoints = userData.point;

    const { count: higherCount, error: countError } = await supabase
        .from("board")
        .select("*", { count: "exact", head: true })
        .gt("point", userPoints);

    if (countError) return null;

    const rank = (higherCount ?? 0) + 1;
    return rank
};