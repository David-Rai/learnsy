import React, { useState, useEffect, useRef } from 'react';
import supabase from '../config/supabase.js'

const Home = () => {
    const BATCH_SIZE = 5; // number of questions per batch
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const targetRef = useRef(null);

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
        console.log("fetching questions")
        const { data, error } = await supabase
            .from('mcq')
            .select('*')
            .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1);

        if (error) console.error(error);
        setPage(page + 1)
        return data; // array of questions
    }

    // Intersection Observer
    useEffect(() => {
        console.log("observer")
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
        <div className='h-screen w-full bg-gray-200 overflow-y-scroll snap-y snap-mandatory'>
            {questions.map((q, index) => (

                <div key={index} className='relative snap-start bg-amber-300 h-screen flex flex-col justify-center items-center p-4'>
                    <div className='h-full w-full absolute flex items-center justify-center' >
                        overlay{index}
                    </div>
                    <h2 className='text-xl font-bold mb-4 text-center'>{q.q}</h2>
                    <div className='flex flex-col gap-2'>
                        {q.options.map((opt, i) => (
                            <button key={i} className='bg-white px-4 py-2 rounded shadow'>{opt}</button>
                        ))}
                    </div>

                    {index === questions.length - 1 && <div ref={targetRef}></div>}
                </div>
            ))}

                <p className='text-center mt-4'>Loading more...</p>
        </div>
    );
};

export default Home;
