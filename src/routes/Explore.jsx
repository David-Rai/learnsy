import React, { useState, useEffect, useRef } from 'react';
import { Book } from 'lucide-react';
import supabase from '../config/supabase.js'
import SelectedCategory from '../components/SelectedCategory.jsx';
import { useUser } from '../context/userContext.jsx';
import BottomNav from '../components/BottomNav.jsx';


const Explore = () => {
  const { user, setUser } = useUser()
  const [categories, setCategories] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const [selectedCategory,setSelectedCategory]=useState("")


  //get the categories
  useEffect(() => {
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

  return (
    <>
      <div className="h-screen w-full bg-bg flex flex-col custom-scrollbar justify-end items-center">

        {/* Main Content */}
        <main className="w-full h-[calc(100-80px)] flex flex-col">
          {
            isSelected? (
              <>
                <div>
                  {/* <SelectedCategory /> */}
                </div>
              </>
            )
              :
              (

                <>
                  {/* contain the search bar */}
                  <header className='flex items-center justify-center w-full h-[80px] bg-secondary px-4 '>
                    <input type="text" placeholder='Search' className='pl-4 rounded-md py-2  md:w-1/2
                   w-full border border-gray-600 text-white' />
                  </header>

                  {/* Main categories here */}
                  <section className='w-full flex gap-2 md:gap-4 p-4 items-center cursor-pointer overflow-y-scroll custom-scrollbar'>
                    {
                      categories.length > 0 ?
                        categories.map((c, index) => {
                          return <Category c={c} key={index} setSelectedCategory={setSelectedCategory} setIsSelected={setIsSelected}/>
                        })

                        :

                        (
                          <div>
                            No categories left
                          </div>
                        )
                    }
                  </section>
                </>
              )
          }
        </main>

        {/* Bottom navigation */}
        <BottomNav />
      </div >
    </>
  );
};


export default Explore;



const Category = ({ c , setSelectedCategory,setIsSelected}) => {
  const { name, image, totalquestion  } = c;
  const handleStart=()=>{
    setSelectedCategory(name)//settingn category
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
