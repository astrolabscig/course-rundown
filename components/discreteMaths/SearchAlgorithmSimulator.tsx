"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Step {
  description: string;
  highlight: number[];
  window?: [number, number];
  done: boolean;
  foundIndex?: number;
}

function linearSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  for (let i = 0; i < arr.length; i++) {
    steps.push({ description: `Compare a[${i}] = ${arr[i]} with target ${target}.`, highlight: [i], done: false });
    if (arr[i] === target) {
      steps.push({ description: `Match! Found ${target} at index ${i}.`, highlight: [i], done: true, foundIndex: i });
      return steps;
    }
  }
  steps.push({ description: `Reached the end without a match — ${target} is not in the list.`, highlight: [], done: true });
  return steps;
}

function binarySteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({
      description: `Window [${low}, ${high}]. Middle index ${mid} holds ${arr[mid]}. Compare with target ${target}.`,
      highlight: [mid],
      window: [low, high],
      done: false,
    });
    if (arr[mid] === target) {
      steps.push({ description: `Match! Found ${target} at index ${mid}.`, highlight: [mid], window: [low, high], done: true, foundIndex: mid });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({ description: `${arr[mid]} < ${target}, so discard the left half and search [${mid + 1}, ${high}].`, highlight: [mid], window: [low, high], done: false });
      low = mid + 1;
    } else {
      steps.push({ description: `${arr[mid]} > ${target}, so discard the right half and search [${low}, ${mid - 1}].`, highlight: [mid], window: [low, high], done: false });
      high = mid - 1;
    }
  }
  steps.push({ description: `Window is empty (low > high) — ${target} is not in the list.`, highlight: [], done: true });
  return steps;
}

const defaultArray = [1, 3, 4, 5, 6, 8, 9, 11];

export default function SearchAlgorithmSimulator() {
  const [algo, setAlgo] = useState<"linear" | "binary">("binary");
  const [target, setTarget] = useState(9);
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const steps = useMemo(
    () => (algo === "linear" ? linearSteps(defaultArray, target) : binarySteps(defaultArray, target)),
    [algo, target]
  );

  const clampedIndex = Math.min(index, steps.length - 1);
  const step = steps[clampedIndex];

  function go(delta: number) {
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Binary search throws away half the haystack every time">
        <p>
          Linear search checks every element one by one — worst case n comparisons. Binary search
          only works on a SORTED list, but it repeatedly checks the middle element and throws away
          half the remaining range, so it only needs about log₂(n) comparisons. Watch the search
          window shrink below (mirrors Rosen 3.1, Examples 3 &amp; 4).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {(["linear", "binary"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAlgo(a);
                setIndex(0);
                markInteracted();
              }}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition-colors ${
                algo === a ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
              }`}
            >
              {a} search
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-secondary">
          target =
          <input
            type="number"
            value={target}
            onChange={(e) => {
              setTarget(Number(e.target.value) || 0);
              setIndex(0);
              markInteracted();
            }}
            className="w-20 rounded-full border border-card-border px-2 py-1 font-mono"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {defaultArray.map((v, i) => {
          const inWindow = algo === "binary" && step.window && i >= step.window[0] && i <= step.window[1];
          const highlighted = step.highlight.includes(i);
          return (
            <div
              key={i}
              className={`flex flex-col items-center rounded-lg border-2 px-3 py-2 font-mono text-sm transition-colors ${
                highlighted
                  ? step.foundIndex === i
                    ? "border-success bg-muted"
                    : "border-accent bg-muted"
                  : inWindow
                  ? "border-card-border bg-muted"
                  : algo === "binary" && step.window
                  ? "border-card-border opacity-30"
                  : "border-card-border"
              }`}
            >
              <span className="text-[10px] text-secondary">{i}</span>
              <span className="font-bold text-heading">{v}</span>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{step.description}</p>
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
          Step {clampedIndex + 1} of {steps.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={clampedIndex === steps.length - 1}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
