"use client";

import { useEffect, useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `void c() {
    throw std::runtime_error("something went wrong");  // throw
}
void b() { c(); }   // no try/catch here
void a() { b(); }   // no try/catch here either

int main() {
    try {
        a();
    } catch (const std::runtime_error& e) {   // catch
        std::cout << "Caught: " << e.what() << "\\n";
    }
}`;

type FrameStatus = "normal" | "throwing" | "propagating" | "caught";

interface Frame {
  label: string;
  status: FrameStatus;
}

interface Stage {
  stack: Frame[];
  narration: string;
  output?: string;
}

const stages: Stage[] = [
  {
    stack: [{ label: "main()  [try { ... }]", status: "normal" }],
    narration: "main() enters a try block and calls a().",
  },
  {
    stack: [
      { label: "main()  [try { ... }]", status: "normal" },
      { label: "a()", status: "normal" },
    ],
    narration: "a() has no try/catch of its own — it just calls b().",
  },
  {
    stack: [
      { label: "main()  [try { ... }]", status: "normal" },
      { label: "a()", status: "normal" },
      { label: "b()", status: "normal" },
    ],
    narration: "b() also has no try/catch — it calls c().",
  },
  {
    stack: [
      { label: "main()  [try { ... }]", status: "normal" },
      { label: "a()", status: "normal" },
      { label: "b()", status: "normal" },
      { label: "c()", status: "normal" },
    ],
    narration: "c() runs — and hits the throw statement.",
  },
  {
    stack: [
      { label: "main()  [try { ... }]", status: "normal" },
      { label: "a()", status: "normal" },
      { label: "b()", status: "normal" },
      { label: "c()", status: "throwing" },
    ],
    narration:
      "💥 An exception object is created and thrown. c() has no catch, so it can't handle it here — normal execution in c() stops immediately.",
  },
  {
    stack: [
      { label: "main()  [try { ... }]", status: "normal" },
      { label: "a()", status: "normal" },
      { label: "b()", status: "propagating" },
    ],
    narration:
      "The exception propagates up to b(). b() has no matching catch either, so it's skipped too — any code after the call to c() in b() never runs.",
  },
  {
    stack: [
      { label: "main()  [try { ... }]", status: "normal" },
      { label: "a()", status: "propagating" },
    ],
    narration: "Up to a() next — still no catch here, so it's skipped over as well.",
  },
  {
    stack: [{ label: "main()  [try { ... }]", status: "caught" }],
    narration:
      "The exception reaches main()'s try block, which DOES have a matching catch(const std::runtime_error&) — execution jumps straight into that catch block.",
  },
  {
    stack: [{ label: "main()  [catch handled ✓]", status: "caught" }],
    narration: "The catch block runs and prints its message. The program then continues normally right after the try/catch.",
    output: "Caught: something went wrong",
  },
];

function frameClasses(status: FrameStatus): string {
  switch (status) {
    case "throwing":
      return "border-error bg-error-bg text-error";
    case "propagating":
      return "border-accent-warm bg-accent-warm-bg text-heading";
    case "caught":
      return "border-success bg-white text-success";
    default:
      return "border-accent bg-white text-heading";
  }
}

export default function ExceptionSimulator() {
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
    }, 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  function play() {
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
      <ExplainerBox title="What does throw/catch actually do to the call stack?">
        <p>
          A thrown exception is like an alarm going off deep inside a building: it doesn&rsquo;t
          wait for whoever&rsquo;s in that room to finish their work — it immediately starts
          searching upward, floor by floor, for the first room with a fire marshal (a matching{" "}
          <span className="font-mono">catch</span>) who knows what to do. Every floor in between
          without a marshal is simply evacuated (unwound) without finishing what it was doing.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <button
        type="button"
        onClick={play}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        ▶ Play the exception propagating
      </button>

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
          Call stack (top = most recent call)
        </div>
        <div className="flex flex-col-reverse gap-1.5 min-h-[3rem]">
          {visualStack.map((frame, i) => (
            <div
              key={i}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-mono transition-colors ${frameClasses(frame.status)}`}
            >
              {frame.label}
              {frame.status === "throwing" && <span className="font-semibold"> — throw!</span>}
              {frame.status === "propagating" && <span className="font-semibold"> — unwound, no catch</span>}
              {frame.status === "caught" && frame.label.includes("handled") && (
                <span className="font-semibold"> — exception handled</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{stage.narration}</p>
      </div>

      {stage.output && <OutputPanel output={stage.output} />}

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
