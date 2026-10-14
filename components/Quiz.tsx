"use client";

import { useState } from "react";
import { Inline } from "@/lib/inline";

interface Question {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export function Quiz({ questions }: { questions: Question[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === questions[i].answer).length;

  return (
    <section className="quiz">
      <div className="quiz-head">
        <span className="challenge-kicker">Check your understanding</span>
        {answered === questions.length && (
          <span className={`quiz-score ${correct === questions.length ? "good" : ""}`}>
            {correct} / {questions.length} correct
            <button type="button" className="btn-ghost btn-xs" onClick={() => setPicked(questions.map(() => null))}>
              Retry
            </button>
          </span>
        )}
      </div>
      <ol className="quiz-list">
        {questions.map((q, qi) => {
          const choice = picked[qi];
          const done = choice !== null;
          return (
            <li key={qi} className="quiz-q">
              <p className="quiz-text">
                <Inline text={q.q} />
              </p>
              <div className="quiz-options" role="radiogroup">
                {q.options.map((opt, oi) => {
                  let cls = "quiz-opt";
                  if (done && oi === q.answer) cls += " is-right";
                  else if (done && oi === choice) cls += " is-wrong";
                  return (
                    <button
                      key={oi}
                      type="button"
                      role="radio"
                      aria-checked={choice === oi}
                      className={cls}
                      disabled={done}
                      onClick={() => setPicked((p) => p.map((x, i) => (i === qi ? oi : x)))}
                    >
                      <span className="quiz-letter">{String.fromCharCode(65 + oi)}</span>
                      <span>
                        <Inline text={opt} />
                      </span>
                    </button>
                  );
                })}
              </div>
              {done && (
                <p className={`quiz-why ${choice === q.answer ? "right" : "wrong"}`}>
                  <strong>{choice === q.answer ? "Correct. " : "Not quite. "}</strong>
                  <Inline text={q.why} />
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
