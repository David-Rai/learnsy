import supabase from "../../config/supabase";
import useHomeStore, { useMemberStore } from "../../context/store";

//Getting your uploaded questions
const getYourUploads = async () => {
    const { user } = useHomeStore.getState();
    const setUploads = useMemberStore.getState().setUploads
    const memberId = user.id;
    const { data, error } = await supabase.from('questions').select('*').eq('uploaded_by', memberId);
    if (error) return;
    if (data) setUploads(data);
};

export default getYourUploads