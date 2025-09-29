import useHomeStore from "../context/store";
import fetchFilteredQuestions from "./fetchFilteredQuestions";
import fetchQuestions from "./fetchQuestions";

export const observe = () => {
    const { categories, isCategorySelected, activeTab, selectedCategory } = useHomeStore.getState()
    const currentCategory = categories.find(c => c.name === selectedCategory);

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    const { user, setQuestions, questions } = useHomeStore.getState(); // always latest
                    let nextQuestions = [];

                    if (user?.id) {
                        nextQuestions = await fetchFilteredQuestions() || [];
                    } else {
                        nextQuestions = await fetchQuestions() || [];
                    }

                    if (!isCategorySelected && activeTab === "home") {
                        const final = [...questions, ...nextQuestions]
                        setQuestions(final);

                    }
                }
            });
        },
        { root: null, threshold: 0.5 }
    );

    return observer;
};


