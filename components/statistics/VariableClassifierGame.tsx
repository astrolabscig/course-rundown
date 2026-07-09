"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { variableClassificationBank, type VariableCategory } from "@/lib/statistics/variableClassificationBank";

const categories: { id: VariableCategory; label: string; hint: string }[] = [
  { id: "nominal", label: "Nominal", hint: "categories, no order" },
  { id: "ordinal", label: "Ordinal", hint: "categories, ranked" },
  { id: "discrete", label: "Discrete", hint: "countable numbers" },
  { id: "continuous", label: "Continuous", hint: "measured numbers" },
];

export default function VariableClassifierGame() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<VariableCategory | null>(null);
  const [score, setScore] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const item = variableClassificationBank[index];
  const finished = index >= variableClassificationBank.length;

  function choose(cat: VariableCategory) {
    if (selected !== null) return;
    setSelected(cat);
    if (cat === item.category) setScore((s) => s + 1);
    markInteracted();
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
    markInteracted();
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Four buckets, one quick question each">
        <p>
          First ask: does this variable have numbers you can do arithmetic on
          (quantitative), or does it just sort things into categories
          (qualitative)? Then ask the follow-up: for qualitative, is there a
          natural rank (ordinal) or not (nominal)? For quantitative, could a
          value exist between any two values you'd measure (continuous), or
          are you always counting whole, separate units (discrete)? This is
          the actual group assignment from the course, made interactive.
        </p>
      </ExplainerBox>

      {!finished ? (
        <>
          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4">
            <p className="text-sm text-secondary">
              Item {index + 1} of {variableClassificationBank.length}
            </p>
            <p className="text-body font-medium">{item.label}</p>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => {
                const isChosen = selected === c.id;
                const isCorrect = c.id === item.category;
                let style = "border-card-border hover:border-accent";
                if (selected !== null) {
                  if (isCorrect) style = "border-success bg-success/10";
                  else if (isChosen) style = "border-error bg-error/10";
                  else style = "border-card-border opacity-50";
                }
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => choose(c.id)}
                    disabled={selected !== null}
                    className={`text-left px-3 py-2 rounded-xl border-2 text-sm font-medium transition-colors disabled:cursor-default ${style}`}
                  >
                    <span className="block text-heading">{c.label}</span>
                    <span className="block text-xs text-secondary">{c.hint}</span>
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className="rounded-xl bg-muted p-3 text-sm text-body">
                {selected === item.category ? (
                  <span className="text-success font-semibold">Correct — </span>
                ) : (
                  <span className="text-error font-semibold">Not quite — </span>
                )}
                this is <strong className="capitalize">{item.category}</strong>.
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary">
              Score: {score} / {index + (selected !== null ? 1 : 0)}
            </span>
            {selected !== null && (
              <button
                type="button"
                onClick={next}
                className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                {index + 1 === variableClassificationBank.length ? "See results" : "Next item"}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-card-border bg-card p-6 text-center space-y-3">
          <p className="text-2xl font-semibold text-heading">
            {score} / {variableClassificationBank.length} correct
          </p>
          <button
            type="button"
            onClick={restart}
            className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
