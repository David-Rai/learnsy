import React from 'react'
import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  return (
    <main className='home flex flex-row'>
      {/* Side navigation bar */}
      <Sidebar/>

      {/* main content here  */}
      <section>
        main content
      </section>
    </main>
  )
}

export default Dashboard