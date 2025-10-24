import supabase from "../config/supabase";
import checkIsAnsweredAll from "./checkIsAnsweredAll";
import useHomeStore from "../context/store";

//Handling Answering
export const checkAnswer = async (q, opt) => {

    const { answers=[], setAnswers ,user} = useHomeStore.getState()

    if (answers.find(ans => ans.id === q.id)) return; // prevent re-clicking

    const isCorrect = q.a === opt;

    //popups
    // isCorrect ? toast.success("✅ Right answer") : toast.error("❌ Wrong answer");

    // save the answer
    setAnswers([...answers, { id: q.id, selectedOption: opt, isCorrect }]);

    //Checking if all answers are answered in this category lesson
    checkIsAnsweredAll()

    //Increase the points and insert into user answers
    if (user?.id) {
        const scoreDelta = isCorrect ? 5 : -5;

        await supabase.rpc("increment_points", {
            uid: user.id,
            delta: scoreDelta,
        });

        await supabase.from("user_answer").insert({
            user_id: user.id,
            q_id: q.id,
            answer: opt,
            isRight: isCorrect
        });
    }
};
