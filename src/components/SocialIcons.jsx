import supabase from '../config/supabase'
import { useUser } from '../context/userContext'
import React, { useState } from 'react'
import {
    FaHeart,
    FaComment,
    FaBookmark,
    FaShare
} from 'react-icons/fa';

const SocialIcons = ({ q }) => {
    const { user, setUser } = useUser()
    const { like_count, id } = q
    const [isLiking, setIsLiking] = useState(false)

       //gettingn like count
       const getLikeCount = async (q_id) => {
        const { count, error } = await supabase
          .from('likes')
          .select('id', { count: 'exact' }) // get row count only
          .eq('q_id', q_id)
      
        if (error) {
          console.log('Error fetching like count:', error)
          return 0
        }
      
        return count || 0
      }

    //Handling like question
    const handleLike = async () => {
        try {
            if (isLiking) return
            setIsLiking(true)
            const user_id = user.id
            const q_id = id

            console.log(`${user_id} liked ${q_id}`)

            //checking if liked
            const res = await supabase.from('likes')
                .select()
                .eq("user_id", user_id)
                .eq("q_id", q_id)

            //no liked
            if (res.data.length === 0) {
                await supabase.from('likes').insert({ user_id, q_id })
            } else {
                //liked
                await supabase.from('likes').delete().eq("user_id", user_id).eq("q_id", q_id)
            }
            setIsLiking(false)
        } catch (error) {
            setIsLiking(false)
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