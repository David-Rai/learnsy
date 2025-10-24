import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Brain, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import useHomeStore from '../context/store';

const Intro = () => {
  const navigate = useNavigate();
  const { setIsIntroDone } = useHomeStore()
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      id: 1,
      question: "What's your learning style?",
      emoji: "🎯",
      options: [
        { text: "Quick 5-min bursts", icon: "⚡" },
        { text: "Deep dive sessions", icon: "🌊" },
        { text: "Challenge myself", icon: "🏆" },
        { text: "Learn with friends", icon: "👥" }
      ]
    },
    {
      id: 2,
      question: "What excites you most?",
      emoji: "✨",
      options: [
        { text: "Climbing leaderboards", icon: "📈" },
        { text: "Mastering new topics", icon: "🧠" },
        { text: "Earning achievements", icon: "🏅" },
        { text: "Beating my high score", icon: "🎮" }
      ]
    },
    {
      id: 3,
      question: "Pick your vibe",
      emoji: "🎨",
      options: [
        { text: "Science & Tech", icon: "🔬" },
        { text: "History & Culture", icon: "🏛️" },
        { text: "Entertainment", icon: "🎬" },
        { text: "Everything!", icon: "🌟" }
      ]
    }
  ];

  const handleSelect = (questionId, optionText, questionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionText }));

    // Auto-scroll to next section after selection
    setTimeout(() => {
      const nextSection = document.querySelectorAll('.snap-start')[questionIndex + 2];
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (currentQuestion < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 0);
  };


  //Checking is all answers completed or not
  const isComplete = Object.keys(selectedAnswers).length === questions.length;

  
  //All foen now redirecting to the category page
  const handleStart = () => {
    //settign user has seen  the intro page
    setIsIntroDone(true)

    //navigating to the explore page
    navigate('/explore')
  }

  return (
    <main className='flex flex-col h-screen bg-bg'>
      <div className="flex-1 overflow-y-auto custom-scrollbar snap-y snap-mandatory">
        {/* Hero Section */}
        <section className="h-full flex flex-col items-center justify-center px-6 text-text snap-start relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-2xl">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-secondary p-8 rounded-full shadow-2xl border-b-8 border-primary">
                <Brain className="w-16 h-16 md:w-20 md:h-20 text-primary animate-pulse" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 text-center drop-shadow-2xl">
              <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Learnsy
              </span>
            </h1>

            <p className="mb-8 text-lg md:text-xl text-center text-gray-300 font-medium">
              Let's personalize your quiz experience
            </p>

            <div className="bg-secondary/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-b-4 border-gray-700 mb-6">
              <p className="text-sm md:text-base text-center font-medium">
                Answer 3 quick questions to customize your journey 🚀
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-sm font-medium text-gray-400">Start scrolling</span>
              <ChevronDown className="w-6 h-6 text-primary" />
            </div>
          </div>
        </section>

        {/* Question Sections */}
        {questions.map((q, index) => (
          <section key={q.id} className="h-full flex flex-col items-center justify-center px-6 py-8 snap-start">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3 animate-bounce">{q.emoji}</div>
                <div className="text-xs font-bold text-primary mb-2">Question {index + 1}/3</div>
                <h2 className="text-2xl md:text-3xl font-black text-text mb-2">{q.question}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, option.text, index)}
                    className={`
                      group relative overflow-hidden
                      bg-secondary text-text p-4 rounded-2xl
                      border-b-4 transition-all duration-200
                      hover:scale-105 hover:border-b-2 hover:translate-y-1
                      active:scale-95 active:border-b-0 active:translate-y-2
                      ${selectedAnswers[q.id] === option.text
                        ? 'border-primary bg-primary/20 ring-4 ring-primary/50'
                        : 'border-gray-700 hover:bg-secondary/80'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{option.icon}</span>
                      <span className="font-bold text-base text-left">{option.text}</span>
                    </div>
                    {selectedAnswers[q.id] === option.text && (
                      <div className="absolute top-2 right-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedAnswers[q.id] && index < questions.length - 1 && (
                <div className="flex flex-col items-center gap-2 mt-12 animate-bounce">
                  <span className="text-sm font-medium text-gray-400">Keep scrolling</span>
                  <ChevronDown className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          </section>
        ))}

        {/* Final CTA Section */}
        <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 snap-start relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
            {isComplete ? (
              <>
                <div className="text-7xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-text">
                  You're All Set!
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8">
                  Your personalized quiz experience awaits
                </p>

                <button
                  onClick={handleStart}
                  className="group bg-right text-bg px-10 py-6 rounded-2xl font-black text-xl shadow-2xl border-b-8 border-green-700 hover:border-b-4 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all duration-100 flex items-center gap-3"
                >
                  Start Quizzing!
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="mt-12 flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-gray-400">Questions</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-green-400">50+</div>
                    <div className="text-sm text-gray-400">Categories</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-7xl mb-6">⬆️</div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-text">
                  Almost There!
                </h2>
                <p className="text-lg text-gray-300">
                  Scroll up and answer all questions to continue
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Intro;