import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import BottomNav from './BottomNav';

const CompletedAll = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <main className="min-h-screen flex items-center justify-center pb-20 px-4">
        <div
          className="relative w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg 
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          flex flex-col items-center justify-center 
          transition-all duration-300 hover:shadow-xl"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10" />

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Icons */}
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Questions Completed
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Great work! You've completed all available questions. 
                Check back later for new content.
              </p>
            </div>

            {/* Loading Indicators */}
            <div className="flex gap-2 pt-2">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
      <ToastContainer />
    </div>
  );
};

export default CompletedAll;