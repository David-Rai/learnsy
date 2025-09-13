import React from 'react'
import {
    FaHome,
    FaCompass,
    FaUser,
    FaChartLine,
    FaHeart,
    FaComment,
    FaBookmark,
    FaShare,
    FaPlus
} from 'react-icons/fa';

const SocialIcons = () => {
    return (
        <>
            {/* Social */}
            <div className="absolute bottom-24 right-4 flex flex-col gap-4 z-20">
                {/* profile */}
                <div className="flex flex-col items-center">
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <FaHeart className="w-6 h-6 text-white" />
                    </button>
                </div>
                {/* like */}
                <div className="flex flex-col items-center">
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <FaHeart className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">12.3K</span>
                </div>
                {/* comment */}
                <div className="flex flex-col items-center">
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <FaComment className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">847</span>
                </div>
                {/* saved */}
                <div className="flex flex-col items-center">
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <FaBookmark className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">3.2K</span>
                </div>
                {/* shared */}
                <div className="flex flex-col items-center">
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <FaShare className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">Share</span>
                </div>
            </div>
        </>
    )
}

export default SocialIcons