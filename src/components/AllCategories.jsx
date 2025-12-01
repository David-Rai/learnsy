import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import useHomeStore, { useClassStore } from "../context/store";
import Category from "../components/Category.jsx";
import Loader from "../components/Loader.jsx";
import AllLessons from "./AllLessons";

const AllCategories = () => {
  const { currentClass, setCurrentClass } = useClassStore();
  const { currentCategory } = useHomeStore();
  const [searchTerm, setSearchTerm] = useState(""); // state for search

  // filter categories based on search term
  const filteredCategories = currentClass.categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    setCurrentClass({
      name: null,
      isSelected: false,
      categories: [],
    });
  };

  return (
    <main className="h-full bg-bg w-full flex flex-col overflow-hidden">
      {currentCategory.isSelected ? (
        <AllLessons />
      ) : (
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

          {/* Back to Classes Button */}
          <section className="flex-shrink-0 bg-secondary px-4 py-3 md:py-4 shadow-lg border-t border-primary/10">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleBack}
                className='group text-text relative w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 backdrop-blur-sm px-6 py-3 md:py-4 cursor-pointer rounded-2xl border-2 border-primary/40 font-bold text-base md:text-lg hover:border-primary hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3'
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
                  Back to Classes
                </span>
              </button>
            </div>
          </section>

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
                  <Loader />
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <ToastContainer />
    </main>
  );
};

export default AllCategories;
