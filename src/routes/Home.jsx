import CompletedAll from '../components/CompletedAll.jsx'
import Hintsection from '../components/Hintsection.jsx';
import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader.jsx';
import { Suspense, lazy } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import supabase from '../config/supabase.js'
import { useUser } from '../context/userContext.jsx';
import HomeTop from "../components/HomeTop";
import SocialIcons from "../components/SocialIcons";

const BottomNav = lazy(() => import("../components/BottomNav"));

const Home = () => {
    const { user, setUser } = useUser()
    const BATCH_SIZE = 5; // number of questions per batch
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const targetRef = useRef(null);
    const [maxReached, setMaxReached] = useState(false)
    const [selected, setSelected] = useState(null);     // what user clicked
    const [answers, setAnswers] = useState([]);
    const [userLikes, setUserLikes] = useState([])
    const [hints, setHints] = useState([])
    const [hint, setHint] = useState(false)
    const scrollContain=useRef(null)
    const [currentHint, setCurrentHint] = useState("no hint")


    //Stoping scrolling on hint container toggle
    useEffect(()=>{
        // console.log(scrollContain)
        if(scrollContain.current === null) return
        if(hint){
        scrollContain.current.style.overflow="hidden"
        }else{
            scrollContain.current.style.overflow="auto"
        }
    },[hint])//dependency

    //checking user
    useEffect(() => {
        async function start() {
            async function checkUser() {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    setUser(user)
                    console.log("user existed")
                    removePrevious(user.id)
                } else {
                    console.log("new user raixa")
                    get()
                }
            }
            await checkUser()
        }
        start()
    }, [])

    //Initial
    async function removePrevious(id) {
        console.log("started filtered fetching data....")
        const data = await fetchFiltered(id)
        setQuestions(data)
    }
    async function get() {
        console.log("started fetching data....")
        const data = await fetchQuestions()
        setQuestions(data)
    }

    //fetching more questions
    async function fetchQuestions() {
        if (maxReached) return []

        const fetchedIds = questions.map(q => q.id); // get array of q_id

        if (fetchedIds.length > 0) {
            // console.log(fetchedIds)

            const idsString2 = `(${fetchedIds.join(',')})`;
            const { data, error, count } = await supabase
                .from('questions')
                .select('*', { count: 'exact' })
                .not('id', 'in', idsString2)
                .limit(BATCH_SIZE)

            if (questions.length === count) {
                console.log("max reached")
                setMaxReached(true)
            } else {
                setMaxReached(false)
            }

            if (data) {
                return data
            }

        } else {
            const { data, error, count } = await supabase
                .from('questions')
                .select('*', { count: 'exact' })
                .limit(5)

            if (questions.length === count) {
                console.log("max reached")
                setMaxReached(true)
            } else {
                setMaxReached(false)
            }

            if (data) {
                return data
            }

        }
        // setPage(prevPage => prevPage + 1);
    }

    async function fetchFiltered(id) {
        if (maxReached) return

        const notQuestions = await supabase.from("user_answer").select().eq("user_id", id)
        const ids = notQuestions.data.map(q => q.q_id); // get array of q_id
        const idsString = `(${ids.join(',')})`;

        const fetchedIds = questions.map(q => q.id); // get array of q_id
        const idsString2 = `(${fetchedIds.join(',')})`;

        const { data, error, count } = await supabase
            .from('questions')
            .select('*', { count: 'exact' })
            .not('id', 'in', idsString)
            .not('id', 'in', idsString2)
            .limit(BATCH_SIZE)
        // .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1)


        if (error) console.error(error);

        if (questions.length === count) {
            console.log("max reached")
            setMaxReached(true)
        } else {
            setMaxReached(false)
        }

        // setPage(prevPage => prevPage + 1);
        return data || [] // array of questions
    }


    // Intersection Observer
    useEffect(() => {
        if (maxReached) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        if (user) {
                            const nextQuestions = await fetchFiltered(user.id) || []
                            setQuestions(prev => [...prev, ...nextQuestions]);
                        } else {
                            const nextQuestions = await fetchQuestions() || []
                            setQuestions(prev => [...prev, ...nextQuestions]);
                        }
                    }
                });
            },
            { root: null, threshold: 0.5 }
        );

        if (targetRef.current) {
            observer.observe(targetRef.current)
        }

        return () => {
            if (targetRef.current) observer.unobserve(targetRef.current);
        };
    }, [questions, maxReached, page]);


    //Handling Answering
    const checkAnswer = async (q, opt) => {
        if (answers.find(ans => ans.id === q.id)) return; // prevent re-clicking

        const isCorrect = q.a === opt;

        //popups
        // isCorrect ? toast.success("✅ Right answer") : toast.error("❌ Wrong answer");

        // save the answer
        setAnswers(prev => [...prev, { id: q.id, selectedOption: opt, isCorrect }]);

        //Increase the points and insert into user answers
        if (user) {
            const scoreDelta = isCorrect ? 5 : -5;

            await supabase.rpc("increment_points", {
                uid: user.id,
                delta: scoreDelta,
            });

            await supabase.from("user_answer").insert({
                user_id: user.id,
                q_id: q.id,
                answer: opt,
                isRight: isCorrect
            });
        }
    };

    if (maxReached) {
        // toast.success("completed all the questions")
        // alert("done")
        // return (
        //     // <CompletedAll />
        // );
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
                className="w-full h-[calc(100% - 80px)] overflow-y-scroll snap-y snap-mandatory"
                >

                    {questions.map((q, index) => (
                        <div key={index} className="question-container overflow-hidden">
                            {/* <HomeTop category={q.category} /> */}

                            {/* Question */}
                            <div className="flex flex-col items-center justify-center h-[calc(100% - 80px)]
                             flex-1 relative z-10 max-w-lg w-full px-4">

                                <h2 className="question-text">{q.q}</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-items-center">
                               
                                    {q.options && q.options.length > 0 ? (
                                        q.options.map((opt, i) => {
                                            const answer = answers.find(ans => ans.id === q.id);
                                            let buttonClass = "option-button";

                                            if (answer) {

                                                if (answer.selectedOption === opt) {
                                                    //showing the users answer
                                                    buttonClass += answer.isCorrect ? " bg-right text-bg" : " bg-wrong text-bg";
                                                } else {
                                                    if (q.a === opt) {
                                                        buttonClass += " bg-right text-bg"
                                                    } else {
                                                        buttonClass += " bg-secondary text-text"; // other options after answering
                                                    }
                                                }
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    className={buttonClass}
                                                    onClick={() => checkAnswer(q, opt)}
                                                    disabled={!!answer} // disable after answering
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <>
                                            {["true", "false"].map((opt, i) => {
                                                const answer = answers.find(ans => ans.id === q.id);
                                                let buttonClass = "option-button";

                                                if (answer) {
                                                    if (answer.selectedOption === opt) {
                                                        buttonClass += answer.isCorrect ? " bg-right text-bg" : " bg-wrong text-bg";

                                                    } else {
                                                        buttonClass += " bg-secondary text-text";
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={i}
                                                        className={buttonClass}
                                                        onClick={() => checkAnswer(q, opt)}
                                                        disabled={!!answer}
                                                    >
                                                        {opt === "true" ? "Yes" : "No"}
                                                    </button>
                                                );
                                            })}
                                        </>
                                    )}

                                </div>
                            </div>

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
                <Hintsection hint={hint} setHint={setHint} currentHint={currentHint}/>

                {/* Bottom navigation */}
                <BottomNav />

                <ToastContainer autoClose={100} />
            </div>
        </>
    );
};


export default Home;

