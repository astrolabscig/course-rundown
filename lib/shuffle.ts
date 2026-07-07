import type { ExamQuestion } from "@/lib/examBank";

export interface ShuffledQuestion extends ExamQuestion {
  originalCorrectIndex: number;
}

// Fisher-Yates. Never mutates the source question — returns a new object with
// options in a new order and correctIndex remapped to match.
export function shuffleOptions(question: ExamQuestion): ShuffledQuestion {
  const indices = question.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const options = indices.map((i) => question.options[i]);
  const correctIndex = indices.indexOf(question.correctIndex);
  return { ...question, options, correctIndex, originalCorrectIndex: question.correctIndex };
}

export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
