"use client";

import { useEffect, useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `int factorial(int n) {
    if (n <= 1) return 1;          // base case — stops the recursion
    return n * factorial(n - 1);   // recursive case — calls itself
}`;

interface Frame {
  label: string;
  status: "waiting" | "returned";
  value?: number;
}

interface Stage {
  stack: Frame[];
  narration: string;
}

function buildStages(n: number): Stage[] {
  const stages: Stage[] = [];
  const stack: Frame[] = [];

  function snapshot(narration: string) {
    stages.push({ stack: stack.map((f) => ({ ...f })), narration });
  }

  for (let i = n; i >= 1; i--) {
    stack.push({ label: `factorial(${i})`, status: "waiting" });
    if (i === 1) {
      snapshot(`factorial(1) is called — n <= 1, so this hits the base case. No further recursive call is needed.`);
    } else {
      snapshot(`factorial(${i}) is called. Before it can return anything, it must call factorial(${i - 1}) and wait for that result.`);
    }
  }

  stack[stack.length - 1] = { ...stack[stack.length - 1], status: "returned", value: 1 };
  snapshot(`factorial(1) returns 1 straight away — this is the base case unwinding.`);

  let childValue = 1;
  for (let i = 2; i <= n; i++) {
    stack.pop();
    const value = i * childValue;
    stack[stack.length - 1] = { ...stack[stack.length - 1], status: "returned", value };
    snapshot(
      `factorial(${i - 1}) has returned ${childValue}. factorial(${i}) computes ${i} × ${childValue} = ${value} and returns it to whoever called it.`
    );
    childValue = value;
  }

  stack.pop();
  snapshot(`factorial(${n}) returns ${childValue}. The recursion is complete and the call stack is empty again.`);

  return stages;
}

export default function RecursionSimulator() {
  const [n, setN] = useState(4);
  const [stages, setStages] = useState<Stage[]>(() => buildStages(4));
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (index >= stages.length - 1) {
      setPlaying(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => Math.min(stages.length - 1, i + 1));
    }, 900);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, stages]);

  function start(newN: number) {
    const clamped = Math.max(1, Math.min(6, newN));
    setN(clamped);
    setStages(buildStages(clamped));
    setIndex(0);
    setPlaying(true);
    markInteracted();
  }

  function step(delta: number) {
    setPlaying(false);
    setIndex((i) => Math.min(stages.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  const stage = stages[index];
  const visualStack = [...stage.stack].reverse();

  return (
    <div className="space-y-4">
      <ExplainerBox title="What is recursion, really?">
        <p>
          Recursion is a function calling itself to solve a smaller version of the same problem —
          like Russian nesting dolls: to open the big doll you first have to open the one inside
          it, and the one inside that, all the way down to the smallest doll that just opens on
          its own (the <strong>base case</strong>). Once the smallest one is open, you work
          your way back out, using each answer to finish the doll around it.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="recursion-n" className="text-sm font-medium text-heading">
            Call factorial(n) with n =
          </label>
          <input
            id="recursion-n"
            type="number"
            min={1}
            max={6}
            defaultValue={4}
            onChange={(e) => setN(Number(e.target.value))}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-20 font-mono"
          />
        </div>
        <button
          type="button"
          onClick={() => start(n)}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          ▶ Play the call stack
        </button>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
          Call stack (top = most recent call)
        </div>
        <div className="flex flex-col-reverse gap-1.5 min-h-[3rem]">
          {visualStack.length === 0 && (
            <p className="text-sm text-secondary">Empty — recursion finished (or not started yet).</p>
          )}
          {visualStack.map((frame, i) => (
            <div
              key={i}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-mono transition-colors ${
                frame.status === "returned"
                  ? "border-success bg-white text-heading"
                  : "border-accent bg-white text-heading"
              }`}
            >
              {frame.label}
              {frame.status === "returned" && (
                <span className="text-success font-semibold"> → returns {frame.value}</span>
              )}
              {frame.status === "waiting" && <span className="text-secondary"> (waiting…)</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{stage.narration}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={index === 0}
          className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={index === stages.length - 1}
          className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
        >
          ▶
        </button>
        <span className="text-sm text-secondary">
          Step {index + 1} of {stages.length}
        </span>
      </div>
    </div>
  );
}
