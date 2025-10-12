import React, { useState } from 'react';
import { Book, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import useHomeStore from '../context/store';
import supabase from '../config/supabase';

const Category = ({ c }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentCategory } = useHomeStore();
  const { name, image, totalquestion } = c;

  //Initial setup
  const handleStart = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('lesson', { distinct: true })
        .eq('category', name);

      if (error) throw error;

      const newLessons = [...new Set(data.map(item => item.lesson.trim()))];

      if (newLessons.length === 0) {
        toast.error('No lessons available for this category');
        return;
      }

      setCurrentCategory({
        isSelected: true,
        name,
        lessonOptions: newLessons
      });
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to load lessons. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div
      className="group relative
       flex flex-col w-full
        sm:w-[calc(50%-0.5rem)]
         md:w-[calc(33.333%-0.667rem)]
          lg:w-[280px] xl:w-[300px] h-[280px] rounded-2xl 
          overflow-hidden bg-gradient-to-b from-gray-800
           to-gray-900 shadow-xl hover:shadow-2xl transition-all 
           duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-4 focus:ring-green-500/50"
      onClick={handleStart}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${name} category with ${totalquestion || 0} questions`}
      aria-busy={isLoading}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-green-400 animate-spin" strokeWidth={2.5} />
            <span className="text-white text-sm font-medium">Loading lessons...</span>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-[65%] w-full overflow-hidden">
        <img
          src={image}
          alt={`${name} category illustration`}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%]" />

        {/* Question Count Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full border border-gray-700/50 transition-all duration-300 group-hover:bg-green-500/20 group-hover:border-green-500/50">
          <Sparkles className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
          <span className="text-white text-xs font-bold">{totalquestion || 0}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col justify-center flex-1 px-5 py-4 bg-gray-900">
        {/* Category Name */}
        <h2 className="text-white text-lg md:text-xl font-bold mb-3 truncate group-hover:text-green-400 transition-colors duration-300">
          {name}
        </h2>

        {/* Questions Info */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500/10 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
            <Book className="w-4.5 h-4.5 text-green-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
          </div>
          <span className="text-gray-300 group-hover:text-white text-sm md:text-base font-medium transition-colors duration-300">
            {totalquestion || 0} Questions
          </span>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>

      {/* Corner Glow Effect */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
    </div>
  );
};

export default Category;