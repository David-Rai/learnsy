import React, { useState, useEffect, useRef } from 'react';
import supabase from '../config/supabase.js'
import { useUser } from '../context/userContext.jsx';
import BottomNav from '../components/BottomNav.jsx';


const Explore = () => {
  const { user, setUser } = useUser()
  const [categories, setCategories] = useState([])

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
        <main className="w-full h-full flex flex-col">

          {/* contain the search bar */}
          <header className='flex items-center justify-center w-full h-[80px] bg-secondary px-4 '>
            <input type="text" placeholder='Search' className='pl-4 rounded-md py-2 
            w-full border border-gray-600 text-white' />
          </header>

          {/* Main categories here */}
          <section className='w-full'>
            {
              categories.length > 0 ?
                categories.map((c,index) => {
                  return <Category c={c}  key={index}/>
                })

                :

              (
                <div>
                  No categories left
                </div>
              )
            }
          </section>
        </main>

        {/* Bottom navigation */}
        <BottomNav />
      </div>
    </>
  );
};


export default Explore;

const Category = ({ c }) => {
 const {name,image,totalQuestion}=c

  return (
    <>
      <div className='flex h-[200px] w-[30%]'>
        <img src={image} alt="" />
        <h1>{name}</h1>
        <p>{totalQuestion}</p>
      </div>
    </>
  )
}