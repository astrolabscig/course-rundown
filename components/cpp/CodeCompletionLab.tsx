"use client";

import { useEffect, useMemo, useState } from "react";
import CodeCompletionQuestionCard from "./CodeCompletionQuestionCard";
import { codeCompletionBank, ccTopics, type CCDifficulty } from "@/lib/cpp/codeCompletionBank";
import {
  getProgress,
  recordQuestionAttempt,
  resetProgress,
  computeStats,
  computeTopicStats,
  type CCProgressMap,
} from "@/lib/cpp/codeCompletionProgress";
import { trackInteract } from "@/lib/track";

const allTopicIds = ccTopics.map((t) => t.id);
const allDifficulties: CCDifficulty[] = ["beginner", "advanced-beginner", "intermediate"];
const difficultyLabel: Record<CCDifficulty, string> = {
  beginner: "Beginner",
  "advanced-beginner": "Advanced Beginner",
  intermediate: "Intermediate",
};

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function CodeCompletionLab() {
  const [progress, setProgress] = useState<CCProgressMap>({});
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set(allTopicIds));
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<CCDifficulty>>(new Set(allDifficulties));
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<typeof codeCompletionBank>([]);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const stats = useMemo(() => computeStats(progress, codeCompletionBank), [progress]);
  const topicStats = useMemo(() => computeTopicStats(progress, codeCompletionBank), [progress]);
  const weakTopicIds = useMemo(() => topicStats.filter((t) => t.weak && t.total > 0).map((t) => t.topic), [topicStats]);

  const filtered = useMemo(
    () =>
      codeCompletionBank.filter(
        (q) => selectedTopics.has(q.topic) && selectedDifficulties.has(q.difficulty)
      ),
    [selectedTopics, selectedDifficulties]
  );

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

  function toggleDifficulty(d: CCDifficulty) {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function startSession(questions: typeof codeCompletionBank) {
    if (questions.length === 0) return;
    setSessionQuestions(questions);
    setIndex(0);
    setStarted(true);
    trackInteract();
  }

  function startPractice() {
    startSession(filtered);
  }

  function startWeakAreas() {
    const weak = codeCompletionBank.filter((q) => weakTopicIds.includes(q.topic));
    startSession(weak);
  }

  function startRandomChallenge() {
    startSession(shuffled(filtered).slice(0, Math.min(20, filtered.length)));
  }

  function handleCheck(questionId: string, correct: boolean) {
    const next = recordQuestionAttempt(questionId, correct);
    setProgress({ ...next });
  }

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(sessionQuestions.length - 1, i)));
    trackInteract();
  }

  function endSession() {
    setStarted(false);
    trackInteract();
  }

  function handleResetProgress() {
    resetProgress();
    setProgress({});
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">Your progress</p>
            {stats.attemptedCount > 0 && (
              <button type="button" onClick={handleResetProgress} className="text-xs font-medium text-secondary hover:text-error hover:underline">
                Reset progress
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-semibold text-heading">{stats.solvedCount}</p>
              <p className="text-xs text-secondary">Solved</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-heading">{stats.completionPct}%</p>
              <p className="text-xs text-secondary">Complete</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-heading">{stats.totalAttempts}</p>
              <p className="text-xs text-secondary">Total attempts</p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${stats.completionPct}%` }} />
          </div>
          <p className="text-xs text-secondary">{stats.totalQuestions} questions total across 19 C++ fundamentals topics.</p>
        </div>

        <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-3">
          <p className="text-sm font-semibold text-heading">Quick start</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startPractice}
              disabled={filtered.length === 0}
              className="px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Practice filtered ({filtered.length})
            </button>
            <button
              type="button"
              onClick={startWeakAreas}
              disabled={weakTopicIds.length === 0}
              className="px-5 py-2.5 rounded-full border border-card-border text-sm font-semibold text-body hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={weakTopicIds.length === 0 ? "No weak topics detected yet — attempt some questions first" : undefined}
            >
              Practice weak topics
            </button>
            <button
              type="button"
              onClick={startRandomChallenge}
              disabled={filtered.length === 0}
              className="px-5 py-2.5 rounded-full border border-card-border text-sm font-semibold text-body hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Random challenge (20)
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">Filter by topic</p>
            <button type="button" onClick={toggleAllTopics} className="text-xs font-medium text-accent hover:underline">
              {selectedTopics.size === allTopicIds.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {ccTopics.map((t) => {
              const stat = topicStats.find((s) => s.topic === t.id);
              const count = codeCompletionBank.filter((q) => q.topic === t.id).length;
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
                  {stat && stat.weak && stat.total > 0 && (
                    <span className="text-[10px] font-semibold text-error px-1.5 py-0.5 rounded-full border border-error/40 bg-error/10">weak</span>
                  )}
                  <span className="text-xs text-secondary shrink-0">
                    {stat ? stat.solved : 0}/{count}
                  </span>
                </label>
              );
            })}
          </div>

          <p className="text-sm font-semibold text-heading pt-2">Filter by difficulty</p>
          <div className="flex flex-wrap gap-2">
            {allDifficulties.map((d) => (
              <label
                key={d}
                className="flex items-center gap-2 rounded-full border border-card-border px-3 py-1.5 text-sm cursor-pointer hover:border-accent transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedDifficulties.has(d)}
                  onChange={() => toggleDifficulty(d)}
                  className="shrink-0 accent-[var(--accent)]"
                />
                <span className="text-body">{difficultyLabel[d]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const question = sessionQuestions[index];
  const solvedInSession = sessionQuestions.filter((q) => progress[q.id]?.solved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span>
          Question {index + 1} of {sessionQuestions.length}
        </span>
        <span>
          Solved: {solvedInSession} / {sessionQuestions.length}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-accent transition-all" style={{ width: `${(solvedInSession / sessionQuestions.length) * 100}%` }} />
      </div>

      <div className="rounded-xl border border-card-border bg-card p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">Jump to any question</p>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {sessionQuestions.map((q, i) => {
            const p = progress[q.id];
            const isCurrent = i === index;
            let style = "border-card-border text-secondary hover:border-accent";
            if (isCurrent) style = "border-accent bg-accent text-white font-semibold";
            else if (p?.solved) style = "border-success bg-success/10 text-success";
            else if (p && p.attempts > 0) style = "border-error bg-error/10 text-error";
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => goTo(i)}
                title={`Question ${i + 1}${p?.solved ? " — solved" : p ? " — attempted" : " — not attempted"}`}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[11px] font-mono transition-colors ${style}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <CodeCompletionQuestionCard key={question.id} question={question} onCheck={(correct) => handleCheck(question.id, correct)} />

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
          disabled={index === sessionQuestions.length - 1}
          className="px-4 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
        <button
          type="button"
          onClick={endSession}
          className="ml-auto px-6 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
