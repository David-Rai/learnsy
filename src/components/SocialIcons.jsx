import supabase from '../config/supabase'
import { useUser } from '../context/userContext'
import React from 'react'
import {
    FaHeart,
    FaComment,
    FaBookmark,
    FaShare
} from 'react-icons/fa';

const SocialIcons = ({ q }) => {
    const { user, setUser } = useUser()
    const { like_count, id } = q

    //Handling like question
    const handleLike = async () => {
        try {
            console.log("user_id", user.id)
            console.log("question_id", id)
            const res = await supabase.from("likes")
                .insert({ user_id: user.id, q_id: id, likes: true })

        } catch (error) {
            console.log(error)
        }
    }

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
                <div className="flex flex-col items-center" onClick={handleLike}>
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <FaHeart className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-white text-xs md:text-sm font-medium drop-shadow-sm">{like_count}</span>
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