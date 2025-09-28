import useHomeStore from "../context/store";
import fetchFilteredQuestions from "./fetchFilteredQuestions";
import fetchQuestions from "./fetchQuestions";

export const observe = () => {
const {maxReached}=useHomeStore.getState()
// console

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    const { user, setQuestions,questions } = useHomeStore.getState(); // always latest
                    let nextQuestions = [];

                    if (user?.id) {
                        nextQuestions = await fetchFilteredQuestions() || [];
                    } else {
                        nextQuestions = await fetchQuestions() || [];
                    }

                    // console.log("next",nextQuestions)
                    const final=[...questions,...nextQuestions]
                    setQuestions(final);
                    // console.log("end questions",final)
                }
            });
        },
        { root: null, threshold: 0.5 }
    );

    return observer;
};


