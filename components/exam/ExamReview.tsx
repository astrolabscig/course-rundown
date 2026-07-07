"use client";

import CodeBlock from "@/components/CodeBlock";
import type { ShuffledQuestion } from "@/lib/shuffle";

export default function ExamReview({
  questions,
  answers,
  topics,
  roomPath,
  onBack,
}: {
  questions: ShuffledQuestion[];
  answers: (number | null)[];
  topics: { id: string; label: string }[];
  roomPath: string;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
      >
        ◀ Back to results
      </button>

      <div className="space-y-6">
        {questions.map((q, i) => {
          const selected = answers[i];
          const topicLabel = topics.find((t) => t.id === q.topic)?.label ?? q.topic;
          const wasCorrect = selected === q.correctIndex;
          return (
            <div key={q.id} className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-secondary">
                  Question {i + 1} · {topicLabel} · Difficulty {q.difficulty}
                </span>
                <span className={`font-semibold ${wasCorrect ? "text-success" : "text-error"}`}>
                  {selected === null ? "Not answered" : wasCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>

              <p className="text-body font-medium whitespace-pre-wrap">{q.question}</p>

              {q.code && <CodeBlock code={q.code} />}

              <div className="space-y-2">
                {q.options.map((option, optIndex) => {
                  const isCorrect = optIndex === q.correctIndex;
                  const isChosen = optIndex === selected;
                  let style = "bg-white text-body border-card-border";
                  if (isCorrect) style = "bg-success text-white border-success";
                  else if (isChosen) style = "bg-error text-white border-error";
                  return (
                    <div
                      key={optIndex}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium break-words ${style}`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl bg-muted p-4 space-y-2">
                <p className="text-sm text-body">{q.explanation}</p>
                {q.misconception && (
                  <p className="text-xs text-secondary">
                    <span className="font-semibold text-heading">Common misconception: </span>
                    {q.misconception}
                  </p>
                )}
                <a
                  href={`${roomPath}#${q.relatedPartId}`}
                  className="inline-block text-xs font-medium text-accent hover:underline"
                >
                  Review this lesson →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
      >
        ◀ Back to results
      </button>
    </div>
  );
}
