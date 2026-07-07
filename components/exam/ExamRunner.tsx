"use client";

import { useEffect, useRef, useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import { EXAM_TOPICS } from "@/lib/examBank";
import type { ShuffledQuestion } from "@/lib/shuffle";
import type { ExamConfig } from "@/lib/examProgress";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ExamRunner({
  questions,
  config,
  onFinish,
}: {
  questions: ShuffledQuestion[];
  config: ExamConfig;
  onFinish: (answers: (number | null)[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [secondsLeft, setSecondsLeft] = useState(config.minutes * 60);
  const finishedRef = useRef(false);

  const total = questions.length;
  const question = questions[index];
  const topicLabel = EXAM_TOPICS.find((t) => t.id === question.topic)?.label ?? question.topic;

  function finish(finalAnswers: (number | null)[]) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish(finalAnswers);
  }

  useEffect(() => {
    if (!config.timed) return;
    if (secondsLeft <= 0) {
      finish(answers);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.timed, secondsLeft]);

  function select(optionIndex: number) {
    if (answers[index] !== null) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
  }

  function next() {
    if (index + 1 >= total) {
      finish(answers);
      return;
    }
    setIndex((i) => i + 1);
  }

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-secondary">
          Question {index + 1} of {total}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full bg-muted text-xs font-medium text-body px-2.5 py-1">
            {topicLabel}
          </span>
          {config.timed && (
            <span
              className={`rounded-full text-xs font-semibold px-2.5 py-1 ${
                secondsLeft <= 30 ? "bg-error text-white" : "bg-accent text-white"
              }`}
            >
              ⏱ {formatTime(secondsLeft)}
            </span>
          )}
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-4">
        <p className="text-body font-medium whitespace-pre-wrap">{question.question}</p>

        {question.code && <CodeBlock code={question.code} />}

        <div className="space-y-2">
          {question.options.map((option, i) => {
            const chosen = answers[index];
            const answered = chosen !== null;
            const isChosen = i === chosen;
            const isCorrect = i === question.correctIndex;
            let style = "bg-white text-body border-card-border hover:border-accent";
            if (answered) {
              if (isCorrect) style = "bg-success text-white border-success";
              else if (isChosen) style = "bg-error text-white border-error";
              else style = "bg-white text-body border-card-border opacity-60";
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => select(i)}
                disabled={answered}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors break-words disabled:cursor-default ${style}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answers[index] !== null && (
          <div className="rounded-xl bg-muted p-4 space-y-2">
            <p className="text-sm text-body">
              <span
                className={
                  answers[index] === question.correctIndex ? "text-success font-semibold" : "text-error font-semibold"
                }
              >
                {answers[index] === question.correctIndex ? "Correct. " : "Not quite. "}
              </span>
              {question.explanation}
            </p>
            {question.misconception && (
              <p className="text-xs text-secondary">
                <span className="font-semibold">Common mistake: </span>
                {question.misconception}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ Previous
        </button>

        <button
          type="button"
          onClick={() => finish(answers)}
          className="text-xs font-medium text-secondary hover:text-error hover:underline"
        >
          Submit exam now
        </button>

        <button
          type="button"
          onClick={next}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          {index + 1 >= total ? "Submit exam" : "Next ▶"}
        </button>
      </div>
    </div>
  );
}
