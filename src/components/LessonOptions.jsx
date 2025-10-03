import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import React from 'react'
import useHomeStore from '../context/store'

const LessonOptions = () => {
    const {
        currentLesson,
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
        const categoryName=currentCategory.name
        addNewLesson(lesson,[],categoryName)


      console.log('new lesson object added successfully',useHomeStore.getState().lessons)
        // console.log("selected lesson state", useHomeStore.getState().currentLesson)

        //navigating to home page and showing lesson related questions
        navigate('/')
    }

    return (
        <main className='h-full w-full text-text flex flex-col'>
            {/* Search Bar */}
            <header className="flex-shrink-0 bg-secondary px-4 py-4 md:py-6">
                <div className="max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // update search term
                        className="w-full px-4 py-3 rounded-md border border-gray-600 text-white bg-bg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                </div>
            </header>

            {/* Main content here */}
            <section className='flex flex-1 w-full flex-col gap-3 items-start justify-start pl-5 pt-5 bg-red'>
                <h1>Chapters</h1>
                {
                    filteredLessons.length > 0
                        ? filteredLessons.map((l, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectLesson(l)}
                                className='bg-text text-bg px-4 py-2 rounded-md cursor-pointer'
                            >
                                {
                                    l
                                }
                            </button>
                        ))
                        :
                        (
                            <div>
                                no options la sathy
                            </div>
                        )
                }
            </section>
        </main>

    )
}

export default LessonOptions