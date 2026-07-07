"use client";

import { useState } from "react";
import { EXAM_TOPICS, examBank, type ExamTopic } from "@/lib/examBank";
import type { ExamConfig, ExamAttemptRecord } from "@/lib/examProgress";
import { computeTopicAccuracy, computeStreak, computeXp, computeLevel } from "@/lib/examProgress";

const ALL_TOPIC_IDS = EXAM_TOPICS.map((t) => t.id);

export default function ExamConfigurator({
  history,
  onStart,
}: {
  history: ExamAttemptRecord[];
  onStart: (config: ExamConfig) => void;
}) {
  const [topics, setTopics] = useState<Set<ExamTopic>>(new Set(ALL_TOPIC_IDS));
  const [questionCount, setQuestionCount] = useState(20);
  const [timed, setTimed] = useState(true);
  const [minutes, setMinutes] = useState(15);
  const [negativeMarking, setNegativeMarking] = useState(false);

  const availableCount = examBank.filter((q) => topics.has(q.topic)).length;
  const xp = computeXp(history);
  const level = computeLevel(xp);
  const streak = computeStreak(history);
  const accuracy = computeTopicAccuracy(history);
  const weakTopics = accuracy.filter((a) => a.weak);

  function toggleTopic(topic: ExamTopic) {
    setTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  function toggleAll() {
    setTopics((prev) => (prev.size === ALL_TOPIC_IDS.length ? new Set() : new Set(ALL_TOPIC_IDS)));
  }

  function handleStart() {
    if (topics.size === 0 || availableCount === 0) return;
    onStart({
      topics: Array.from(topics),
      questionCount: Math.max(1, Math.min(questionCount, availableCount)),
      timed,
      minutes: Math.max(1, minutes),
      negativeMarking,
    });
  }

  return (
    <div className="space-y-6">
      {history.length > 0 && (
        <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent text-white text-xs font-semibold px-3 py-1">
              Level {level}
            </span>
            <span className="text-sm text-secondary">{xp} XP earned across all attempts</span>
            {streak > 0 && (
              <span className="rounded-full bg-accent-warm-bg text-accent-warm text-xs font-semibold px-3 py-1">
                🔥 {streak} day streak
              </span>
            )}
          </div>
          {weakTopics.length > 0 && (
            <p className="mt-3 text-sm text-body">
              Weakest so far:{" "}
              {weakTopics.map((w) => EXAM_TOPICS.find((t) => t.id === w.topic)?.label).join(", ")}
              {" "}— consider selecting just those topics below for focused practice.
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-heading">Topics</p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-medium text-accent hover:underline"
            >
              {topics.size === ALL_TOPIC_IDS.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAM_TOPICS.map((t) => {
              const count = examBank.filter((q) => q.topic === t.id).length;
              const stat = accuracy.find((a) => a.topic === t.id);
              return (
                <label
                  key={t.id}
                  className="flex items-center gap-2 rounded-xl border border-card-border px-3 py-2 text-sm cursor-pointer hover:border-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={topics.has(t.id)}
                    onChange={() => toggleTopic(t.id)}
                    className="shrink-0 accent-[var(--accent)]"
                  />
                  <span className="flex-1 text-body">{t.label}</span>
                  <span className="text-xs text-secondary shrink-0">
                    {count}q{stat ? ` · ${stat.pct}%` : ""}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="exam-count" className="block text-sm font-semibold text-heading mb-1.5">
              Number of questions
            </label>
            <input
              id="exam-count"
              type="number"
              min={1}
              max={availableCount || 1}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full rounded-xl border border-card-border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-secondary">{availableCount} available in selected topics</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-heading mb-1.5">Timer</p>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-sm text-body">
                <input
                  type="checkbox"
                  checked={timed}
                  onChange={(e) => setTimed(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                Timed
              </label>
              {timed && (
                <input
                  type="number"
                  min={1}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-20 rounded-xl border border-card-border px-2 py-1.5 text-sm"
                  aria-label="Minutes"
                />
              )}
              {timed && <span className="text-sm text-secondary">min</span>}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-body">
          <input
            type="checkbox"
            checked={negativeMarking}
            onChange={(e) => setNegativeMarking(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          Negative marking (−0.25 per wrong answer, like some real exams)
        </label>

        <button
          type="button"
          onClick={handleStart}
          disabled={topics.size === 0 || availableCount === 0}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start exam
        </button>
      </div>
    </div>
  );
}
