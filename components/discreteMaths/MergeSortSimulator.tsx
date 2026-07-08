"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Frame {
  kind: "divide" | "merge" | "base";
  description: string;
  arrays: number[][];
}

function mergeSortTrace(arr: number[]): { frames: Frame[]; sorted: number[] } {
  const frames: Frame[] = [];

  function mergeSort(a: number[]): number[] {
    if (a.length <= 1) {
      frames.push({ kind: "base", description: `[${a.join(",")}] has 0 or 1 element — already sorted (base case).`, arrays: [a] });
      return a;
    }
    const mid = Math.floor(a.length / 2);
    const left = a.slice(0, mid);
    const right = a.slice(mid);
    frames.push({ kind: "divide", description: `Divide [${a.join(",")}] into [${left.join(",")}] and [${right.join(",")}].`, arrays: [left, right] });
    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);
    const merged = merge(sortedLeft, sortedRight);
    return merged;
  }

  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0;
    let j = 0;
    const comparisons: string[] = [];
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        comparisons.push(`${left[i]} ≤ ${right[j]}, take ${left[i]}`);
        result.push(left[i]);
        i++;
      } else {
        comparisons.push(`${right[j]} < ${left[i]}, take ${right[j]}`);
        result.push(right[j]);
        j++;
      }
    }
    while (i < left.length) {
      comparisons.push(`only [${left.slice(i).join(",")}] left, take ${left[i]}`);
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      comparisons.push(`only [${right.slice(j).join(",")}] left, take ${right[j]}`);
      result.push(right[j]);
      j++;
    }
    frames.push({
      kind: "merge",
      description: `Merge [${left.join(",")}] and [${right.join(",")}] → ${comparisons.join("; ")} → [${result.join(",")}].`,
      arrays: [result],
    });
    return result;
  }

  const sorted = mergeSort(arr);
  return { frames, sorted };
}

const defaultArray = [8, 2, 4, 6, 9, 7, 10, 1, 5, 3];

export default function MergeSortSimulator() {
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const { frames } = useMemo(() => mergeSortTrace(defaultArray), []);
  const clampedIndex = Math.min(index, frames.length - 1);
  const frame = frames[clampedIndex];

  function go(delta: number) {
    setIndex((i) => Math.min(frames.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Divide and conquer: split until trivial, then merge back up">
        <p>
          Merge sort repeatedly splits the array in half (the &ldquo;divide&rdquo;) until each
          piece is a single element — trivially sorted. Then it repeatedly merges pairs of already-
          sorted pieces back together (the &ldquo;conquer&rdquo;), always comparing the two front
          elements and taking the smaller one, until the whole array is one sorted piece (Rosen
          5.4, Example 9).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-2">
        {defaultArray.map((v, i) => (
          <div key={i} className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-card-border font-mono text-sm font-bold text-heading">
            {v}
          </div>
        ))}
      </div>

      <div
        className={`rounded-xl p-4 border-2 ${
          frame.kind === "divide" ? "border-accent bg-muted" : frame.kind === "merge" ? "border-success bg-muted" : "border-card-border bg-muted"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-wide mb-1 text-secondary">
          {frame.kind === "divide" ? "Divide" : frame.kind === "merge" ? "Merge" : "Base case"}
        </p>
        <p className="text-sm text-body font-mono">{frame.description}</p>
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
          Step {clampedIndex + 1} of {frames.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={clampedIndex === frames.length - 1}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
