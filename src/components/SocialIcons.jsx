import supabase from '../config/supabase'
import React, { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa';
import { Share2, Lightbulb } from 'lucide-react';
import useHomeStore from '../context/store';

const SocialIcons = ({ q }) => {
    const { user, setUser, hintVisible, setHintVisible, userLikes = [], setUserLikes, setCurrentHint } = useHomeStore()
    const { id } = q
    const [isLiking, setIsLiking] = useState(false)
    const isLiked = Array.isArray(userLikes) && userLikes.some(l => l.q_id === id);


    //Handling like question
    const handleLike = async () => {
        if (isLiking) return
        setIsLiking(true)

        const user_id = user?.id
        const q_id = id

        //Adding new like
        setUserLikes((userLikes) => {
            if (userLikes.some(l => l.q_id === id)) {
                console.log("remove like")
                return userLikes.filter(l => l.q_id !== id)

            }
            console.log("added new like")
            return [...userLikes, { q_id }]
        })

        try {
            // checking if liked
            if (!user.id) return
            const res = await supabase.from('likes')
                .select()
                .eq("user_id", user_id)
                .eq("q_id", q_id)

            //no liked
            if (res.data?.length === 0) {
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

    const handleHint = () => {
        setCurrentHint(q.hint)
        setHintVisible(!hintVisible)
    }

    return (
        <>
            {/* Social */}
            <div className=" w-full  flex justify-center items-center gap-4 z-20 py-3">
                {/* like */}
                <div className="flex flex-col items-center" onClick={handleLike}>
                    <button className="social-contain">
                        {isLiked ? (<FaHeart className="w-6 h-6 text-red-500" />)
                            :
                            (<FaHeart className="w-6 h-6 text-white" />)
                        }
                    </button>
                </div>

                {/* Hint */}
                <div className="flex flex-col items-center cursor-pointer"
                    onClick={handleHint}
                >
                    <button className='social-contain' >
                        <Lightbulb className='cursor-pointer' />
                    </button>
                </div>
            </div>
        </>
    )
}

export default SocialIcons