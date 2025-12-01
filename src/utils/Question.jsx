import { checkAnswer } from "./checkAnswer";
import React, { useMemo } from "react";
import useHomeStore from "../context/store";

const Question = ({ q, questionIndex, handleScroll }) => {
  const { answers = [] } = useHomeStore();

  const shuffledOptions = useMemo(() => {
    const arr = [...q.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [q.id]);

  const handleAnswer = (question, opt) => {
    checkAnswer(question, opt);
    handleScroll(questionIndex);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center relative z-10 max-w-lg w-full px-4">
      <h2 className="question-text">{q.q}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-items-center">
        {shuffledOptions.map((opt, i) => {
          const answer = answers.find((ans) => ans.id === q.id);
          let buttonClass = "option-button";

          if (answer) {
            if (answer.selectedOption === opt) {
              buttonClass += answer.isCorrect
                ? " bg-right text-bg"
                : " bg-wrong text-bg";
            } else {
              buttonClass += q.a === opt
                ? " bg-right text-bg"
                : " bg-secondary text-text border-[oklch(35%_0.042_265.755)]";
            }
          }

          return (
            <button
              key={i}
              className={buttonClass}
              onClick={() => handleAnswer(q, opt)}
              disabled={!!answer}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Question;
