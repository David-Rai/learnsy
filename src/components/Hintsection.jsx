import React from 'react'
import useHomeStore from '../context/store'


const Hintsection = ({ }) => {
    const { hintVisible, currentHint, setHintVisible } = useHomeStore()

    return (
        <>
            <div className={`
    fixed left-0 bottom-0 w-full md:max-w-md
    bg-secondary rounded-t-xl p-5 md:p-8 shadow-lg
    transform transition-transform duration-500 ease-in-out
    ${hintVisible ? "translate-y-0" : "translate-y-full"}
    z-50  h-[40vh] md:max-h-[200px]
`}>

                {/* Toggle */}
                <div
                    onClick={() => setHintVisible(!hintVisible)}
                    className='cursor-pointer flex items-center justify-end gap-2 text-primary hover:text-text transition-colors duration-300 group mb-3'
                >
                    <span className='text-sm font-medium'>Close Hint</span>
                    <svg
                        className={`w-5 h-5 transform transition-transform duration-300 ${hintVisible ? "rotate-0" : "rotate-180"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </div>

                {/* Hint description here */}
                <div className="flex items-start gap-3">
                    <svg
                        className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-text text-sm md:text-base leading-relaxed">
                        {currentHint}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hintsection