import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import supabase from '../config/supabase'
import useHomeStore from '../context/store'
import Loader from '../components/Loader'

const GotoProfile = () => {
  const user = useHomeStore(state => state.user)
  const setUser = useHomeStore(state => state.setUser)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
          setUser(currentUser)
          navigate(`/profile/${currentUser.id}`)
        } else {
          navigate("/signup")
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        navigate("/signup") // fallback
      }
    }

    if (!user || !user.id) {
      fetchUserData()
    } else {
      // User already exists in store
      navigate(`/profile/${user.id}`)
    }
  }, [user, setUser, navigate])

  return <Loader />
}

export default GotoProfile
