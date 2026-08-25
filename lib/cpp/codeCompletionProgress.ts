export interface CCQuestionProgress {
  attempts: number;
  solved: boolean;
}

export type CCProgressMap = Record<string, CCQuestionProgress>;

const STORAGE_KEY = "cpp_code_lab_progress";

export function getProgress(): CCProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return typeof raw === "object" && raw !== null ? raw : {};
  } catch {
    return {};
  }
}

export function recordQuestionAttempt(questionId: string, correct: boolean): CCProgressMap {
  const progress = getProgress();
  const existing = progress[questionId] ?? { attempts: 0, solved: false };
  existing.attempts += 1;
  if (correct) existing.solved = true;
  progress[questionId] = existing;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  return progress;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function computeStats(progress: CCProgressMap, bank: { id: string }[]) {
  const solvedCount = bank.filter((q) => progress[q.id]?.solved).length;
  const attemptedCount = bank.filter((q) => progress[q.id]).length;
  const totalAttempts = bank.reduce((sum, q) => sum + (progress[q.id]?.attempts ?? 0), 0);
  return {
    solvedCount,
    attemptedCount,
    totalAttempts,
    totalQuestions: bank.length,
    completionPct: bank.length === 0 ? 0 : Math.round((solvedCount / bank.length) * 100),
  };
}

export function computeTopicStats(
  progress: CCProgressMap,
  bank: { id: string; topic: string }[]
): { topic: string; total: number; solved: number; pct: number; weak: boolean }[] {
  const byTopic = new Map<string, { total: number; solved: number }>();
  for (const q of bank) {
    const stat = byTopic.get(q.topic) ?? { total: 0, solved: 0 };
    stat.total += 1;
    if (progress[q.id]?.solved) stat.solved += 1;
    byTopic.set(q.topic, stat);
  }
  return Array.from(byTopic.entries()).map(([topic, { total, solved }]) => {
    const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
    return { topic, total, solved, pct, weak: pct < 60 };
  });
}
