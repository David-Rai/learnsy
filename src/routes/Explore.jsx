import React, { useState, useEffect, lazy } from 'react';
import LessonOptions from '../components/LessonOptions.jsx';
import Category from '../components/Category.jsx';
import { Book, ChevronLeft } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar.jsx';
import supabase from '../config/supabase.js';
import Hintsection from '../components/Hintsection.jsx';
import BottomNav from '../components/BottomNav.jsx';
import useHomeStore from '../context/store.js';

const SelectedCategory = lazy(() => import("../components/SelectedCategory.jsx"));

const Explore = () => {
  const {
    lessons = [],
    setLessons,
    setCategories,
    categories = [],
    setHintVisible,
    hintVisible,
    currentCategory,
    setCurrentCategory,
    currentLesson,
    setCurrentLesson
  } = useHomeStore();

  const [searchTerm, setSearchTerm] = useState(""); // state for search

  // fetch categories
  useEffect(() => {
    const get = async () => {
      const { error, data } = await supabase.rpc('get_categories_with_count');
      if (error) {
        console.error('Error fetching categories:', error);
        return setCategories([]);
      }
      setCategories(data);
    };
    get();
  }, []);

  // filter categories based on search term
  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handle back out of category
  const handleOutCategory = () => {
  
  }
  
  return (
    <main className="home custom-scrollbar fixed md:flex-row">
      <Sidebar />

      {currentCategory.isSelected ? (
        <div className="flex-1 flex flex-col relative overflow-hidden">
            <LessonOptions />
        </div>
      ) 
      : (
        <div className="flex-1 flex flex-col overflow-hidden">
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
            <div className="p-4 md:p-6 lg:p-8">
              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto">
                  {filteredCategories.map((c, index) => (
                    <Category c={c} key={c.id || index} />
                  ))}
                </div>
              ) :
                (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-xl md:text-2xl font-bold text-gray-400 mb-2">
                        No categories found 🔍
                      </p>
                      <p className="text-sm md:text-base text-gray-500">
                        Try adjusting your search
                      </p>
                    </div>
                  </div>
                )
              }
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
      <ToastContainer autoClose={100} />
    </main>
  );
};

export default Explore;




const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin"></div>
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  )
}
