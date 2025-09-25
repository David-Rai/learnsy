import React, { useState } from 'react';
import Loader from '../components/Loader';
import { Search, Home, User, BarChart3, Compass } from 'lucide-react'; // replace Explore with Compass
import BottomNav from '../components/BottomNav';

const ExploreComponent = () => {
  const [searchValue, setSearchValue] = useState('');

  const subjects = [
    { name: 'Mathematics', quizCount: 12, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop' },
    { name: 'Science', quizCount: 8, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop' },
    { name: 'History', quizCount: 15, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop' },
    { name: 'Literature', quizCount: 10, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop' },
    { name: 'Geography', quizCount: 7, image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=400&h=400&fit=crop' },
    { name: 'Art', quizCount: 5, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop' }
  ];


  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-bg text-text">
      <div className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-bg backdrop-blur-sm">
          <div className="flex items-center p-4 pb-2 justify-between">
            <div className="flex w-12"></div>
            <h1 className="text-white text-xl font-bold leading-tight tracking-tight flex-1 text-center">
              Explore
            </h1>
            <div className="flex w-12 items-center justify-end">
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-white/80 hover:bg-white/10 transition-colors duration-200">
                <Search size={24} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3">
            <div className="relative flex flex-col min-w-40 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-12 bg-white/5 border-none focus-within:ring-2 focus-within:ring-blue-400">
                <div className="text-white/50 flex items-center justify-center pl-4">
                  <Search size={24} />
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 
                  py-3
                  resize-none overflow-hidden bg-transparent text-white/90 focus:outline-none border-none placeholder:text-white/50 px-4 pl-3 text-base font-normal leading-normal"
                  placeholder="Search for categories"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <h2 className="text-white text-2xl font-bold leading-tight tracking-tight pb-4">
            Subjects
          </h2>

          {/* Subjects Grid */}
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <a key={index} className="group cursor-pointer" href="#">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    style={{
                      backgroundImage: `url("${subject.image}")`
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <p className="text-white text-lg font-semibold mt-2">
                  {subject.name}
                </p>
                <p className="text-white/60 text-sm">
                  {subject.quizCount} Quizzes
                </p>
              </a>
            ))}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default ExploreComponent;
