import BottomNav from './BottomNav'
import { ToastContainer } from 'react-toastify'
import React from 'react'

const CompletedAll = () => {
    return (
        <div className="home">
            <main className="h-full w-full overflow-y-scroll snap-y snap-mandatory pb-16">
                <div className="question-container relative max-w-lg w-full mx-auto my-8 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">

                    {/* Sidebar or category */}
                    <div className="absolute left-0 top-0 h-full w-2 bg-blue-500 rounded-l-xl"></div>

                    {/* Overlay */}
                    <div className="h-full w-full absolute inset-0 bg-black/10 rounded-xl" />

                    {/* Content */}
                    <div className="flex flex-col items-center justify-center relative z-10">
                        <h2 className="text-2xl font-bold mb-4">🎉 You have completed all questions!</h2>
                        <p className="text-gray-700 text-center">
                            No more questions left to answer. Come back later for new questions!
                        </p>
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