import BottomNav from './BottomNav'
import { ToastContainer } from 'react-toastify'
import React from 'react'

const CompletedAll = () => {
    return (
        <div className="relative h-screen w-full bg-gray-50 dark:bg-gray-900
         text-gray-800 dark:text-gray-100 overflow-hidden">
            <main className="h-full w-full flex items-center justify-center pb-16">

                <div className=" relative max-w-lg w-full 
                mx-auto my-8 p-8 rounded-xl shadow-lg flex
                 flex-col items-center justify-center animate-bounce-slow
                 ">


                    {/* Overlay */}
                    <div className="h-full w-full absolute rounded-xl" />

                    {/* Content */}
                    <div className="flex flex-col items-center justify-center relative z-10 text-center">
                        <h2 className="text-3xl font-bold mb-4 text-green-600 animate-pulse">
                            🎉 Congratulations! 🎉
                        </h2>
                        <p className="text-gray-700 mb-6">
                            You have completed all questions. Come back later for new challenges!
                        </p>
                        <div className="flex gap-2 justify-center">
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-0"></span>
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-200"></span>
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-400"></span>
                        </div>
                    </div>
                </div>

            </main>

            {/* Bottom navigation */}
            <BottomNav />
            <ToastContainer autoClose={100} />
        </div>

    )
}

export default CompletedAll