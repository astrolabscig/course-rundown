"use client";

import { useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import ErrorPanel from "../ErrorPanel";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `std::vector<int> nums;      // starts empty, grows automatically

nums.push_back(10);
nums.push_back(20);
nums.push_back(30);

std::cout << nums.size();    // 3
std::cout << nums[1];        // 20 — fast, but NO bounds checking
std::cout << nums.at(5);     // throws std::out_of_range — checked, but slightly slower`;

export default function VectorBasicsDemo() {
  const [nums, setNums] = useState<number[]>([10, 20, 30]);
  const [indexInput, setIndexInput] = useState("1");
  const [result, setResult] = useState<{ kind: "ok" | "ub" | "throw"; text: string } | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function pushBack() {
    const next = nums.length === 0 ? 10 : nums[nums.length - 1] + 10;
    setNums((prev) => [...prev, next]);
    markInteracted();
  }

  function popBack() {
    setNums((prev) => prev.slice(0, -1));
    markInteracted();
  }

  function tryBracket() {
    const i = Number(indexInput);
    markInteracted();
    if (i >= 0 && i < nums.length) {
      setResult({ kind: "ok", text: `nums[${i}] = ${nums[i]}` });
    } else {
      setResult({
        kind: "ub",
        text: `nums[${i}] — undefined behaviour: [] does NOT check bounds. This might silently read garbage memory, or crash, or (worst of all) appear to "work" and give a wrong answer.`,
      });
    }
  }

  function tryAt() {
    const i = Number(indexInput);
    markInteracted();
    if (i >= 0 && i < nums.length) {
      setResult({ kind: "ok", text: `nums.at(${i}) = ${nums[i]}` });
    } else {
      setResult({
        kind: "throw",
        text: `terminate called after throwing an instance of 'std::out_of_range'\n  what():  vector::_M_range_check: __n (which is ${i}) >= this->size() (which is ${nums.length})`,
      });
    }
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why use std::vector instead of a plain array?">
        <p>
          A plain array is a fixed row of lockers — decide the size once, and you&rsquo;re stuck
          with it forever. A <span className="font-mono">std::vector</span> is like a row of
          lockers on wheels: call <span className="font-mono">push_back</span> and it automatically
          rolls in a new locker at the end, resizing itself so you never have to guess the size up
          front.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={pushBack}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          push_back()
        </button>
        <button
          type="button"
          onClick={popBack}
          disabled={nums.length === 0}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
        >
          pop_back()
        </button>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-secondary">
          nums.size() = {nums.length}
        </div>
        <div className="flex flex-wrap gap-2">
          {nums.length === 0 && <p className="text-sm text-secondary">Empty vector.</p>}
          {nums.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-accent bg-white font-mono text-sm font-semibold text-heading">
                {v}
              </div>
              <span className="text-xs text-secondary font-mono">{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="vector-index" className="text-sm font-medium text-heading">
            Index to access
          </label>
          <input
            id="vector-index"
            value={indexInput}
            onChange={(e) => setIndexInput(e.target.value)}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-20 font-mono"
          />
        </div>
        <button
          type="button"
          onClick={tryBracket}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Try nums[i]
        </button>
        <button
          type="button"
          onClick={tryAt}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Try nums.at(i)
        </button>
      </div>

      {result && result.kind === "ok" && (
        <div className="rounded-xl bg-muted p-4 text-sm font-mono text-heading">{result.text}</div>
      )}
      {result && (result.kind === "ub" || result.kind === "throw") && <ErrorPanel error={result.text} />}
    </div>
  );
}
