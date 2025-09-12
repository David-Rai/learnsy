import React, { useState, useEffect, useRef } from 'react';
import supabase from '../config/supabase.js'
import BottomNav from '../components/BottomNav.jsx';
import {
    FaHome,
    FaCompass,
    FaUser,
    FaChartLine,
    FaHeart,
    FaComment,
    FaBookmark,
    FaShare,
    FaPlus
} from 'react-icons/fa';

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
            .from('mcq')
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
        <><div className="relative h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-hidden">
            {/* Main Content */}

            <main className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16">
                {questions.map((q, index) => (
                    <div
                        key={index}
                        className="relative snap-start h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700"
                    >
                        {/* Background overlay */}
                        <div className="h-full w-full absolute inset-0 bg-black/20" />

                        {/* Profile Info - Top Left */}
                        <div className="absolute top-6 left-6 z-20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <span className="text-black font-bold text-sm">Q</span>
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm md:text-base drop-shadow-md">
                                        @quizmaster_pro
                                    </p>
                                    <p className="text-white/80 text-xs md:text-sm">Quiz Master</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Question Content - Center */}
                        <div className="flex flex-col items-center justify-center flex-1 relative z-10 max-w-lg w-full px-4">
                            <h2
                                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-white
                             drop-shadow-lg leading-snug break-words overflow-hidden"
                            >
                                {q.q}
                            </h2>

                            {/* Options in 2-column grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                {q.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className="bg-black/80 backdrop-blur-sm text-yellow-300 px-5 py-4 rounded-2xl shadow-lg 
                                       hover:bg-black/90 transition-all font-medium text-sm sm:text-base break-words"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Social Icons - Bottom Right */}
                        <div className="absolute bottom-24 right-4 flex flex-col gap-4 z-20">
                            {/* Like */}
                            <div className="flex flex-col items-center">
                                <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                                    <FaHeart className="w-6 h-6 text-white" />
                                </button>
                                <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">
                                    12.3K
                                </span>
                            </div>

                            {/* Comment */}
                            <div className="flex flex-col items-center">
                                <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                                    <FaComment className="w-6 h-6 text-white" />
                                </button>
                                <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">
                                    847
                                </span>
                            </div>

                            {/* Save */}
                            <div className="flex flex-col items-center">
                                <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                                    <FaBookmark className="w-6 h-6 text-white" />
                                </button>
                                <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">
                                    3.2K
                                </span>
                            </div>

                            {/* Share */}
                            <div className="flex flex-col items-center">
                                <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                                    <FaShare className="w-6 h-6 text-white" />
                                </button>
                                <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">
                                    Share
                                </span>
                            </div>
                        </div>

                             {/* Observer target */}
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
