import { observe } from '../utils/observe.jsx';
import Sidebar from '../components/Sidebar.jsx';
import supabase from '../config/supabase.js';
import Hintsection from '../components/Hintsection.jsx';
import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader.jsx';
import { Suspense, lazy } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import SocialIcons from "../components/SocialIcons";
import Question from '../utils/Question.jsx';
import useHomeStore from '../context/store.js'
import checkUserForQuestions from '../utils/checkUserForQuestions.jsx';
import filterAnsweredQuestions from '../utils/filterAnsweredQuestions.jsx';
import insertUserIfFirstLogin from '../utils/insertUserIfNewUser.jsx';

const BottomNav = lazy(() => import("../components/BottomNav"));

const Home = () => {
    const {
        hintVisible,
        categories = [],
        addNewCategory,
        setSelectedCategory,
        answers = [],
    } = useHomeStore(state => state)

    const targetRef = useRef(null);
    const scrollContain = useRef(null)
    const currentCategory = categories.find(c => c.name === "home");
    const currentQuestions = currentCategory?.questions || [];



    useEffect(() => {
        //checking if user exist and provider is google 
        insertUserIfFirstLogin()

        //adding new category if not exist yet
        addNewCategory('home')
        setSelectedCategory('home')//home is selected now

        //checking if answered
        if (answers.length > 0) {
            filterAnsweredQuestions(currentQuestions)
        }

        //fetching the questions
        checkUserForQuestions()
    }, [])


    //Stoping scrolling on hint container toggle
    useEffect(() => {
        // console.log(scrollContain)
        if (scrollContain.current === null) return
        if (hintVisible) {
            scrollContain.current.style.overflow = "hidden"
        } else {
            scrollContain.current.style.overflow = "auto"
        }
    }, [hintVisible])//dependency


    // Intersection Observer
    useEffect(() => {
        if (currentCategory?.maxReached) return
        const observer = observe()
        if (targetRef.current) {
            observer.observe(targetRef.current)
        }

        return () => {
            if (targetRef.current) observer.unobserve(targetRef.current);
        };
    }, [currentQuestions, currentCategory?.maxReached]);

    // Loading state
    if (currentQuestions.length === 0) {
        return (
            <Loader />
        )
    }

    return (
        <>
            <div className="home custom-scrollbar fixed md:flex-row">
                <Sidebar />
                {/* Main Content */}
                <main
                    ref={scrollContain}
                    className="flex-1 md:h-full w-full overflow-y-scroll snap-y snap-mandatory md:w-[calc(100% - 64)]">

                    {Array.isArray(currentQuestions) && currentQuestions.map((q, index) => (
                        <div key={index} className="question-container overflow-hidden">

                            {/* Question */}
                            <Question q={q} />

                            {/* Socials icons */}
                            <SocialIcons q={q} />

                            {/* Observer */}
                            {index === currentQuestions.length - 2 && <div ref={targetRef}></div>}
                        </div>
                    ))}

                </main>

                {/* hint section */}
                <Hintsection />

                {/* Bottom navigation */}
                <BottomNav />
                <ToastContainer autoClose={100} />
            </div>
        </>
    );
};


export default Home;

