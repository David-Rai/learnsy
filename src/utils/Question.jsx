import { checkAnswer } from "./checkAnswer";
import { useState, useEffect } from "react";
import React from "react";
import useHomeStore from "../context/store";

const Question = ({ q , questionIndex,handleScroll}) => {
  const { answers = [] } = useHomeStore();

  //handle check answer
  const handleAnswer = (q,opt) => {
    // console.log('checking answer',questionIndex)
    checkAnswer(q,opt);//checking the answer
    handleScroll(questionIndex)
  };
  
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center relative z-10 max-w-lg w-full px-4">

        {/* Questions */}
        <h2 className="question-text">{q.q}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-items-center">
          {/* options */}
          {q.options &&
            q.options.length > 0 &&
            q.options.map((opt, i) => {
              const answer = Array.isArray(answers)
                ? answers.find((ans) => ans.id === q.id) || false
                : false;

              let buttonClass = "option-button";

              if (answer) {
                if (answer.selectedOption === opt) {
                  //showing the users answer
                  buttonClass += answer.isCorrect
                    ? " bg-right text-bg"
                    : " bg-wrong text-bg";
                  // buttonClass += answer.isCorrect ? " bg-right text-bg" : " bg-wrong text-bg";
                } else {
                  if (q.a === opt) {
                    buttonClass += " bg-right text-bg";
                  } else {
                    buttonClass += " bg-secondary text-text"; // other options after answering
                  }
                }
              }

              return (
                <button
                  key={i}
                  className={buttonClass}
                  onClick={() => handleAnswer(q, opt,)}
                  disabled={!!answer} // disable after answering
                >
                  {opt}
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Question;
