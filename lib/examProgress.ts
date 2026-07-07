import type { ExamTopic } from "@/lib/examBank";

const HISTORY_KEY = "cpp_exam_history";

export interface ExamConfig {
  topics: ExamTopic[];
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
  topicBreakdown: Partial<Record<ExamTopic, { correct: number; total: number }>>;
  config: ExamConfig;
}

export function getHistory(): ExamAttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function recordAttempt(record: ExamAttemptRecord): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  history.push(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function computeTopicAccuracy(
  history: ExamAttemptRecord[]
): { topic: ExamTopic; correct: number; total: number; pct: number; weak: boolean }[] {
  const totals = new Map<ExamTopic, { correct: number; total: number }>();
  for (const attempt of history) {
    for (const [topic, stats] of Object.entries(attempt.topicBreakdown) as [ExamTopic, { correct: number; total: number }][]) {
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

export function computeStreak(history: ExamAttemptRecord[]): number {
  if (history.length === 0) return 0;
  const days = new Set(
    history.map((a) => {
      const d = new Date(a.timestamp);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!days.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeXp(history: ExamAttemptRecord[]): number {
  return history.reduce((sum, a) => sum + a.correctCount, 0);
}

export function computeLevel(xp: number): number {
  return Math.floor(xp / 50) + 1;
}
