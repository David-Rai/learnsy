import { observe } from '../utils/observe.jsx';
import getQuestions from '../utils/getQuestions.jsx';
import removePreviousQuestions from '../utils/removePreviousQuestions.jsx';
import { checkAnswer } from '../utils/checkAnswer.jsx';
import Hintsection from '../components/Hintsection.jsx';
import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader.jsx';
import { Suspense, lazy } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import supabase from '../config/supabase.js'
import { useUser } from '../context/userContext.jsx';
import SocialIcons from "../components/SocialIcons";
import Question from '../utils/Question.jsx';

const BottomNav = lazy(() => import("../components/BottomNav"));

const Home = () => {
    const { user, setUser } = useUser()
    const BATCH_SIZE = 5; // number of questions per batch
    const [questions, setQuestions] = useState([]);
    const targetRef = useRef(null);
    const [maxReached, setMaxReached] = useState(false)
    const [answers, setAnswers] = useState([]);
    const [userLikes, setUserLikes] = useState([])
    const [hints, setHints] = useState([])
    const [hint, setHint] = useState(false)
    const scrollContain = useRef(null)
    const [currentHint, setCurrentHint] = useState("no hint")


    //Stoping scrolling on hint container toggle
    useEffect(() => {
        // console.log(scrollContain)
        if (scrollContain.current === null) return
        if (hint) {
            scrollContain.current.style.overflow = "hidden"
        } else {
            scrollContain.current.style.overflow = "auto"
        }
    }, [hint])//dependency

    //checking user
    useEffect(() => {
        async function start() {
            async function checkUser() {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    setUser(user)
                    console.log("user existed")
                    removePreviousQuestions(user.id, setQuestions, maxReached, setMaxReached, questions, BATCH_SIZE)
                } else {
                    console.log("new user raixa")
                    getQuestions(setQuestions, maxReached, setMaxReached, questions)
                }
            }
            await checkUser()
        }
        start()
    }, [])

    // Intersection Observer
    useEffect(() => {
        if (maxReached) return
        const observer = observe(user, setQuestions, maxReached, setMaxReached, BATCH_SIZE, questions)
        if (targetRef.current) {
            observer.observe(targetRef.current)
        }

        return () => {
            if (targetRef.current) observer.unobserve(targetRef.current);
        };
    }, [questions, maxReached]);

    if (maxReached) {
        // alert("done")
    }

    // Loading state
    if (questions.length === 0) {
        return (
            <Loader />
        )
    }

    return (
        <>
            <div className="home custom-scrollbar">
                {/* Main Content */}
                <main
                    ref={scrollContain}
                    className="w-full h-[calc(100% - 80px)] overflow-y-scroll snap-y snap-mandatory">

                    {questions.map((q, index) => (
                        <div key={index} className="question-container overflow-hidden">

                            {/* Question */}
                            <Question answers={answers} setAnswers={setAnswers} q={q} />

                            {/* Socials icons */}
                            <SocialIcons q={q}
                                userLikes={userLikes}
                                hint={hint}
                                currentHint={currentHint}
                                setCurrentHint={setCurrentHint}
                                setHint={setHint}
                                setUserLikes={setUserLikes} />

                            {/* Observer */}
                            {index === questions.length - 2 && <div ref={targetRef}></div>}
                        </div>
                    ))}

                </main>

                {/* hint section */}
                <Hintsection hint={hint} setHint={setHint} currentHint={currentHint} />

                {/* Bottom navigation */}
                <BottomNav />
                <ToastContainer autoClose={100} />
            </div>
        </>
    );
};


export default Home;

