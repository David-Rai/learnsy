import supabase from "../config/supabase"
import { useMemberStore } from "../context/store"
import { checkUser } from "./checkUser"

//checking vaidation of admin
const checkMember = async () => {
    const { setIsMember, setIsMemberChecked } = useMemberStore.getState()

    setIsMemberChecked(true)

    //checking user validation
    const { exist, user } = await checkUser()
    if (!exist) return false

    //Getting user role
    const { data, error } = await supabase.from("board")
        .select()
        .eq("user_id", user.id)
        .single()

    if (error) {
        console.log(error)
        setIsMember(false)
        return false
    }

    //checking role
    if (data.role === "member") {
        setIsMember(true)//settting this user is  member
        return true
    }
    setIsMember(false)
    return false
}

export default checkMember