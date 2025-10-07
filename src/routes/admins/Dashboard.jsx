import React from 'react'
import supabase from '../../config/supabase'
import Sidebar from '../../components/Sidebar'
import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [users, setUsers] = useState([])

  //Getting all the auth users
  useEffect(() => {
    async function getAllAuthUsers() {
      const { data, error } = await supabase
        .from('board')
        .select('*')
        .order("point", { ascending: false })
      if (error) {
        console.error('Error fetching auth users:', error)
        return []
      }

      setUsers(data)
      console.log(data)
      // return data.users
    }

    getAllAuthUsers()

  }, [])

  return (
    <main className='home flex flex-row'>
      {/* Side navigation bar */}
      <Sidebar />

      {/* main content here  */}
      <section>

        {/* Users count section */}
        <div>

        </div>

        {/* Chart for users answers//engagemenet */}
        <div>

        </div>


        {/* All users with CRUD features */}
        <section className='flex w-full flex-col'>
          {
            users.length > 0 ?
              users.map((u, index) =>
              (
                <div className='flex gap-2 ' key={index}>
                  <h1>{index + 1}</h1>
                  <p>{u.username}</p>
                  <p>Role-{u.role}</p>
                </div>
              ))
              :
              (
                <h1>No users</h1>
              )
          }
        </section>
      </section>
    </main >
  )
}

export default Dashboard