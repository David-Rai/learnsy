import React, { useState, useEffect, useRef } from 'react';
import SocialIcons from '../components/SocialIcons.jsx';
import supabase from '../config/supabase.js'
import BottomNav from '../components/BottomNav.jsx';


const Home = () => {
    const BATCH_SIZE = 5; // number of questions per batch
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const targetRef = useRef(null);
    const [maxReached, setMaxReached] = useState(false)

    //Initial
    useEffect(() => {
        async function get() {
            const data = await fetchQuestions()
            setQuestions(data)
        }
        get()
    }, [])

    //fetching more questions
    async function fetchQuestions() {
        if (maxReached) return

        console.log("fetching questions")
        const { data, error, count } = await supabase
            .from('questions')
            .select('*', { count: 'exact' })
            .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1);

        if (error) console.error(error);
        if (questions.length === count) {
            console.log("max reached")
            setMaxReached(true)
        } else {
            setMaxReached(false)
        }

        setPage(page + 1)
        return data; // array of questions
    }

    // Intersection Observer
    useEffect(() => {
        console.log("observer")
        if (maxReached) return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        const nextQuestions = await fetchQuestions();
                        setQuestions(prev => [...prev, ...nextQuestions]);
                    }
                });
            },
            { root: null, threshold: 0.5 }
        );

        if (targetRef.current) observer.observe(targetRef.current);

        return () => {
            if (targetRef.current) observer.unobserve(targetRef.current);
        };
    }, [page]);

    return (
        <>
            <div className="relative h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-hidden">
               
                {/* Main Content */}
                <main className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16">
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="relative snap-start h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700"
                        >
                            <div className="h-full w-full absolute inset-0 bg-black/20" />
                            {/* Question */}
                            <div className="flex flex-col items-center justify-center flex-1 relative z-10 max-w-lg w-full px-4">
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-white drop-shadow-lg leading-snug break-words overflow-hidden">
                                    {q.q}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    {q.options && q.options.length > 0 ? (
                                        q.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                className="bg-black/80 backdrop-blur-sm text-yellow-300 px-5 py-4 rounded-2xl shadow-lg hover:bg-black/90 transition-all font-medium text-sm sm:text-base break-words"
                                            >
                                                {opt}
                                            </button>
                                        ))
                                    ) : (
                                        <>
                                            <button className="bg-black/80 backdrop-blur-sm text-yellow-300 px-5 py-4 rounded-2xl shadow-lg hover:bg-black/90 transition-all font-medium text-sm sm:text-base mx-2">
                                                Yes
                                            </button>
                                            <button className="bg-black/80 backdrop-blur-sm text-yellow-300 px-5 py-4 rounded-2xl shadow-lg hover:bg-black/90 transition-all font-medium text-sm sm:text-base mx-2">
                                                No
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Socials icons */}
                            <SocialIcons />

                            {/* Observer */}
                            {index === questions.length - 1 && <div ref={targetRef}></div>}
                        </div>
                    ))}
                </main>

                {/* TikTok-style Bottom Navigation */}
                <BottomNav />

            </div>

        </>
    );
};

export default Home;
