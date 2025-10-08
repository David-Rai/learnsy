import React from 'react'
import { useNavigate } from 'react-router';
import supabase from '../../config/supabase'
import checkMember from '../../utils/checkMember';
import { CircleUser } from 'lucide-react'
import { Trash, Users, TrendingUp, Crown } from 'lucide-react';
import { useState, useEffect } from 'react'
import useHomeStore, { useMemberStore } from '../../context/store'
import Loader from '../../components/Loader';

const Member = () => {
    const navigate = useNavigate()
    const { categories, setCategories } = useHomeStore()
    const { question_count, setQuestionCount, isMemberChecked } = useMemberStore()
    const [isChecked, setIsChecked] = useState(false)

    //Protecting the routes
    const check = async () => {
        const res = await checkMember()
        if (!res) return navigate('/')
        setIsChecked(true)
    }

    //Getting categoires
    const getCategories = async () => {
        const { error, data } = await supabase.rpc('get_categories_with_count');
        if (error) {
            console.error('Error fetching categories:', error);
            return setCategories([]);
        }
        setCategories(data);
    };

    //Getting total Questions
    const getQuestions = async () => {
        const { count } = await supabase
            .from("questions")
            .select("*", { count: 'exact' })

        if (!count) return
        setQuestionCount(count)
    }

    //Initialization
    useEffect(() => {
        check()
        if (categories.length === 0) {
            getCategories()
        }
        if (question_count === 0) {
            getQuestions()
        }
    }, [])


    return isChecked ? (
        <main className='h-full w-full bg-bg'>

            {/* Questions count */}
            <section className='w-full h-[40%] flex items-center justify-center py-4 gap-x-4 text-gray-300'>
                {/* Total users */}
                <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1'>
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                    <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
                        <div className='relative'>
                            <CircleUser className='size-20 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6' />
                            <div className='absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
                        </div>
                    </div>

                    <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
                        <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>Total Categories</p>
                        <h1 className='text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
                            {categories.length > 0 ? (
                                <span className='inline-block tabular-nums' style={{ animation: 'countUp 0.5s ease-out' }}>
                                    {categories.length}
                                </span>
                            ) : (
                                '0'
                            )}
                        </h1>
                    </div>

                    <div className='absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
                </div>

                {/* Total Questions */}
                <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-green-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1'>
                    <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                    <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
                        <div className='relative'>
                            <CircleUser className='size-20 text-green-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6' />
                            <div className='absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50' />
                            <div className='absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
                        </div>
                    </div>

                    <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
                        <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>Total Questions</p>
                        <h1 className='text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
                            <span className='inline-block tabular-nums' style={{ animation: 'countUp 0.5s ease-out 0.1s both' }}>
                                {question_count}
                            </span>
                        </h1>
                    </div>

                    <div className='absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
                </div>

            </section>

            {/* Add new question field */}
            <div>
                <button onClick={() => navigate('/addQuestion')}
                    className='option-button'
                    >Add Question</button>
            </div>
        </main>
    )
        :
        (
            <Loader />
        )
}

export default Member