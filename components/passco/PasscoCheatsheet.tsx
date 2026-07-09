"use client";

import { useMemo, useRef, useState } from "react";
import PassQuestionCard, { type PassQuestion } from "./PassQuestionCard";
import { trackInteract } from "@/lib/track";

export default function PasscoCheatsheet({ questions }: { questions: PassQuestion[] }) {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function handleAnswered(id: string, correct: boolean) {
    setResults((prev) => (id in prev ? prev : { ...prev, [id]: correct }));
    markInteracted();
  }

  const answeredCount = Object.keys(results).length;
  const correctCount = useMemo(() => Object.values(results).filter(Boolean).length, [results]);

  return (
    <div className="space-y-4">
      <div className="sticky top-2 z-[5] flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-card-border bg-card px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <p className="text-sm font-semibold text-heading">
          Score: <span className="text-accent">{correctCount}</span> / {answeredCount} correct
        </p>
        <p className="text-xs text-secondary">
          {answeredCount} of {questions.length} answered
        </p>
      </div>
      {questions.map((item, i) => (
        <PassQuestionCard
          key={item.id}
          item={item}
          index={i}
          onAnswered={(correct) => handleAnswered(item.id, correct)}
        />
      ))}
    </div>
  );
}
