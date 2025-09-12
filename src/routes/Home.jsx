import React, { useState, useEffect, useRef } from 'react';
import supabase from '../config/supabase.js'
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
    const [activeTab, setActiveTab] = useState('home');
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
        <>
            <div className="relative h-screen w-full bg-black overflow-hidden">
                {/* Main Content */}
                <main className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16">
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="relative snap-start bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 h-screen flex flex-col justify-center items-center px-4"
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
                                        <p className="text-white font-semibold text-sm drop-shadow-md">@quizmaster_pro</p>
                                        <p className="text-white/80 text-xs">Quiz Master</p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Question Content - Center */}
                            <div className="flex flex-col items-center justify-center flex-1 relative z-10 max-w-sm w-full">
                                <h2 className="text-2xl font-bold mb-8 text-center text-black drop-shadow-lg leading-tight">
                                    {q.q}
                                </h2>
                                <div className="flex flex-col gap-3 w-full">
                                    {q.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className="bg-black/80 backdrop-blur-sm text-yellow-300 px-6 py-4 rounded-full shadow-lg hover:bg-black/90 transition-all font-medium text-sm w-full"
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
                                    <span className="text-white text-xs font-medium drop-shadow-sm">12.3K</span>
                                </div>

                                {/* Comment */}
                                <div className="flex flex-col items-center">
                                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                                        <FaComment className="w-6 h-6 text-white" />
                                    </button>
                                    <span className="text-white text-xs font-medium drop-shadow-sm">847</span>
                                </div>

                                {/* Save */}
                                <div className="flex flex-col items-center">
                                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                                        <FaBookmark className="w-6 h-6 text-white" />
                                    </button>
                                    <span className="text-white text-xs font-medium drop-shadow-sm">3.2K</span>
                                </div>

                                {/* Share */}
                                <div className="flex flex-col items-center">
                                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                                        <FaShare className="w-6 h-6 text-white" />
                                    </button>
                                    <span className="text-white text-xs font-medium drop-shadow-sm">Share</span>
                                </div>

                                {/* Profile Picture */}
                                <div className="mt-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                        <span className="text-black font-bold text-lg">Q</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </main>

                {/* TikTok-style Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-30">
                    <div className="flex items-center justify-around py-2 px-4">
                        {/* Home */}
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'home' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaHome className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Home</span>
                        </button>

                        {/* Explore */}
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'explore' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaCompass className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Explore</span>
                        </button>

                        {/* Add/Create (Plus button)
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <FaPlus className="w-6 h-6 text-black" />
          </button> */}

                        {/* Progress */}
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'progress' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaChartLine className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Progress</span>
                        </button>

                        {/* Profile */}
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FaUser className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
