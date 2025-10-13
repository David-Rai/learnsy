import supabase from "../../config/supabase";
import { useMemberStore } from "../../context/store";

//Getting questions count
const getQuestionsCount = async () => {
    const setQuestionCount = useMemberStore.getState().setQuestionCount
    const { count } = await supabase.from("questions").select("*", { count: 'exact' });
    if (!count) return;
    setQuestionCount(count);
};

export default getQuestionsCount