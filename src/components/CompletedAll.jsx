import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ToastContainer } from 'react-toastify';

const CompletedAll = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="relative w-full max-w-md mx-auto">
          {/* Card */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-3xl">
            
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 opacity-50" />

            {/* Card Content */}
            <div className="relative z-10 px-6 py-10 sm:px-8 sm:py-12 flex flex-col items-center text-center">
              
              {/* Icon Group */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <CheckCircle2 
                  className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 drop-shadow-lg" 
                  strokeWidth={2} 
                />
                <Sparkles 
                  className="w-9 h-9 sm:w-10 sm:h-10 text-yellow-400 animate-pulse drop-shadow-lg" 
                />
              </div>

              {/* Heading */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                All Questions Completed!
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-sm">
                Great work! You've completed all available questions.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate('/explore')}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                aria-label="Explore categories"
              >
                <span>Explore Categories</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Animated Dots */}
              <div className="flex gap-2 mt-8">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 dark:bg-green-800/30 rounded-full blur-2xl opacity-50" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 dark:bg-blue-800/30 rounded-full blur-2xl opacity-50" />

        </div>
      </main>
    </div>
  );
};

export default CompletedAll;
