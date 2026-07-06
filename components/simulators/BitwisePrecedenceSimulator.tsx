"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function toDecimal(bits: number[]): number {
  return bits.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0);
}

function BitsRow({
  label,
  bits,
  onToggle,
}: {
  label: string;
  bits: number[];
  onToggle?: (i: number) => void;
}) {
  const editable = Boolean(onToggle);
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="w-16 shrink-0 text-xs font-semibold text-secondary uppercase tracking-wide">
        {label}
      </span>
      <div className="flex gap-1">
        {bits.map((b, i) => (
          <button
            key={i}
            type="button"
            disabled={!editable}
            onClick={() => onToggle && onToggle(i)}
            className={`h-8 w-8 rounded font-mono text-sm font-bold transition-colors ${
              b ? "bg-accent text-white" : "bg-white border border-card-border text-secondary"
            } ${editable ? "cursor-pointer hover:opacity-80" : ""}`}
          >
            {b}
          </button>
        ))}
      </div>
      <span className="text-sm text-secondary font-mono">= {toDecimal(bits)}</span>
    </div>
  );
}

const precedenceSteps = [
  {
    expr: "2 + 3 * 4 - 1",
    highlight: "3 * 4",
    narration: "* and / bind tighter than + and -, so 3 * 4 is evaluated first.",
  },
  {
    expr: "2 + 12 - 1",
    highlight: "2 + 12",
    narration: "+ and - have equal precedence, so C++ evaluates left to right: 2 + 12 next.",
  },
  {
    expr: "14 - 1",
    highlight: "14 - 1",
    narration: "Only one operation left: 14 - 1.",
  },
  {
    expr: "13",
    highlight: "13",
    narration: "Final result: 13. Getting the order wrong (e.g. doing 2+3 first) would give a completely different, wrong answer.",
  },
];

export default function BitwisePrecedenceSimulator() {
  const [a, setA] = useState([0, 1, 0, 1, 1, 0, 1, 0]);
  const [b, setB] = useState([0, 0, 1, 1, 0, 0, 1, 1]);
  const [precIndex, setPrecIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function toggle(setter: (v: number[]) => void, bits: number[], i: number) {
    const next = [...bits];
    next[i] = next[i] ? 0 : 1;
    setter(next);
    markInteracted();
  }

  const and = a.map((v, i) => v & b[i]);
  const or = a.map((v, i) => v | b[i]);
  const xor = a.map((v, i) => v ^ b[i]);
  const notA = a.map((v) => (v ? 0 : 1));

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <ExplainerBox title="What do & | ^ ~ actually do?">
          <p>
            Bitwise operators work on the individual 1s and 0s inside a number, like flipping
            switches on a panel one at a time. <span className="font-mono">&amp;</span> (AND)
            only keeps a 1 where BOTH switches are on; <span className="font-mono">|</span> (OR)
            keeps a 1 where EITHER is on; <span className="font-mono">^</span> (XOR) keeps a 1
            only where they DISAGREE; <span className="font-mono">~</span> (NOT) simply flips every
            switch to its opposite.
          </p>
        </ExplainerBox>

        <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
            Click any bit of A or B to toggle it
          </p>
          <BitsRow label="A" bits={a} onToggle={(i) => toggle(setA, a, i)} />
          <BitsRow label="B" bits={b} onToggle={(i) => toggle(setB, b, i)} />
          <div className="border-t border-card-border my-1" />
          <BitsRow label="A & B" bits={and} />
          <BitsRow label="A | B" bits={or} />
          <BitsRow label="A ^ B" bits={xor} />
          <BitsRow label="~A" bits={notA} />
        </div>
      </div>

      <div className="space-y-3">
        <ExplainerBox title="Why does order of operations trip people up?">
          <p>
            C++ doesn&rsquo;t evaluate an expression strictly left to right — just like in maths
            class, multiplication and division happen before addition and subtraction. Forgetting
            this is one of the most common sources of &ldquo;predict the output&rdquo; exam
            mistakes.
          </p>
        </ExplainerBox>

        <div className="rounded-2xl border border-card-border bg-code-bg p-4 font-mono text-lg text-center">
          {precedenceSteps[precIndex].expr}
        </div>
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-body">{precedenceSteps[precIndex].narration}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setPrecIndex((i) => Math.max(0, i - 1));
              markInteracted();
            }}
            disabled={precIndex === 0}
            className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => {
              setPrecIndex((i) => Math.min(precedenceSteps.length - 1, i + 1));
              markInteracted();
            }}
            disabled={precIndex === precedenceSteps.length - 1}
            className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
          >
            ▶
          </button>
          <span className="text-sm text-secondary">
            Step {precIndex + 1} of {precedenceSteps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
