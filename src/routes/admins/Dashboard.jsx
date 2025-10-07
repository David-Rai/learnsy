import React from 'react'
import { useNavigate } from 'react-router'
import supabase from '../../config/supabase'
import Sidebar from '../../components/Sidebar'
import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  //checking vaidation of admin
  const checkAdmin = async () => {


  }
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
    checkAdmin()

  }, [])

  return (
    <main className='home flex flex-row'>
      {/* Side navigation bar */}
      <Sidebar />

      {/* main content here  */}
      <main>

        {/* Users count section */}
        <section>
          <div>
            <h1>Total users</h1>
            <p>{users.length > 0 ? users.length : 0}</p>
          </div>

          <div>
            <h1>Active users</h1>
            <p>{users.length > 0 ? users.length : 0}</p>
          </div>
        </section>

        {/* Chart for users answers//engagemenet */}
        <div>

        </div>


        {/* All users with CRUD features */}
        <section className='flex w-full flex-col gap-x-3'>
          {
            users.length > 0 ?
              users.map((u, index) =>
              (
                <div className='flex gap-2' key={index}>
                  <h1>{index + 1}</h1>
                  <p>{u.username}</p>
                  <p>Role-{u.role}</p>

                  <div>
                    <button className='button bg-wrong'>Delete</button>
                  </div>
                </div>
              ))
              :
              (
                <h1>No users</h1>
              )
          }
        </section>
      </main>
    </main >
  )
}

export default Dashboard