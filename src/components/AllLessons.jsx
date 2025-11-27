import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import React from 'react'
import useHomeStore from '../context/store'

const LessonOptions = () => {
    const {
        setCurrentLesson,
        currentCategory,
        setCurrentCategory,
        addNewLesson
    }
        = useHomeStore()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState(""); // state for search

    // filter categories based on search term
    const filteredLessons = currentCategory.lessonOptions.filter((c) =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //handling select option
    const handleSelectLesson = (lesson) => {

        //setting curent lesson state
        setCurrentLesson({
            isSelected: true,
            name: lesson
        })

        //create new lesson object 
        const categoryName = currentCategory.name
        addNewLesson(lesson, [], categoryName)

        //navigating to home page and showing lesson related questions
        navigate('/')
    }

    //Going to the category
    const handleGotoCategory = () => {
        setCurrentCategory({ name: null, isSelected: false, lessonOptions: [] })
        setCurrentLesson({ name: null, isSelected: false })
    }

    return (
        <main className='h-full w-full text-text flex flex-col'>
            {/* Search Bar */}
            <header className="flex-shrink-0 bg-secondary px-4 py-4 md:py-6 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 md:py-4 rounded-2xl border-b-4 border-gray-700 text-white bg-bg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all text-base md:text-lg font-medium"
                    />
                </div>
            </header>

            {/* Back to Categories Button */}
            <section className="flex-shrink-0 bg-secondary px-4 py-3 md:py-4 shadow-lg border-t border-primary/10">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleGotoCategory}
                        className='group relative w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 backdrop-blur-sm px-6 py-3 md:py-4 cursor-pointer rounded-2xl border-2 border-primary/40 font-bold text-base md:text-lg hover:border-primary hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3'
                    >
                        <span className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></span>
                        <span className='relative flex items-center gap-2'>
                            <svg
                                className='w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform duration-300'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                            </svg>
                            Back to Categories
                        </span>
                    </button>
                </div>
            </section>

            {/* Main content */}
            <section className='flex-1 w-full overflow-y-auto px-4 py-6 md:py-8 custom-scrollbar'>
                <div className='max-w-4xl mx-auto'>
                    <h1 className='text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-text'>Chapters</h1>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5'>
                        {
                            filteredLessons.length > 0
                                ? filteredLessons.map((l, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectLesson(l)}
                                        className='option-button text-left px-5 py-4 hover:scale-105 active:scale-95'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <span className='text-2xl'>📚</span>
                                            <span className='font-bold truncate capitalize'>{l}</span>
                                        </div>
                                    </button>
                                ))
                                :
                                (
                                    <div className='col-span-full text-center py-12'>
                                        <p className='text-xl md:text-2xl font-bold text-gray-400'>
                                            No lessons found 🎯
                                        </p>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </section>

        </main>
    )
}

export default LessonOptions