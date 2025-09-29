import React, { useState, useEffect, useRef } from 'react';
import { lazy } from 'react';
import { Book } from 'lucide-react';
import supabase from '../config/supabase.js'
import Hintsection from '../components/Hintsection.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { ChevronLeft } from 'lucide-react'
import useHomeStore from '../context/store.js';

const SelectedCategory = lazy(() => import("../components/SelectedCategory.jsx"));

const Explore = () => {
  const { setCategory, setMaxReached } = useHomeStore()
  const [categories, setCategories] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")


  //get the categories
  useEffect(() => {
    setMaxReached(false)
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
    setIsSelected(false)
    setMaxReached(false)
    setCategory({ isCategory: false, value: null })
  }

  return (
    <>
      <main className="h-screen w-full bg-bg flex flex-col overflow-hidden">

        {
          isSelected ? (
            <main className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory custom-scrollbar">
              <SelectedCategory selectedCategory={selectedCategory} />

              {/* top navigation */}
              <nav className='w-full h-[40px] absolute top-[5%] flex items-center justify-start pl-6'>
                <ChevronLeft className='text-text cursor-pointer' onClick={handleOutCategory} />
              </nav>
            </main>
          )
            :
            (
              <main className='w-full flex flex-col flex-1 overflow-hidden'>
                {/* Search bar */}
                <header className='flex items-center justify-center w-full h-[80px] bg-secondary px-4 flex-shrink-0'>
                  <input
                    type="text"
                    placeholder='Search'
                    className='pl-4 rounded-md py-2 md:w-1/2 w-full border border-gray-600 text-white'
                  />
                </header>

                {/* Main categories */}
                <section className='w-full flex gap-2 md:gap-4 p-4 items-center cursor-pointer overflow-x-auto overflow-y-hidden custom-scrollbar flex-shrink-0'>
                  {categories.length > 0 ?
                    categories.map((c, index) => (
                      <Category
                        c={c}
                        key={index}
                        setSelectedCategory={setSelectedCategory}
                        setIsSelected={setIsSelected}
                      />
                    )) : (
                      <div>No categories left</div>
                    )
                  }
                </section>
              </main>
            )
        }

        {/* hint section */}
        <Hintsection />


        {/* Bottom navigation */}
        <BottomNav />
      </main>
    </>
  );
};


export default Explore;



const Category = ({ c, setSelectedCategory, setIsSelected }) => {
  const { name, image, totalquestion } = c;
  const handleStart = () => {
    console.log("selected category", name)
    setSelectedCategory(name)//settinng category
    setIsSelected(true) //toggle
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
