"use client";

import { useMemo, useState } from "react";
import PracticeBankQuestionCard, { type PracticeAnswerRecord } from "./PracticeBankQuestionCard";
import { csm152PracticeBank, practiceModules } from "@/lib/networking/practiceBank";
import { trackInteract } from "@/lib/track";

const allModuleIds = practiceModules.map((m) => m.id);

export default function PracticeBankRoom() {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(allModuleIds));
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(PracticeAnswerRecord | null)[]>([]);

  // Preserve the bank's own order (source order within each module already
  // runs Tier A -> B -> C, a deliberate foundational-to-diagnostic progression).
  const questions = useMemo(() => {
    return csm152PracticeBank.filter((q) => selectedModules.has(q.module));
  }, [selectedModules]);

  function toggleModule(id: string) {
    setSelectedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedModules((prev) => (prev.size === allModuleIds.length ? new Set() : new Set(allModuleIds)));
  }

  function start() {
    if (questions.length === 0) return;
    setStarted(true);
    setFinished(false);
    setIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    trackInteract();
  }

  function handleAnswered(record: PracticeAnswerRecord) {
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
            <p className="text-sm font-semibold text-heading">Filter by module</p>
            <button type="button" onClick={toggleAll} className="text-xs font-medium text-accent hover:underline">
              {selectedModules.size === allModuleIds.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {practiceModules.map((m) => {
              const count = csm152PracticeBank.filter((q) => q.module === m.id).length;
              return (
                <label
                  key={m.id}
                  className="flex items-center gap-2 rounded-xl border border-card-border px-3 py-2 text-sm cursor-pointer hover:border-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.has(m.id)}
                    onChange={() => toggleModule(m.id)}
                    className="shrink-0 accent-[var(--accent)]"
                  />
                  <span className="flex-1 text-body">{m.label}</span>
                  <span className="text-xs text-secondary shrink-0">{count}q</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-secondary">
            Within each module, questions run Tier A (foundational) → Tier B (applied scenarios) →
            Tier C (diagnostic/integration) — the order they were designed to be worked through in.
            Several items are &ldquo;select all that apply.&rdquo; Jump to any question with the
            number grid once you start, and finish whenever you&rsquo;re ready.
          </p>
          <button
            type="button"
            onClick={start}
            disabled={questions.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start ({questions.length} question{questions.length === 1 ? "" : "s"})
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const answered = answers.filter((a): a is PracticeAnswerRecord => a !== null);
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
            ? "Excellent work — you've got a strong grip on this material."
            : pct >= 50
            ? "Solid effort — review the explanations above for the ones you missed and try again."
            : "This module needs more practice — re-read the relevant room parts, then retry."}
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
            Choose modules again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[index];
  const moduleLabel = practiceModules.find((m) => m.id === question.module)?.label ?? question.module;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span>
          {moduleLabel} — question {index + 1} of {questions.length}
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

      <PracticeBankQuestionCard key={question.id} question={question} savedAnswer={answers[index]} onAnswered={handleAnswered} />

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
          Finish
        </button>
      </div>
    </div>
  );
}
