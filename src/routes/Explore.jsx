import React, { useState, useEffect, useRef } from 'react';
import { lazy } from 'react';
import { Book } from 'lucide-react';
import supabase from '../config/supabase.js'
import Hintsection from '../components/Hintsection.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { ChevronLeft } from 'lucide-react'
import useHomeStore from '../context/store.js';
import filterAnsweredQuestions from '../utils/filterAnsweredQuestions.jsx';

const SelectedCategory = lazy(() => import("../components/SelectedCategory.jsx"));

const Explore = () => {
  const { setCategory, isCategorySelected,setIsCategorySelected,setSelectedCategory,selectedCategory} = useHomeStore()
  const [categories, setCategories] = useState([])


  //get the categories
  useEffect(() => {
    filterAnsweredQuestions()
    const get = async () => {
      const { error, data } = await supabase.rpc('get_categories_with_count')

      if (error) {
        console.error('Error fetching categories:', error)
        return setCategories([])
      }

      setCategories(data)
    }
    get()
  }, [])

  //getting out of the category
  const handleOutCategory = () => {
    setIsCategorySelected(false)
    setCategory({ isCategory: false, value: null })
  }

  return (
    <>
      <main className="h-screen w-full bg-bg flex flex-col overflow-hidden">
        {isCategorySelected ? (
          // Selected Category View
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Top Navigation */}
            <nav className="absolute top-4 left-4 z-10 md:top-6 md:left-6">
              <ChevronLeft
                className="text-text cursor-pointer w-6 h-6 md:w-8 md:h-8"
                onClick={handleOutCategory}
              />
            </nav>

            {/* Selected Category Content */}
            <div className="flex-1 overflow-y-auto snap-y snap-mandatory custom-scrollbar">
              <SelectedCategory  />
            </div>
          </div>
        ) : (
          // Main Categories View
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <header className="flex-shrink-0 bg-secondary px-4 py-4 md:py-6">
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-3 rounded-md border border-gray-600 text-white bg-bg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </header>

            {/* Categories Section */}
            <section className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 md:p-6">
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-3 md:gap-4 justify-center max-w-6xl mx-auto">
                    {categories.map((c, index) => (
                      <Category
                        c={c}
                        key={c.id || index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 md:h-40">
                    <div className="text-center text-gray-500 text-lg md:text-xl">
                      No categories left
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Hint Section */}
        <div className="flex-shrink-0">
          <Hintsection />
        </div>

        {/* Bottom Navigation */}
        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      </main>
    </>
  );
};


export default Explore;



const Category = ({c}) => {
const {setSelectedCategory,setIsCategorySelected}=useHomeStore()

  const { name, image, totalquestion } = c;
  const handleStart = () => {
    console.log("selected category", name)
    setSelectedCategory(name)//settinng category
    setIsCategorySelected(true) //toggle
  }

  return (
    <div className="flex flex-col w-full md:w-[20%]
     h-[250px] overflow-hidden rounded-2xl
      bg-gray-800 shadow-lg transition-transform hover:scale-105"
      onClick={handleStart}
    >

      {/* Image */}
      <img
        src={image}
        alt={name}
        className="h-[60%] w-full object-cover"
      />

      {/* Details */}
      <div className="flex flex-col justify-center p-4 w-full bg-gray-900">
        {/* Category Name */}
        <h2 className="text-white text-lg md:text-xl font-bold mb-2 truncate">
          {name}
        </h2>

        {/* Questions Count */}
        <div className="flex items-center gap-2 text-white font-medium">
          <Book className="w-5 h-5 text-green-400" />
          <span>{totalquestion || 0} Questions</span>
        </div>
      </div>

    </div>
  );
};
