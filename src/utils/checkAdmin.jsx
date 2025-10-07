import supabase from "../config/supabase"
import { useAdminStore } from "../context/store"
import { checkUser } from "./checkUser"

//checking vaidation of admin
const checkAdmin = async () => {
    const { setIsAdmin, isAdmin } = useAdminStore.getState()

    //checking user validation
    const { exist, user } = await checkUser()
    if (!exist) return false

    //checking if admin or not
    const { data, error } = await supabase.from("board")
        .select()
        .eq("user_id", user.id)
        .single()

    if (error) {
        console.log(error)
        setIsAdmin(false)
        return false
    }

    //checking role
    if (data.role === "admin") {
        setIsAdmin(true)//settting this user is admin
        return true
    }
    setIsAdmin(false)
    return false
}

export default checkAdmin