import useHomeStore from "../context/store";
import fetchFilteredQuestions from "./fetchFilteredQuestions";
import fetchQuestions from "./fetchQuestions";

export const observe = () => {

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    const { user } = useHomeStore.getState(); // always latest

                    if (user?.id) {
                        await fetchFilteredQuestions() 
                    } else {
                         await fetchQuestions()
                    }
                }
            });
        },
        { root: null, threshold: 0.5 }
    );

    return observer;
};


