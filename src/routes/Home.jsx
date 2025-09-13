import React, { useState, useEffect, useRef } from 'react';
import SocialIcons from '../components/SocialIcons.jsx';
import { ToastContainer } from 'react-toastify';
import HomeTop from '../components/HomeTop.jsx';
import supabase from '../config/supabase.js'
import { useUser } from '../context/userContext.jsx';
import BottomNav from '../components/BottomNav.jsx';


const Home = () => {
    const { use, setUser } = useUser()
    const BATCH_SIZE = 5; // number of questions per batch
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const targetRef = useRef(null);
    const [maxReached, setMaxReached] = useState(false)

    //Initial
    useEffect(() => {
        async function get() {
            console.log("started fetching data....")
            const data = await fetchQuestions()
            setQuestions(data)
        }
        get()
    }, [])

    //checking user
    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                console.log("user existed")
            }
        }
        checkUser()
    }, [])

    //fetching more questions
    async function fetchQuestions() {
        if (maxReached) return

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
                            <HomeTop category={q.category} />

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
                            <SocialIcons q={q} />

                            {/* Observer */}
                            {index === questions.length - 1 && <div ref={targetRef}></div>}
                        </div>
                    ))}
                </main>

                {/* TikTok-style Bottom Navigation */}
                <BottomNav />

                <ToastContainer />
            </div>

        </>
    );
};

export default Home;
