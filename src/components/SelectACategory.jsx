import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

const SelectACategory = () => {
    const navigate = useNavigate()

    return (
        <main className='home flex flex-col md:flex-row h-screen bg-bg'>

            <Sidebar />

            {/* Main content - centered and fully responsive */}
            <section className='flex flex-1 w-full items-center justify-center px-6 sm:px-8 lg:px-12 pb-24'>
                <div className='max-w-lg w-full text-center space-y-6 sm:space-y-8'>
                    {/* Heading with clean typography */}
                    <div className='space-y-2 sm:space-y-3'>
                        <h1
                            className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text'
                        >
                            Ready to explore?
                        </h1>
                        <p
                            className='text-sm sm:text-base md:text-lg opacity-75 max-w-md mx-auto text-text'
                        >
                            Select a category to begin your scrolling journey
                        </p>
                    </div>

                    {/* Minimal CTA button with subtle Duolingo-style interactions */}
                    <button
                        onClick={() => navigate('/explore')}
                        className='group w-full sm:w-auto inline-flex items-center text-text bg-primary justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg)]'
                        style={{
                            color: 'var(--text)',
                            focusRingColor: 'var(--primary)'
                        }}
                        aria-label="Explore categories"
                    >
                        <span>Explore Categories</span>
                        <ArrowRight
                            className='w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5'
                            aria-hidden="true"
                        />
                    </button>

                    {/* Minimal decorative hint */}
                    <p
                        className='text-xs sm:text-sm opacity-50 pt-2'
                        style={{ color: 'var(--text)' }}
                    >
                        Discover something new today
                    </p>
                </div>
            </section>

            {/* Bottom navigation - always accessible */}
            <BottomNav />
        </main>
    )
}

export default SelectACategory