import React, { useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import getQuestions from '../utils/getQuestions.jsx';
import { observe } from '../utils/observe.jsx';
import filterAnsweredQuestions from '../utils/filterAnsweredQuestions.jsx';
import Hintsection from '../components/Hintsection.jsx';
import Loader from '../components/Loader.jsx';
import SocialIcons from "../components/SocialIcons";
import Question from '../utils/Question.jsx';
import useHomeStore from '../context/store.js'
import insertUserIfFirstLogin from '../utils/insertUserIfNewUser.jsx';
import CompletedAll from '../components/CompletedAll.jsx';
import SelectACategory from '../components/SelectACategory.jsx';

const Home = () => {
    const lessons = useHomeStore(state => state.lessons);
    const hintVisible = useHomeStore(state => state.hintVisible);
    const answers = useHomeStore(state => state.answers);
    const currentLesson = useHomeStore(state => state.currentLesson);
    const currentCategory = useHomeStore(state => state.currentCategory);
    const isIntroDone = useHomeStore(state => state.isIntroDone);
    const targetRef = useRef(null);
    const scrollContain = useRef(null)
    const currentSelectedLesson = lessons.find(l => l.name === currentLesson.name)
    const currentQuestions = currentSelectedLesson?.questions || []
    const maxReached = currentSelectedLesson?.maxReached || false

    //Initail setups
    useEffect(() => {
        //***checking if user exist and provider is google 
        insertUserIfFirstLogin()//fix this shit

        //***checking if category selected
        if (currentCategory.isSelected && currentLesson.isSelected) {
            // checking if answered
            if (answers.length > 0) {
                filterAnsweredQuestions(currentQuestions)
            }

            //fetching the questions for initialss
            getQuestions()
            return
        }
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
        if (currentSelectedLesson?.maxReached) return
        const observer = observe()
        if (targetRef.current) {
            observer.observe(targetRef.current)
        }

        return () => {
            if (targetRef.current) observer.unobserve(targetRef.current);
        };
    }, [currentQuestions, currentSelectedLesson?.maxReached]);


    // NO categorires and lesson is selected
    if (!currentLesson.isSelected && !currentCategory.isSelected && isIntroDone) {
        return <SelectACategory />
    }

    // All questions are completed in this lessons
    if (currentQuestions.length === 0 && maxReached) {
        return (
            <CompletedAll />
        )
    }

    //NO questions are availabes
    if (currentQuestions.length === 0 && maxReached === false && isIntroDone) {
        return (
            <Loader />
        )
    }

    //Auto scroll to next after the answer selection
    const handleScroll=(questionIndex)=>{
        console.log("scrolling to ",questionIndex)
    // Auto-scroll to next section after selection
    setTimeout(() => {
      const nextSection =
        document.querySelectorAll(".snap-start")[questionIndex + 1];
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    }
    return (
        <>

            <div className="h-full w-full bg-bg flex custom-scrollbar md:h-full">
                {/* Main Content */}
                <main
                    ref={scrollContain}
                    className="flex-1  w-full overflow-y-scroll snap-y snap-mandatory"
                >
                    {Array.isArray(currentQuestions) &&
                        currentQuestions.map((q, index) => (
                            <div key={index} className=" snap-start question-container overflow-hidden">
                                <Question q={q} handleScroll={handleScroll} questionIndex={index}/>
                                <SocialIcons q={q} />
                                {index === currentQuestions.length - 2 && <div ref={targetRef}></div>}
                            </div>
                        ))}
                </main>

                <Hintsection />
                {/* <BottomNav /> */}
                <ToastContainer autoClose={100} />
            </div>
        </>
    );
};


export default Home;

