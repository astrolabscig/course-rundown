"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import CodeBlock from "../CodeBlock";
import { trackInteract } from "@/lib/track";

interface Frame {
  label: string;
  status: "waiting" | "returned";
  value?: number;
}

interface Stage {
  stack: Frame[];
  narration: string;
}

function buildCustomRecurrenceStages(): Stage[] {
  // f(n) = 2f(n-1) + 3, f(0) = 3
  const n = 4;
  const stages: Stage[] = [];
  const stack: Frame[] = [];
  function snapshot(narration: string) {
    stages.push({ stack: stack.map((f) => ({ ...f })), narration });
  }
  for (let i = n; i >= 1; i--) {
    stack.push({ label: `f(${i})`, status: "waiting" });
    snapshot(`f(${i}) is called. Before it can return, it must call f(${i - 1}) and wait for that result.`);
  }
  stack.push({ label: "f(0)", status: "waiting" });
  snapshot(`f(0) is called — this hits the base case directly, no further calls needed.`);
  stack[stack.length - 1] = { label: "f(0)", status: "returned", value: 3 };
  snapshot(`f(0) returns 3 immediately (the given base case).`);
  let childValue = 3;
  for (let i = 1; i <= n; i++) {
    stack.pop();
    const value = 2 * childValue + 3;
    stack[stack.length - 1] = { ...stack[stack.length - 1], status: "returned", value };
    snapshot(`f(${i - 1}) returned ${childValue}. f(${i}) computes 2×${childValue}+3 = ${value} and returns it.`);
    childValue = value;
  }
  stack.pop();
  snapshot(`f(${n}) returns ${childValue}. The recursion is complete.`);
  return stages;
}

function buildFactorialStages(n: number): Stage[] {
  const stages: Stage[] = [];
  const stack: Frame[] = [];
  function snapshot(narration: string) {
    stages.push({ stack: stack.map((f) => ({ ...f })), narration });
  }
  for (let i = n; i >= 1; i--) {
    stack.push({ label: `n!(${i})`, status: "waiting" });
    if (i === 1) snapshot(`n!(1) is called — base case: 1! = 1, no further call needed.`);
    else snapshot(`n!(${i}) is called. It must call n!(${i - 1}) and wait for that result.`);
  }
  stack[stack.length - 1] = { label: "n!(1)", status: "returned", value: 1 };
  snapshot(`n!(1) returns 1 immediately.`);
  let childValue = 1;
  for (let i = 2; i <= n; i++) {
    stack.pop();
    const value = i * childValue;
    stack[stack.length - 1] = { ...stack[stack.length - 1], status: "returned", value };
    snapshot(`n!(${i - 1}) returned ${childValue}. n!(${i}) computes ${i}×${childValue} = ${value}.`);
    childValue = value;
  }
  stack.pop();
  snapshot(`n!(${n}) returns ${childValue}. Recursion complete.`);
  return stages;
}

function buildGcdStages(a: number, b: number): Stage[] {
  const stages: Stage[] = [];
  const stack: Frame[] = [];
  const calls: [number, number][] = [];
  let x = a;
  let y = b;
  while (y !== 0) {
    calls.push([x, y]);
    [x, y] = [y, x % y];
  }
  calls.push([x, 0]);

  function snapshot(narration: string) {
    stages.push({ stack: stack.map((f) => ({ ...f })), narration });
  }

  for (let i = 0; i < calls.length; i++) {
    const [p, q] = calls[i];
    stack.push({ label: `gcd(${p},${q})`, status: "waiting" });
    if (q === 0) snapshot(`gcd(${p}, 0) is called — base case: gcd(n, 0) = n, so this returns ${p} directly.`);
    else snapshot(`gcd(${p}, ${q}) is called. It calls gcd(${q}, ${p % q}) and waits for the result.`);
  }
  stack[stack.length - 1] = { ...stack[stack.length - 1], status: "returned", value: calls[calls.length - 1][0] };
  snapshot(`gcd(${calls[calls.length - 1][0]}, 0) returns ${calls[calls.length - 1][0]}.`);
  let childValue = calls[calls.length - 1][0];
  for (let i = calls.length - 2; i >= 0; i--) {
    stack.pop();
    stack[stack.length - 1] = { ...stack[stack.length - 1], status: "returned", value: childValue };
    const [p, q] = calls[i];
    snapshot(`gcd(${q}, ${p % q}) returned ${childValue}, so gcd(${p}, ${q}) also returns ${childValue} — the Euclidean algorithm never needs to compute anything extra on the way back up.`);
  }
  stack.pop();
  snapshot(`gcd(${a}, ${b}) = ${childValue}. Recursion complete.`);
  return stages;
}

const presets = {
  recurrence: { label: "f(n) = 2f(n-1)+3, f(0)=3", build: () => buildCustomRecurrenceStages(), code: `f(n):\n    if n == 0: return 3        // base case\n    return 2 * f(n-1) + 3        // recursive case` },
  factorial: { label: "n! (factorial)", build: () => buildFactorialStages(4), code: `factorial(n):\n    if n <= 1: return 1          // base case\n    return n * factorial(n-1)    // recursive case` },
  gcd: { label: "gcd(24, 9) — Euclidean algorithm", build: () => buildGcdStages(24, 9), code: `gcd(a, b):\n    if b == 0: return a          // base case\n    return gcd(b, a mod b)       // recursive case` },
};

type PresetId = keyof typeof presets;

export default function RecursionCallStackSimulator() {
  const [presetId, setPresetId] = useState<PresetId>("recurrence");
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const stages = useMemo(() => presets[presetId].build(), [presetId]);
  const clampedIndex = Math.min(index, stages.length - 1);
  const stage = stages[clampedIndex];
  const visualStack = [...stage.stack].reverse();

  function go(delta: number) {
    setIndex((i) => Math.min(stages.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Every recursive call waits in line before it can answer">
        <p>
          A recursive function keeps calling a smaller version of itself, stacking up unfinished
          calls, until it hits a <strong>base case</strong> that can answer immediately without
          calling anyone else. Then the answers flow back down the stack, each call using the
          answer it was waiting on to compute its own answer (Rosen 5.3, and 5.4&rsquo;s recursive
          algorithms).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(presets) as PresetId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setPresetId(id);
              setIndex(0);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              presetId === id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {presets[id].label}
          </button>
        ))}
      </div>

      <CodeBlock code={presets[presetId].code} language="text" />

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
          Call stack (top = most recent call)
        </div>
        <div className="flex flex-col-reverse gap-1.5 min-h-[3rem]">
          {visualStack.length === 0 && <p className="text-sm text-secondary">Empty — recursion finished.</p>}
          {visualStack.map((frame, i) => (
            <div
              key={i}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-mono transition-colors ${
                frame.status === "returned" ? "border-success bg-white text-heading" : "border-accent bg-white text-heading"
              }`}
            >
              {frame.label}
              {frame.status === "returned" && <span className="text-success font-semibold"> → returns {frame.value}</span>}
              {frame.status === "waiting" && <span className="text-secondary"> (waiting…)</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{stage.narration}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={clampedIndex === 0}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ Back
        </button>
        <span className="text-sm text-secondary">
          Step {clampedIndex + 1} of {stages.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={clampedIndex === stages.length - 1}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
