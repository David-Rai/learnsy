import React from 'react'
import BottomNav from './BottomNav'

const Loader = () => {
    return (
        <main className='home flex'>
            <div className="flex items-center justify-center h-full">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin"></div>
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
            </div>
            {/* <BottomNav /> */}
        </main>
    )
}

export default Loader