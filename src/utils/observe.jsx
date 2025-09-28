import useHomeStore from "../context/store";
import fetchFilteredQuestions from "./fetchFilteredQuestions";
import fetchQuestions from "./fetchQuestions";

export const observe = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    const { user, setQuestions } = useHomeStore.getState(); // always latest
                    let nextQuestions = [];

                    if (user?.id) {
                        nextQuestions = await fetchFilteredQuestions() || [];
                    } else {
                        nextQuestions = await fetchQuestions() || [];
                    }

                    console.log("next",nextQuestions)
                    // Append to existing questions in the store
                    setQuestions(prev => [...prev, ...nextQuestions]);
                }
            });
        },
        { root: null, threshold: 0.5 }
    );

    return observer;
};


