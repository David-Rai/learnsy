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
            <div
                className="home">

                {/* Main Content */}
                <main className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16">
                    {questions.map((q, index) => (
                        // Container
                        <div
                            key={index}
                            className="question-container" >

                            {/* Top Bar: Profile Left, Category + Type Right */}
                            <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
                                {/* Profile */}
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <span className="text-black font-bold text-sm">Q</span>
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm md:text-base drop-shadow-md">
                                        quizmaster_pro
                                    </p>
                                </div>
                            </div>

                            {/* Category and Type - Top Right */}
                            <div className="absolute top-4 right-4 flex flex-col items-end z-20 gap-1">
                                <span className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white/80 text-xs md:text-sm drop-shadow-sm">
                                    {q.category}
                                </span>
                            </div>

                            {/* Overlay */}
                            <div className="h-full w-full absolute inset-0 bg-black/20" />


                            {/* Question */}
                            <div className="flex flex-col items-center justify-center flex-1 relative z-10 max-w-lg w-full px-4">
                                <h2 className="question-text">
                                    {q.q}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    {q.options && q.options.length > 0 ? (
                                        q.options.map((opt, i) => (
                                            <button
                                                key={i} className='option-button'
                                            >
                                                {opt}
                                            </button>
                                        ))
                                    ) : (
                                        <>
                                            <button className="option-button " >
                                                Yes
                                            </button>
                                            <button className="option-button">
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
