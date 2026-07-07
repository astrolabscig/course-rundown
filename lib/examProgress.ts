export interface ExamConfig {
  topics: string[];
  questionCount: number;
  timed: boolean;
  minutes: number;
  negativeMarking: boolean;
}

export interface ExamAttemptRecord {
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  rawScore: number;
  topicBreakdown: Partial<Record<string, { correct: number; total: number }>>;
  config: ExamConfig;
}

// storageKey is per-subject (e.g. "cpp_exam_history", "econs_exam_history")
// so each subject's exam room keeps its own independent progress.
export function getHistory(storageKey: string): ExamAttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function recordAttempt(storageKey: string, record: ExamAttemptRecord): void {
  if (typeof window === "undefined") return;
  const history = getHistory(storageKey);
  history.push(record);
  localStorage.setItem(storageKey, JSON.stringify(history));
}

export function computeTopicAccuracy(
  history: ExamAttemptRecord[]
): { topic: string; correct: number; total: number; pct: number; weak: boolean }[] {
  const totals = new Map<string, { correct: number; total: number }>();
  for (const attempt of history) {
    for (const [topic, stats] of Object.entries(attempt.topicBreakdown) as [string, { correct: number; total: number }][]) {
      const existing = totals.get(topic) ?? { correct: 0, total: 0 };
      existing.correct += stats.correct;
      existing.total += stats.total;
      totals.set(topic, existing);
    }
  }
  return Array.from(totals.entries()).map(([topic, { correct, total }]) => {
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
    return { topic, correct, total, pct, weak: pct < 60 };
  });
}

export function computeXp(history: ExamAttemptRecord[]): number {
  return history.reduce((sum, a) => sum + a.correctCount, 0);
}

export function computeLevel(xp: number): number {
  return Math.floor(xp / 50) + 1;
}
