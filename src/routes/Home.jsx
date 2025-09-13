import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import SocialIcons from '../components/SocialIcons.jsx';
import { ToastContainer } from 'react-toastify';
import HomeTop from '../components/HomeTop.jsx';
import supabase from '../config/supabase.js'
import { useUser } from '../context/userContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

// Memoized Question Component to prevent unnecessary re-renders
const QuestionItem = React.memo(({ q, isLast, targetRef }) => (
    <div key={q.id} className="question-container">
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
                            key={i} 
                            className='option-button'
                        >
                            {opt}
                        </button>
                    ))
                ) : (
                    <>
                        <button className="option-button">
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
        <Suspense fallback={<div className="w-12 h-12" />}>
            <SocialIcons q={q} />
        </Suspense>

        {/* Observer */}
        {isLast && <div ref={targetRef}></div>}
    </div>
));

QuestionItem.displayName = 'QuestionItem';

// Loading skeleton component
const QuestionSkeleton = () => (
    <div className="question-container animate-pulse">
        <div className="h-full w-full absolute inset-0 bg-gray-800" />
        <div className="flex flex-col items-center justify-center flex-1 relative z-10 max-w-lg w-full px-4">
            <div className="h-8 bg-gray-600 rounded mb-4 w-3/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="h-12 bg-gray-600 rounded"></div>
                <div className="h-12 bg-gray-600 rounded"></div>
            </div>
        </div>
    </div>
);

const Home = () => {
    const { user, setUser } = useUser();
    const BATCH_SIZE = 5;
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [maxReached, setMaxReached] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const targetRef = useRef(null);
    const observerRef = useRef(null);

    // Memoize fetch function to prevent unnecessary re-creations
    const fetchQuestions = useCallback(async (currentPage = page) => {
        if (maxReached || isLoading) return [];

        setIsLoading(true);
        
        try {
            const { data, error, count } = await supabase
                .from('questions')
                .select('*', { count: 'exact' })
                .range(currentPage * BATCH_SIZE, (currentPage + 1) * BATCH_SIZE - 1);

            if (error) {
                console.error(error);
                return [];
            }

            // Check if we've reached the maximum
            if (questions.length + (data?.length || 0) >= count) {
                setMaxReached(true);
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [page, maxReached, isLoading, questions.length, BATCH_SIZE]);

    // Initial load
    useEffect(() => {
        let isMounted = true;
        
        async function initialLoad() {
            console.log("Started fetching initial data...");
            const data = await fetchQuestions(0);
            if (isMounted) {
                setQuestions(data);
                setPage(1);
            }
        }
        
        initialLoad();
        
        return () => {
            isMounted = false;
        };
    }, []); // Remove fetchQuestions from dependencies to prevent infinite loop

    // User authentication check
    useEffect(() => {
        let isMounted = true;
        
        async function checkUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user && isMounted) {
                    setUser(user);
                    console.log("User existed");
                }
            } catch (error) {
                console.error('Error checking user:', error);
            }
        }
        
        checkUser();
        
        return () => {
            isMounted = false;
        };
    }, [setUser]);

    // Optimized Intersection Observer with debouncing
    useEffect(() => {
        if (maxReached) return;

        let timeoutId;
        
        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoading) {
                    // Debounce the fetch request
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(async () => {
                        const nextQuestions = await fetchQuestions(page);
                        if (nextQuestions.length > 0) {
                            setQuestions(prev => [...prev, ...nextQuestions]);
                            setPage(prev => prev + 1);
                        }
                    }, 100);
                }
            });
        };

        observerRef.current = new IntersectionObserver(handleIntersection, {
            root: null,
            threshold: 0.1, // Trigger earlier for smoother loading
            rootMargin: '50px' // Load content before it's fully visible
        });

        if (targetRef.current) {
            observerRef.current.observe(targetRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [page, maxReached, isLoading, fetchQuestions]);

    // Memoize the questions list to prevent unnecessary re-renders
    const questionsList = useMemo(() => {
        return questions.map((q, index) => (
            <QuestionItem
                key={q.id}
                q={q}
                isLast={index === questions.length - 1}
                targetRef={index === questions.length - 1 ? targetRef : null}
            />
        ));
    }, [questions]);

    return (
        <Suspense fallback={
            <div className="home">
                <main className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16">
                    <QuestionSkeleton />
                </main>
            </div>
        }>
            <div className="home">
                {/* Main Content */}
                <main 
                    className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16"
                    style={{
                        // Optimize scrolling performance
                        WebkitOverflowScrolling: 'touch',
                        scrollBehavior: 'smooth',
                        willChange: 'scroll-position'
                    }}
                >
                    {questionsList}
                    
                    {/* Loading indicator */}
                    {isLoading && !maxReached && <QuestionSkeleton />}
                    
                    {/* End message */}
                    {maxReached && questions.length > 0 && (
                        <div className="flex items-center justify-center h-32">
                            <p className="text-white/70">No more questions to load</p>
                        </div>
                    )}
                </main>

                {/* TikTok-style Bottom Navigation */}
                <BottomNav />

                <ToastContainer />
            </div>
        </Suspense>
    );
};

export default Home;