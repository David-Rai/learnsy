import { useUser } from "../context/userContext"
import supabase from "../config/supabase"

export async function checkUser() {
    const { user, setUser } = useUser()
    const { data } = await supabase.auth.getUser()
    if (data.user) {
        // setUser(data.user)
        console.log(data.user)
        console.log("user existed")
        return true
    } else {
        console.log("user doesnot exist")
        return false
    }
}