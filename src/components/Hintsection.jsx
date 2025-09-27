import React from 'react'

const Hintsection = ({ hint, currentHint, setHint }) => {
    return (
        <>
            <div className={`
    transition-all duration-500 ease-in-out
    bg-secondary rounded-lg
    w-full py-5 px-4 md:px-8 absolute z-50
    left-0 shadow-lg
    ${hint ? "bottom-0 opacity-100" : "bottom-[-100%] opacity-0"}
    max-h-[50vh] md:max-h-[200px] overflow-y-auto
`}>
                {/* Toggle */}
                <div
                    onClick={() => setHint(!hint)}
                    className='cursor-pointer flex items-center justify-end gap-2 text-primary hover:text-text transition-colors duration-300 group mb-3'
                >
                    <span className='text-sm font-medium'>Close Hint</span>
                    <svg
                        className={`w-5 h-5 transform transition-transform duration-300 ${hint ? "rotate-0" : "rotate-180"}`}
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