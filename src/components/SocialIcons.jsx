import supabase from '../config/supabase'
import { useUser } from '../context/userContext'
import React, { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa';
import { Share2, Lightbulb } from 'lucide-react';

const SocialIcons = ({ q, setUserLikes, userLikes }) => {
    const { user, setUser } = useUser()
    const { id } = q
    const [isLiking, setIsLiking] = useState(false)
    const isLiked = userLikes.some(l => l.q_id === id);

    //Handling like question
    const handleLike = async () => {
        if (isLiking) return
        setIsLiking(true)

        const user_id = user?.id
        const q_id = id

        //Adding new like
        setUserLikes((prev) => {
            if (prev.some(l => l.q_id === id)) {
                console.log("remove like")
                return userLikes.filter(l => l.q_id !== id)

            }
            console.log("added new like")
            return [...prev, { q_id }]
        })

        try {
            // checking if liked
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

    //Handling share features
    const handleShare = () => {
        const url = `${window.location.href}/${id}`
        console.log("sharing", url)
    }

    return (
        <>
            {/* Social */}
            <div className="absolute w-full bottom-24 right-0 flex justify-center items-center gap-4 z-20">
                {/* like */}
                <div className="flex flex-col items-center" onClick={handleLike}>
                    <button className="bg-black/40 backdrop-blur-sm p-3
                     cursor-pointer rounded-full hover:bg-black/60
                      transition-all mb-1">
                        {isLiked ? (<FaHeart className="w-6 h-6 text-red-500" />)
                            :
                            (<FaHeart className="w-6 h-6 text-white" />)
                        }
                    </button>
                </div>
                {/* comment */}
                <div className="flex flex-col items-center cursor-pointer"
                    onClick={handleShare}
                >
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <Share2 className='cursor-pointer' />
                    </button>
                </div>

                {/* Hint */}
                <div className="flex flex-col items-center cursor-pointer"
                // onClick={handleShare}
                >
                    <button className="bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all mb-1">
                        <Lightbulb className='cursor-pointer' />
                    </button>
                </div>
            </div>
        </>
    )
}

export default SocialIcons