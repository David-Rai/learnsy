import React from 'react'
import { useNavigate } from 'react-router'
import supabase from '../../config/supabase'
import checkAdmin from '../../utils/checkAdmin'
import { CircleUser } from 'lucide-react'
import { Trash, Users, TrendingUp, Crown } from 'lucide-react';
import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const members=users.length > 0 ? users.filter(u=> u.role === 'member') : 0
  const total_members=members.length

  //Starting from heres
  const check = async () => {
    const res = await checkAdmin()
    if (!res) return navigate('/')
    getAllAuthUsers()
  }

  //Getting all the auth users
  useEffect(() => {
    check()
  }, [])

  //Getting users data
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
    console.log(data[0])
  }

  //Deleting the user/member
  const handleDelete=async (userId)=>{
    try {
      // 1️⃣ Delete related table rows
      const { error: rpcError } = await supabase.rpc('delete_user_cascade', { uid: userId });
      if (rpcError) throw rpcError;
  
      // 2️⃣ Delete main auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;
  
      console.log('User and all related data deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  }


  return (
    <main className='h-full w-full flex flex-row custom-scrollbar'>
      {/* main content here  */}
      <main className='h-full w-full flex flex-col overflow-y-scroll curstom-scrollbar'>

        {/* Users count */}
        <section className='w-full min-h-[40%] flex items-center justify-center py-4 gap-x-4 text-gray-300'>
          {/* Total users */}
          <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
              <div className='relative'>
                <CircleUser className='size-20 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6' />
                <div className='absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
              </div>
            </div>

            <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
              <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>Total users</p>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-foreground
               to-foreground/70 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
                {users.length > 0 ? (
                  <span className='inline-block tabular-nums' style={{ animation: 'countUp 0.5s ease-out' }}>
                    {users.length}
                  </span>
                ) : (
                  '0'
                )}
              </h1>
            </div>

            <div className='absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
          </div>

          {/* Total members */}
          <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-green-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1'>
            <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
              <div className='relative'>
                <CircleUser className='size-20 text-green-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6' />
                <div className='absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50' />
                <div className='absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
              </div>
            </div>

            <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
              <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>Active Now</p>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
                <span className='inline-block tabular-nums' style={{ animation: 'countUp 0.5s ease-out 0.1s both' }}>
                  {total_members}
                </span>
              </h1>
            </div>

            <div className='absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
          </div>

          {/* New users this week */}
          <div className='group relative h-full w-[30%] bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border border-transparent hover:border-blue-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <div className='h-full w-[40%] flex items-center justify-center relative z-10'>
              <div className='relative'>
                <CircleUser className='size-20 text-blue-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12' />
                <div className='absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full'>NEW</div>
                <div className='absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700' />
              </div>
            </div>

            <div className='flex flex-col h-full w-[60%] justify-center gap-1 items-start relative z-10 pr-4'>
              <p className='text-sm text-muted-foreground font-medium uppercase tracking-wide'>This Week</p>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110 origin-left'>
                <span className='inline-block tabular-nums' style={{ animation: 'countUp 0.5s ease-out 0.2s both' }}>
                  {users.length > 0 ? Math.floor(users.length * 0.15) : 0}  
                </span>
              </h1>
            </div>

            <div className='absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700' />
          </div>
        </section>


        {/* Chart for users answers//engagemenet */}
        <section>

        </section>


        {/* All User */}
        <section className='flex w-full flex-col gap-6 pl-5'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              All Users
            </h1>
            <div className='px-3 py-1 bg-primary/10 rounded-full'>
              <span className='text-sm font-medium text-primary'>{users.length}</span>
            </div>
          </div>

          {users.length > 0 ? (
            <div className='flex flex-col gap-3'>
              {users.map((u, index) => (
                <div
                  key={index}
                  className='group relative flex items-center justify-between bg-secondary/50 backdrop-blur-sm py-4 px-5 rounded-xl w-[65%] border border-transparent hover:border-primary/20 hover:bg-secondary/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5'
                  style={{
                    animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both`
                  }}
                >
                  {/* Rank Badge */}
                  <div className='flex items-center gap-4'>
                    <div className={`
              relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm
              ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950' : ''}
              ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' : ''}
              ${index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50' : ''}
              ${index > 2 ? 'bg-primary/10 text-primary' : ''}
              transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
            `}>
                      {index < 3 && (
                        <span className='absolute -top-1 -right-1 text-lg'>
                          {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      #{index + 1}
                    </div>

                    {/* User Info */}
                    <div className='flex flex-col gap-1'>
                      <span className='font-semibold text-base group-hover:text-primary transition-colors duration-300'>
                        {u.username}
                      </span>
                      <div className='flex items-center gap-2'>
                        <span className='inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-xs font-medium text-primary'>
                          {u.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Points Display */}
                  <div className='flex items-center gap-6'>
                    <div className='flex flex-col items-end'>
                      <span className='text-xs text-muted-foreground uppercase tracking-wide'>Points</span>
                      <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                        {u.point.toLocaleString()}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      className='relative flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95'
                      onClick={() => handleDelete(u.user_id)}
                      aria-label={`Delete ${u.username}`}
                    >
                      <Trash size={18} className='transition-transform duration-300 hover:rotate-12' />
                    </button>
                  </div>

                  {/* Shine effect on hover */}
                  <div className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden'>
                    <div className='absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-16 px-6 bg-secondary/30 rounded-2xl border-2 border-dashed border-secondary w-[65%]'>
              <div className='w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center'>
                <Users size={32} className='text-muted-foreground' />
              </div>
              <p className='text-lg font-medium text-muted-foreground mb-1'>No users yet</p>
              <p className='text-sm text-muted-foreground/70'>Users will appear here once they join</p>
            </div>
          )}

        </section>
      </main>
    </main >
  )
}

export default Dashboard