import React from 'react'
import { useUser } from '.././context/userContext'
import supabase from '../config/supabase'
import BottomNav from '../components/BottomNav'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'

const Profile = () => {
    const { user, setUser } = useUser()
    const navigate = useNavigate()

    //checking user
    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                console.log("user existed")
            } else {
                navigate("/signup")
            }
        }
        checkUser()
    }, [])
    return (
        <main className='home'>


            {/* Bottom navigation */}
            <BottomNav />
        </main>
    )
}

export default Profile