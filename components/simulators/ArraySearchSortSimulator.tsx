"use client";

import { useEffect, useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const initialArray = [5, 2, 9, 1, 7, 3];

const searchCode = `int search(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) return i;   // found it
    }
    return -1;                             // never found
}`;

const sortCode = `for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
            std::swap(arr[j], arr[j + 1]);   // bubble the bigger value right
        }
    }
}`;

interface SearchStage {
  index: number | null;
  found: boolean;
  narration: string;
}

function buildSearchStages(arr: number[], target: number): SearchStage[] {
  const stages: SearchStage[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      stages.push({ index: i, found: true, narration: `arr[${i}] = ${arr[i]} — matches! The search stops here and returns index ${i}.` });
      return stages;
    }
    stages.push({ index: i, found: false, narration: `arr[${i}] = ${arr[i]} — not equal to ${target}, keep looking.` });
  }
  stages.push({ index: null, found: false, narration: `Reached the end without finding ${target} — the search returns -1.` });
  return stages;
}

interface SortStage {
  arr: number[];
  compare: [number, number] | null;
  sortedFrom: number;
  narration: string;
}

function buildSortStages(initial: number[]): SortStage[] {
  const arr = [...initial];
  const n = arr.length;
  const stages: SortStage[] = [{ arr: [...arr], compare: null, sortedFrom: n, narration: "Starting array — nothing sorted yet." }];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const willSwap = arr[j] > arr[j + 1];
      stages.push({
        arr: [...arr],
        compare: [j, j + 1],
        sortedFrom: n - i,
        narration: willSwap
          ? `Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]} — out of order, so swap them.`
          : `Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]} — already in order, no swap needed.`,
      });
      if (willSwap) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        stages.push({
          arr: [...arr],
          compare: [j, j + 1],
          sortedFrom: n - i,
          narration: `Swapped — they're now in the right relative order.`,
        });
      }
    }
    stages.push({
      arr: [...arr],
      compare: null,
      sortedFrom: n - i - 1,
      narration: `Pass ${i + 1} complete — the largest remaining value has "bubbled" up to position ${n - i - 1}.`,
    });
  }
  stages.push({ arr: [...arr], compare: null, sortedFrom: 0, narration: "Array fully sorted!" });
  return stages;
}

function useAutoPlay(length: number, delay: number) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (index >= length - 1) {
      setPlaying(false);
      return;
    }
    timeoutRef.current = setTimeout(() => setIndex((i) => Math.min(length - 1, i + 1)), delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, length]);

  return { index, setIndex, playing, setPlaying };
}

export default function ArraySearchSortSimulator() {
  const [mode, setMode] = useState<"search" | "sort">("search");
  const [target, setTarget] = useState(7);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const searchStages = buildSearchStages(initialArray, target);
  const sortStages = buildSortStages(initialArray);

  const search = useAutoPlay(searchStages.length, 700);
  const sort = useAutoPlay(sortStages.length, 700);

  function playSearch() {
    search.setIndex(0);
    search.setPlaying(true);
    markInteracted();
  }
  function playSort() {
    sort.setIndex(0);
    sort.setPlaying(true);
    markInteracted();
  }

  const searchStage = searchStages[search.index];
  const sortStage = sortStages[sort.index];

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why does the same array need different strategies?">
        <p>
          An array is a row of numbered lockers holding values. <strong>Searching</strong> means
          checking lockers one by one until you find what you want (or run out of lockers).{" "}
          <strong>Sorting</strong> means rearranging the values inside those lockers into order —
          bubble sort does this by repeatedly comparing two neighbours and swapping them if
          they're the wrong way round, letting the biggest value &ldquo;bubble&rdquo; to the end
          each pass.
        </p>
      </ExplainerBox>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("search");
            markInteracted();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            mode === "search" ? "bg-accent text-white border-accent" : "bg-white text-body border-card-border hover:border-accent"
          }`}
        >
          Linear search
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("sort");
            markInteracted();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            mode === "sort" ? "bg-accent text-white border-accent" : "bg-white text-body border-card-border hover:border-accent"
          }`}
        >
          Bubble sort
        </button>
      </div>

      {mode === "search" ? (
        <div className="space-y-3">
          <CodeBlock code={searchCode} />
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="search-target" className="text-sm font-medium text-heading">
                Search for
              </label>
              <input
                id="search-target"
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="rounded-full border border-card-border px-3 py-1.5 text-sm w-24 font-mono"
              />
            </div>
            <button
              type="button"
              onClick={playSearch}
              className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              ▶ Play search
            </button>
          </div>

          <div className="flex gap-2">
            {initialArray.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold transition-colors ${
                    searchStage.index === i
                      ? searchStage.found
                        ? "border-success bg-success text-white"
                        : "border-accent bg-white text-heading"
                      : "border-card-border bg-white text-body"
                  }`}
                >
                  {val}
                </div>
                <span className="text-xs text-secondary font-mono">{i}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm text-body">{searchStage.narration}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                search.setPlaying(false);
                search.setIndex((i) => Math.max(0, i - 1));
                markInteracted();
              }}
              disabled={search.index === 0}
              className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => {
                search.setPlaying(false);
                search.setIndex((i) => Math.min(searchStages.length - 1, i + 1));
                markInteracted();
              }}
              disabled={search.index === searchStages.length - 1}
              className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
            >
              ▶
            </button>
            <span className="text-sm text-secondary">
              Step {search.index + 1} of {searchStages.length}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <CodeBlock code={sortCode} />
          <button
            type="button"
            onClick={playSort}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            ▶ Play bubble sort
          </button>

          <div className="flex gap-2">
            {sortStage.arr.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold transition-colors ${
                    i >= sortStage.sortedFrom
                      ? "border-success bg-success text-white"
                      : sortStage.compare && (sortStage.compare[0] === i || sortStage.compare[1] === i)
                      ? "border-accent-warm bg-accent-warm-bg text-heading"
                      : "border-card-border bg-white text-body"
                  }`}
                >
                  {val}
                </div>
                <span className="text-xs text-secondary font-mono">{i}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm text-body">{sortStage.narration}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sort.setPlaying(false);
                sort.setIndex((i) => Math.max(0, i - 1));
                markInteracted();
              }}
              disabled={sort.index === 0}
              className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => {
                sort.setPlaying(false);
                sort.setIndex((i) => Math.min(sortStages.length - 1, i + 1));
                markInteracted();
              }}
              disabled={sort.index === sortStages.length - 1}
              className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
            >
              ▶
            </button>
            <span className="text-sm text-secondary">
              Step {sort.index + 1} of {sortStages.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
