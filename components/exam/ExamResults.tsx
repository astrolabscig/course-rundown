"use client";

import Link from "next/link";
import { EXAM_TOPICS } from "@/lib/examBank";
import type { ExamAttemptRecord } from "@/lib/examProgress";
import { computeXp, computeLevel } from "@/lib/examProgress";

const PASS_THRESHOLD_PCT = 60;

export default function ExamResults({
  record,
  history,
  onReview,
  onRetry,
}: {
  record: ExamAttemptRecord;
  history: ExamAttemptRecord[];
  onReview: () => void;
  onRetry: () => void;
}) {
  const pct = Math.round((Math.max(0, record.rawScore) / record.totalQuestions) * 100);
  const passed = pct >= PASS_THRESHOLD_PCT;
  const xp = computeXp(history);
  const level = computeLevel(xp);

  const topicRows = Object.entries(record.topicBreakdown) as [string, { correct: number; total: number }][];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8 text-center space-y-3">
        <p className={`text-sm font-semibold uppercase tracking-wide ${passed ? "text-success" : "text-error"}`}>
          {passed ? "Pass" : "Not yet — keep practicing"}
        </p>
        <p className="text-4xl font-bold text-heading">{pct}%</p>
        <p className="text-sm text-secondary">
          {record.correctCount} / {record.totalQuestions} correct
          {record.config.negativeMarking && ` · raw score ${record.rawScore.toFixed(2)} after negative marking`}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="rounded-full bg-accent text-white text-xs font-semibold px-3 py-1">Level {level}</span>
          <span className="text-sm text-secondary">{xp} total XP</span>
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
        <p className="text-sm font-semibold text-heading mb-3">Accuracy by topic (this attempt)</p>
        <div className="space-y-2.5">
          {topicRows.map(([topic, stats]) => {
            const topicPct = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);
            const label = EXAM_TOPICS.find((t) => t.id === topic)?.label ?? topic;
            return (
              <div key={topic}>
                <div className="flex items-center justify-between text-xs text-body mb-1">
                  <span>{label}</span>
                  <span className="text-secondary">
                    {stats.correct}/{stats.total} · {topicPct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${topicPct < 60 ? "bg-error" : "bg-success"}`}
                    style={{ width: `${topicPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReview}
          className="px-5 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Review answers
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Configure another exam
        </button>
        <Link
          href="/cpp"
          className="px-5 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Back to lessons
        </Link>
      </div>
    </div>
  );
}
