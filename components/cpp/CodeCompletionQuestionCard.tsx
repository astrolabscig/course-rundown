"use client";

import { Fragment, useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import type { CodeCompletionQuestion } from "@/lib/cpp/codeCompletionBank";

function normalize(s: string): string {
  return s.replace(/\s+/g, "").replace(/;$/, "");
}

function isBlankCorrect(acceptableAnswers: string[], value: string): boolean {
  const norm = normalize(value);
  if (norm === "") return false;
  return acceptableAnswers.some((a) => normalize(a) === norm);
}

const difficultyLabel: Record<CodeCompletionQuestion["difficulty"], string> = {
  beginner: "Beginner",
  "advanced-beginner": "Advanced Beginner",
  intermediate: "Intermediate",
};

const difficultyStyle: Record<CodeCompletionQuestion["difficulty"], string> = {
  beginner: "border-success/40 bg-success/10 text-success",
  "advanced-beginner": "border-accent/40 bg-accent/10 text-accent",
  intermediate: "border-error/40 bg-error/10 text-error",
};

// Splits starterCode on each blank's marker, so the marker positions can be
// replaced with input fields while everything else renders as plain code text.
function splitOnBlanks(code: string, blankIds: string[]): { text: string; blankId: string | null }[] {
  const pattern = new RegExp(`(${blankIds.map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  const parts = code.split(pattern);
  return parts.map((part) => (blankIds.includes(part) ? { text: "", blankId: part } : { text: part, blankId: null }));
}

export default function CodeCompletionQuestionCard({
  question,
  onCheck,
}: {
  question: CodeCompletionQuestion;
  onCheck: (correct: boolean) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(question.blanks.map((b) => [b.id, ""]))
  );
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [solved, setSolved] = useState(false);

  const segments = splitOnBlanks(question.starterCode, question.blanks.map((b) => b.id));

  function handleCheck() {
    const nextResults: Record<string, boolean> = {};
    let allCorrect = true;
    for (const blank of question.blanks) {
      const correct = isBlankCorrect(blank.acceptableAnswers, values[blank.id] ?? "");
      nextResults[blank.id] = correct;
      if (!correct) allCorrect = false;
    }
    setResults(nextResults);
    setChecked(true);
    setAttempts((a) => a + 1);
    if (allCorrect) setSolved(true);
    onCheck(allCorrect);
  }

  function inputWidth(blank: { acceptableAnswers: string[] }) {
    const longest = Math.max(6, ...blank.acceptableAnswers.map((a) => a.length));
    return `${longest + 2}ch`;
  }

  const showRevealPrompt = !solved && attempts >= 3;

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${difficultyStyle[question.difficulty]}`}>
          {difficultyLabel[question.difficulty]}
        </span>
        <span className="px-2.5 py-0.5 rounded-full border border-card-border text-xs font-medium text-secondary">
          {question.topic}
        </span>
        {solved && (
          <span className="px-2.5 py-0.5 rounded-full border border-success/40 bg-success/10 text-xs font-semibold text-success">
            Solved
          </span>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-heading">{question.title}</h3>
        <p className="text-sm text-body mt-1">{question.scenario}</p>
        <p className="text-sm text-body mt-1 font-medium">{question.task}</p>
      </div>

      <div className="rounded-xl border border-card-border bg-code-bg overflow-x-auto">
        <pre
          className="p-4 text-sm leading-relaxed whitespace-pre-wrap break-words text-code-text"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {segments.map((seg, i) => {
            if (seg.blankId === null) return <Fragment key={i}>{seg.text}</Fragment>;
            const blank = question.blanks.find((b) => b.id === seg.blankId)!;
            let inputStyle = "border-card-border bg-white text-code-text focus:border-accent";
            if (checked) {
              inputStyle = results[blank.id]
                ? "border-code-success bg-code-success-bg text-code-success"
                : "border-code-error bg-code-error-bg text-code-error";
            }
            return (
              <input
                key={i}
                type="text"
                value={values[blank.id] ?? ""}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, [blank.id]: e.target.value }));
                  if (checked) setChecked(false);
                }}
                disabled={solved}
                spellCheck={false}
                autoComplete="off"
                style={{ fontFamily: "var(--font-mono)", width: inputWidth(blank) }}
                className={`mx-0.5 rounded border px-1.5 py-0.5 text-sm outline-none disabled:opacity-70 ${inputStyle}`}
              />
            );
          })}
        </pre>
      </div>

      {hintsShown > 0 && (
        <div className="space-y-1.5">
          {question.hints.slice(0, hintsShown).map((h, i) => (
            <p key={i} className="text-xs rounded-lg border border-card-border bg-muted px-3 py-2 text-secondary">
              <span className="font-semibold text-heading">Hint {i + 1}: </span>
              {h}
            </p>
          ))}
        </div>
      )}

      {checked && !solved && (
        <div className="rounded-lg border border-error/40 bg-error/10 px-3 py-2 space-y-1">
          <p className="text-sm font-medium text-error">Not quite right yet — check the highlighted field(s) and try again.</p>
          {attempts >= 2 && (
            <p className="text-xs text-secondary">
              <span className="font-semibold">Common mistake: </span>
              {question.commonMistake}
            </p>
          )}
        </div>
      )}

      {solved && (
        <div className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 space-y-2">
          <p className="text-sm font-medium text-success">Correct! Here&rsquo;s why:</p>
          <p className="text-sm text-body">{question.explanation}</p>
          <div className="pt-1">
            <p className="text-xs font-semibold text-heading mb-1">Test cases this satisfies</p>
            <ul className="text-xs text-secondary list-disc list-inside space-y-0.5">
              {question.testCases.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {solutionRevealed && !solved && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-heading">Solution</p>
          <CodeBlock code={question.solutionCode} />
          <p className="text-sm text-body">{question.explanation}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!solved && (
          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
          >
            Check answer
          </button>
        )}
        {!solved && hintsShown < question.hints.length && (
          <button
            type="button"
            onClick={() => setHintsShown((h) => h + 1)}
            className="px-4 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
          >
            {hintsShown === 0 ? "Show a hint" : "Show next hint"}
          </button>
        )}
        {!solved && !solutionRevealed && (
          <button
            type="button"
            onClick={() => setSolutionRevealed(true)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              showRevealPrompt
                ? "border-accent text-accent hover:bg-accent/10"
                : "border-card-border text-secondary hover:border-accent"
            }`}
          >
            Reveal solution
          </button>
        )}
      </div>
    </div>
  );
}
