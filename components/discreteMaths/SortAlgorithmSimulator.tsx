"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Frame {
  array: number[];
  compare: number[];
  swapped: boolean;
  description: string;
}

function bubbleFrames(input: number[]): Frame[] {
  const arr = [...input];
  const frames: Frame[] = [{ array: [...arr], compare: [], swapped: false, description: "Starting array." }];
  for (let pass = 0; pass < arr.length - 1; pass++) {
    for (let i = 0; i < arr.length - 1 - pass; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        frames.push({ array: [...arr], compare: [i, i + 1], swapped: true, description: `Pass ${pass + 1}: ${arr[i + 1]} > ${arr[i]}, swap them.` });
      } else {
        frames.push({ array: [...arr], compare: [i, i + 1], swapped: false, description: `Pass ${pass + 1}: a[${i}]=${arr[i]} ≤ a[${i + 1}]=${arr[i + 1]}, no swap needed.` });
      }
    }
  }
  frames.push({ array: [...arr], compare: [], swapped: false, description: "Sorted — every pass produced no swaps needed after this point." });
  return frames;
}

function insertionFrames(input: number[]): Frame[] {
  const arr = [...input];
  const frames: Frame[] = [{ array: [...arr], compare: [], swapped: false, description: "Starting array. First element counts as already sorted." }];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    frames.push({ array: [...arr], compare: [i], swapped: false, description: `Take a[${i}]=${key} and insert it into the sorted part to its left.` });
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      frames.push({ array: [...arr], compare: [j, j + 1], swapped: true, description: `${arr[j]} > ${key}, so shift ${arr[j]} one slot right.` });
      j--;
    }
    arr[j + 1] = key;
    frames.push({ array: [...arr], compare: [j + 1], swapped: false, description: `Place ${key} into its correct slot at index ${j + 1}.` });
  }
  frames.push({ array: [...arr], compare: [], swapped: false, description: "Sorted — every element has been inserted into its correct position." });
  return frames;
}

const defaultArray = [3, 2, 4, 1, 5];

export default function SortAlgorithmSimulator() {
  const [algo, setAlgo] = useState<"bubble" | "insertion">("bubble");
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const frames = useMemo(() => (algo === "bubble" ? bubbleFrames(defaultArray) : insertionFrames(defaultArray)), [algo]);
  const clampedIndex = Math.min(index, frames.length - 1);
  const frame = frames[clampedIndex];

  function go(delta: number) {
    setIndex((i) => Math.min(frames.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Both sorts just repeatedly fix one local mistake at a time">
        <p>
          Bubble sort walks left to right and swaps any adjacent out-of-order pair, letting the
          largest unsorted value &ldquo;bubble&rdquo; to the end each pass. Insertion sort instead
          grows a sorted prefix one element at a time, sliding each new element left until it's in
          the right spot — like sorting a hand of playing cards. Step through both on the same
          array (Rosen 3.1, Examples 4 &amp; 5).
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(["bubble", "insertion"] as const).map((a) => (
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
            {a} sort
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {frame.array.map((v, i) => (
          <div
            key={i}
            className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold transition-colors ${
              frame.compare.includes(i)
                ? frame.swapped
                  ? "border-error bg-muted text-error"
                  : "border-accent bg-muted text-accent"
                : "border-card-border text-heading"
            }`}
          >
            {v}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{frame.description}</p>
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
