"use client";

import { useMemo, useState } from "react";
import QuizQuestionCard from "./QuizQuestionCard";
import { discreteMathsQuizBank, quizConcepts, type QuizDifficulty } from "@/lib/discreteMaths/quizBank";
import { trackInteract } from "@/lib/track";

const difficultyRank: Record<QuizDifficulty, number> = { hard: 0, medium: 1, easy: 2 };
const allConceptIds = quizConcepts.map((c) => c.id);

export default function QuizRoom() {
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set(allConceptIds));
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions = useMemo(() => {
    return discreteMathsQuizBank
      .filter((q) => selectedConcepts.has(q.concept))
      .slice()
      .sort((a, b) => {
        if (a.concept !== b.concept) return a.concept.localeCompare(b.concept);
        return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
      });
  }, [selectedConcepts]);

  function toggleConcept(id: string) {
    setSelectedConcepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedConcepts((prev) => (prev.size === allConceptIds.length ? new Set() : new Set(allConceptIds)));
  }

  function start() {
    if (questions.length === 0) return;
    setStarted(true);
    setIndex(0);
    setAnswers([]);
    trackInteract();
  }

  function handleAnswered(correct: boolean) {
    setAnswers((prev) => [...prev, correct]);
  }

  function next() {
    setIndex((i) => i + 1);
    trackInteract();
  }

  function restart() {
    setStarted(false);
    setIndex(0);
    setAnswers([]);
    trackInteract();
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">Filter by concept</p>
            <button type="button" onClick={toggleAll} className="text-xs font-medium text-accent hover:underline">
              {selectedConcepts.size === allConceptIds.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {quizConcepts.map((c) => {
              const count = discreteMathsQuizBank.filter((q) => q.concept === c.id).length;
              return (
                <label
                  key={c.id}
                  className="flex items-center gap-2 rounded-xl border border-card-border px-3 py-2 text-sm cursor-pointer hover:border-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedConcepts.has(c.id)}
                    onChange={() => toggleConcept(c.id)}
                    className="shrink-0 accent-[var(--accent)]"
                  />
                  <span className="flex-1 text-body">{c.label}</span>
                  <span className="text-xs text-secondary shrink-0">{count}q</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-secondary">
            Questions are ordered hardest-first within each concept, and mix multiple-choice with
            fill-in-the-blank. Every answer gets a full explanation, and a step-by-step solution
            where the question needs one.
          </p>
          <button
            type="button"
            onClick={start}
            disabled={questions.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start quiz ({questions.length} question{questions.length === 1 ? "" : "s"})
          </button>
        </div>
      </div>
    );
  }

  if (index >= questions.length) {
    const score = answers.filter(Boolean).length;
    const pct = Math.round((score / Math.max(1, answers.length)) * 100);
    return (
      <div className="rounded-2xl border border-card-border bg-card p-6 text-center space-y-4">
        <p className="text-2xl font-semibold text-heading">
          {score} / {answers.length} correct ({pct}%)
        </p>
        <p className="text-sm text-body">
          {pct >= 80
            ? "Excellent work — you've got a strong grip on these concepts."
            : pct >= 50
            ? "Solid effort — review the explanations above for the ones you missed and try again."
            : "These concepts need more practice — re-read the room's worked problems, then retry."}
        </p>
        <button
          type="button"
          onClick={restart}
          className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Choose concepts again
        </button>
      </div>
    );
  }

  const question = questions[index];
  const conceptLabel = quizConcepts.find((c) => c.id === question.concept)?.label ?? question.concept;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span>
          {conceptLabel} — question {index + 1} of {questions.length}
        </span>
        <span>
          Score: {answers.filter(Boolean).length} / {answers.length}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <QuizQuestionCard key={question.id} question={question} onAnswered={handleAnswered} />

      {answers.length > index && (
        <button
          type="button"
          onClick={next}
          className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          {index + 1 === questions.length ? "See results" : "Next question"}
        </button>
      )}
    </div>
  );
}
