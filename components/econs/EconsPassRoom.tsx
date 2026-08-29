"use client";

import { useMemo, useState } from "react";
import EconsPassQuestionCard, { type EconsPassAnswerRecord } from "./EconsPassQuestionCard";
import { ECONS_PASS_SECTIONS, type EconsPassIndexedQuestion } from "@/lib/econs/passcoBank";
import { trackInteract } from "@/lib/track";

const allTopicIds = ECONS_PASS_SECTIONS.map((t) => t.id);

export default function EconsPassRoom({ bank }: { bank: EconsPassIndexedQuestion[] }) {
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set(allTopicIds));
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(EconsPassAnswerRecord | null)[]>([]);

  const questions = useMemo(() => bank.filter((q) => selectedTopics.has(q.topic)), [bank, selectedTopics]);

  function toggleTopic(id: string) {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllTopics() {
    setSelectedTopics((prev) => (prev.size === allTopicIds.length ? new Set() : new Set(allTopicIds)));
  }

  function start() {
    if (questions.length === 0) return;
    setStarted(true);
    setFinished(false);
    setIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    trackInteract();
  }

  function handleAnswered(record: EconsPassAnswerRecord) {
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
            <p className="text-sm font-semibold text-heading">Filter by topic</p>
            <button type="button" onClick={toggleAllTopics} className="text-xs font-medium text-accent hover:underline">
              {selectedTopics.size === allTopicIds.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {ECONS_PASS_SECTIONS.map((t) => {
              const count = bank.filter((q) => q.topic === t.id).length;
              return (
                <label
                  key={t.id}
                  className="flex items-center gap-2 rounded-xl border border-card-border px-3 py-2 text-sm cursor-pointer hover:border-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.has(t.id)}
                    onChange={() => toggleTopic(t.id)}
                    className="shrink-0 accent-[var(--accent)]"
                  />
                  <span className="flex-1 text-body">{t.label}</span>
                  <span className="text-xs text-secondary shrink-0">{count}q</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-secondary">
            Every question is a real past-exam question, deduplicated and independently re-verified —
            where that check found a likely error or genuine ambiguity in the source, it&rsquo;s
            flagged right on the question once you answer.
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
    const answered = answers.filter((a): a is EconsPassAnswerRecord => a !== null);
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
            ? "Excellent work — you have a strong grip on this material."
            : pct >= 50
              ? "Solid effort — review the explanations above for the ones you missed and try again."
              : "This section needs more practice — re-read the relevant lesson, then retry."}
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
            Choose topics again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[index];
  const topicLabel = ECONS_PASS_SECTIONS.find((t) => t.id === question.topic)?.label ?? question.topic;
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLastQuestion = index === questions.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span>
          {topicLabel} — question {index + 1} of {questions.length}
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
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">Jump to any question</p>
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

      <EconsPassQuestionCard key={question.id} question={question} savedAnswer={answers[index]} onAnswered={handleAnswered} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="px-6 py-2.5 rounded-full border border-card-border text-base font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ Previous
        </button>
        {/* Next sits on the right until the final question, where Finish takes
            its place — so Finish never appears alongside Next and can't be
            clicked by mistake partway through. */}
        {isLastQuestion ? (
          <button
            type="button"
            onClick={finish}
            className="ml-auto px-6 py-2.5 rounded-full bg-accent text-white text-base font-semibold hover:bg-accent-hover transition-colors"
          >
            Finish
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="ml-auto px-6 py-2.5 rounded-full border border-card-border text-base font-medium text-body hover:border-accent transition-colors"
          >
            Next ▶
          </button>
        )}
      </div>
    </div>
  );
}
