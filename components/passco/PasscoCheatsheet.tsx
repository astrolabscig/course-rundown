"use client";

import { useMemo, useRef, useState } from "react";
import PassQuestionCard, { type PassQuestion } from "./PassQuestionCard";
import { trackInteract } from "@/lib/track";

export default function PasscoCheatsheet({
  questions,
  sections,
}: {
  questions: PassQuestion[];
  sections?: { id: string; label: string }[];
}) {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
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

  const visibleQuestions = useMemo(
    () => (activeSection ? questions.filter((q) => q.section === activeSection) : questions),
    [questions, activeSection]
  );

  const answeredCount = Object.keys(results).length;
  const correctCount = useMemo(() => Object.values(results).filter(Boolean).length, [results]);

  return (
    <div className="space-y-4">
      <div className="sticky top-2 z-[5] space-y-3 rounded-2xl border border-card-border bg-card px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-heading">
            Score: <span className="text-accent">{correctCount}</span> / {answeredCount} correct
          </p>
          <p className="text-xs text-secondary">
            {answeredCount} of {questions.length} answered
          </p>
        </div>
        {sections && sections.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeSection === null
                  ? "bg-accent text-white border-accent"
                  : "bg-card text-body border-card-border hover:border-accent"
              }`}
            >
              All ({questions.length})
            </button>
            {sections.map((s) => {
              const count = questions.filter((q) => q.section === s.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    activeSection === s.id
                      ? "bg-accent text-white border-accent"
                      : "bg-card text-body border-card-border hover:border-accent"
                  }`}
                >
                  {s.label} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>
      {visibleQuestions.map((item, i) => (
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
