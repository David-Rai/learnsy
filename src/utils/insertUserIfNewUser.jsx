import supabase from "../config/supabase";
import setUserBoard from "./setUserBoard";

const insertUserIfFirstLogin = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) return

    const user = session.user;

    // Only insert if not exists
    const { data: existingUser } = await supabase
        .from("board")
        .select("*")
        .eq("user_id", user.id)

    if (!existingUser || existingUser.length === 0) {
        setUserBoard(user.id, user.user_metadata.full_name)
        console.log("User saved to DB ✅");
    }
};

export default insertUserIfFirstLogin