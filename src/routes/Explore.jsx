import React, { useState, useEffect, lazy } from 'react';
import LessonOptions from '../components/LessonOptions.jsx';
import Category from '../components/Category.jsx';
import getCategories from '../utils/supabase/getCategories.jsx';
import { ToastContainer } from 'react-toastify';
import useHomeStore from '../context/store.js';

const Explore = () => {
  const {
    categories = [],
    currentCategory,
  } = useHomeStore();

  const [searchTerm, setSearchTerm] = useState(""); // state for search

  // fetch categories
  useEffect(() => {
    if (categories.length === 0) {
      getCategories()
    }
  }, []);

  // filter categories based on search term
  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <main className="h-full bg-bg w-full flex flex-col overflow-hidden">

      {/* Lessons of selected category */}
      {currentCategory.isSelected ? (
        <div className="h-full flex flex-col relative overflow-hidden">
          <LessonOptions />
        </div>
      ) :
        (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Search Bar */}
            <header className="flex-shrink-0 bg-secondary px-4 py-4 md:py-6 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 rounded-2xl border-b-4 border-gray-700 text-white bg-bg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all text-base md:text-lg font-medium"
                />
              </div>
            </header>

            {/* Categories Section */}
            <section className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 md:p-6">
                {filteredCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-3 md:gap-4 justify-center max-w-6xl mx-auto">
                    {filteredCategories.map((c, index) => (
                      <Category c={c} key={c.id || index} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 md:h-40">
                    <div className="text-center text-gray-500 text-lg md:text-xl">
                      No categories found
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}


      <ToastContainer autoClose={100} />
    </main>
  );
};

export default Explore;
