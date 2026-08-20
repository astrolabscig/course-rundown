"use client";

import { useMemo, useState } from "react";
import QuizQuestionCard, { type AnswerRecord } from "./QuizQuestionCard";
import { networkingQuizBank, quizConcepts, type QuizDifficulty } from "@/lib/networking/quizBank";
import { trackInteract } from "@/lib/track";

const difficultyRank: Record<QuizDifficulty, number> = { hard: 0, medium: 1, easy: 2 };
const allConceptIds = quizConcepts.map((c) => c.id);

export default function QuizRoom() {
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set(allConceptIds));
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerRecord | null)[]>([]);

  const questions = useMemo(() => {
    return networkingQuizBank
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
    setFinished(false);
    setIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    trackInteract();
  }

  function handleAnswered(record: AnswerRecord) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = record;
      return next;
    });
  }

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(questions.length - 1, i)));
    trackInteract();
  }

  function finish() {
    setFinished(true);
    trackInteract();
  }

  function restart() {
    setStarted(false);
    setFinished(false);
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
              const count = networkingQuizBank.filter((q) => q.concept === c.id).length;
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
            wherever the question needs one — subnetting math especially. Jump to any question with
            the number grid once you start, in any order, and finish whenever you&rsquo;re ready.
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

  if (finished) {
    const answered = answers.filter((a): a is AnswerRecord => a !== null);
    const score = answered.filter((a) => a.correct).length;
    const pct = Math.round((score / Math.max(1, answered.length)) * 100);
    const unanswered = questions.length - answered.length;
    return (
      <div className="rounded-2xl border border-card-border bg-card p-6 text-center space-y-4">
        <p className="text-2xl font-semibold text-heading">
          {score} / {answered.length} correct ({pct}%)
        </p>
        {unanswered > 0 && (
          <p className="text-sm text-secondary">
            {unanswered} question{unanswered === 1 ? "" : "s"} left unanswered out of {questions.length}.
          </p>
        )}
        <p className="text-sm text-body">
          {pct >= 80
            ? "Excellent work — you've got a strong grip on these concepts."
            : pct >= 50
            ? "Solid effort — review the explanations above for the ones you missed and try again."
            : "These concepts need more practice — re-read the room's relevant parts, then retry."}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setFinished(false)}
            className="px-6 py-2.5 rounded-full border border-card-border text-sm font-semibold text-body hover:border-accent transition-colors"
          >
            Review answers
          </button>
          <button
            type="button"
            onClick={restart}
            className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
          >
            Choose concepts again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[index];
  const conceptLabel = quizConcepts.find((c) => c.id === question.concept)?.label ?? question.concept;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span>
          {conceptLabel} — question {index + 1} of {questions.length}
        </span>
        <span>
          Answered: {answeredCount} / {questions.length}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-xl border border-card-border bg-card p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
          Jump to any question
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {questions.map((q, i) => {
            const rec = answers[i];
            const isCurrent = i === index;
            let style = "border-card-border text-secondary hover:border-accent";
            if (isCurrent) style = "border-accent bg-accent text-white font-semibold";
            else if (rec) style = rec.correct ? "border-success bg-success/10 text-success" : "border-error bg-error/10 text-error";
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => goTo(i)}
                title={`Question ${i + 1}${rec ? (rec.correct ? " — answered correctly" : " — answered incorrectly") : " — unanswered"}`}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[11px] font-mono transition-colors ${style}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <QuizQuestionCard key={question.id} question={question} savedAnswer={answers[index]} onAnswered={handleAnswered} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="px-4 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ Previous
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === questions.length - 1}
          className="px-4 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
        <button
          type="button"
          onClick={finish}
          className="ml-auto px-6 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Finish quiz
        </button>
      </div>
    </div>
  );
}
