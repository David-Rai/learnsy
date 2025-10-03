import { checkAnswer } from './checkAnswer';
import React from 'react'
import useHomeStore from '../context/store';


const Question = ({ q}) => {
    const {answers=[]}=useHomeStore()
    // console.log(answers)
    
    return (
        <>
            <div className="flex flex-col items-center justify-center h-[calc(100% - 80px)]
                             flex-1 relative z-10 max-w-lg w-full px-4">

                <h2 className="question-text">{q.q}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-items-center">

                    {q.options && q.options.length > 0 ? (
                        q.options.map((opt, i) => {
                            const answer = Array.isArray(answers)
                            ? answers.find((ans) => ans.id === q.id) || false
                            : false;
                          
                            let buttonClass = "option-button"; 

                            if (answer) {
                                if (answer.selectedOption === opt) {
                                    //showing the users answer
                                    buttonClass += answer.isCorrect ? " bg-right text-bg" : " bg-wrong text-bg";
                                    // buttonClass += answer.isCorrect ? " bg-right text-bg" : " bg-wrong text-bg";
                                } else {
                                    if (q.a === opt) {
                                        buttonClass += " bg-right text-bg"
                                    } else {
                                        buttonClass += " bg-secondary text-text"; // other options after answering
                                    }
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    className={buttonClass}
                                    onClick={() => checkAnswer(q, opt)}
                                    disabled={!!answer} // disable after answering
                                >
                                    {opt}
                                </button>
                            );
                        })
                    ) : (
                        <>
                            {["true", "false"].map((opt, i) => {
                                  const answer = Array.isArray(answers)
                                  ? answers.find((ans) => ans.id === q.id) || false
                                  : false;

                                let buttonClass = "option-button";

                                if (answer) {
                                    if (answer.selectedOption === opt) {
                                        buttonClass += answer.isCorrect ? " bg-right text-bg" : " bg-wrong text-bg";

                                    } else {
                                        buttonClass += " bg-secondary text-text";
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        className={buttonClass}
                                        onClick={() => checkAnswer(q, opt)}
                                        disabled={!!answer}
                                    >
                                        {opt === "true" ? "Yes" : "No"}
                                    </button>
                                );
                            })}
                        </>
                    )}

                </div>
            </div>
        </>
    )
}

export default Question