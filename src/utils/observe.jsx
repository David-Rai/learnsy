import fetchQuestions from "./fetchQuestions";

export const observe = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    fetchQuestions()
                }
            });
        },
        { root: null, threshold: 0.5 }
    );

    return observer;
};


