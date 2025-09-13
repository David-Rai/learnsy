import React from 'react'

const HomeTop = ({category}) => {
    return (
        <>
            <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
                {/* Profile */}
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-black font-bold text-sm">Q</span>
                </div>
                <div>
                    <p className="text-white font-semibold text-sm md:text-base drop-shadow-md">
                        quizmaster_pro
                    </p>
                </div>
            </div>

            {/* Category and Type - Top Right */}
            <div className="absolute top-4 right-4 flex flex-col items-end z-20 gap-1">
                <span className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white/80 text-xs md:text-sm drop-shadow-sm">
                    {category}
                </span>
            </div>
        </>
    )
}

export default HomeTop