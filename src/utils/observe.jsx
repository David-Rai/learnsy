import fetchFilteredQuestions from "./fetchFilteredQuestions";
import fetchQuestions from "./fetchQuestions";

export const observe=(user,setQuestions,maxReached,setMaxReached,BATCH_SIZE,questions)=>{
 const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(async entry => {
                if (entry.isIntersecting) {
                    if (user) {
                        const nextQuestions = await fetchFilteredQuestions(user.id, maxReached, setMaxReached, questions, BATCH_SIZE) || []
                        setQuestions(prev => [...prev, ...nextQuestions]);
                    } else {
                        const nextQuestions = await fetchQuestions(maxReached, setMaxReached, questions) || []
                        setQuestions(prev => [...prev, ...nextQuestions]);
                    }
                }
            });
        },
        { root: null, threshold: 0.5 }
    );

    return observer
}
