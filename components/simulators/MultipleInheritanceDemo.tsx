"use client";

import { useLayoutEffect, useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `class Flyer {
public:
    void fly() { std::cout << "Flying\\n"; }
};

class Swimmer {
public:
    void swim() { std::cout << "Swimming\\n"; }
};

class Duck : public Flyer, public Swimmer {   // TWO base classes at once
public:
    void quack() { std::cout << "Quack!\\n"; }
};`;

export default function MultipleInheritanceDemo() {
  const [fromFlyer, setFromFlyer] = useState(false);
  const [fromSwimmer, setFromSwimmer] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const swimmerRef = useRef<HTMLDivElement>(null);
  const duckRef = useRef<HTMLDivElement>(null);
  const interactedRef = useRef(false);
  const [arrows, setArrows] = useState<{ key: string; x1: number; y1: number; x2: number; y2: number }[]>([]);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current;
      const duck = duckRef.current;
      if (!container || !duck) return;
      const containerRect = container.getBoundingClientRect();
      const duckRect = duck.getBoundingClientRect();
      const next: { key: string; x1: number; y1: number; x2: number; y2: number }[] = [];

      if (fromFlyer && flyerRef.current) {
        const r = flyerRef.current.getBoundingClientRect();
        next.push({
          key: "flyer",
          x1: duckRect.left + duckRect.width / 2 - containerRect.left,
          y1: duckRect.top - containerRect.top,
          x2: r.left + r.width / 2 - containerRect.left,
          y2: r.bottom - containerRect.top,
        });
      }
      if (fromSwimmer && swimmerRef.current) {
        const r = swimmerRef.current.getBoundingClientRect();
        next.push({
          key: "swimmer",
          x1: duckRect.left + duckRect.width / 2 - containerRect.left,
          y1: duckRect.top - containerRect.top,
          x2: r.left + r.width / 2 - containerRect.left,
          y2: r.bottom - containerRect.top,
        });
      }
      setArrows(next);
    }
    recompute();
    const observer = new ResizeObserver(recompute);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [fromFlyer, fromSwimmer]);

  const duckMembers = ["quack()", ...(fromFlyer ? ["fly()"] : []), ...(fromSwimmer ? ["swim()"] : [])];

  return (
    <div className="space-y-4">
      <ExplainerBox title="What makes this 'multiple' inheritance?">
        <p>
          Regular (single) inheritance is one parent, one child. Multiple inheritance is a class
          inheriting from <strong>two or more</strong> base classes at once — like a duck being
          both &ldquo;a flying animal&rdquo; and &ldquo;a swimming animal&rdquo; at the same time,
          picking up abilities from both family trees rather than just one.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setFromFlyer(true);
            markInteracted();
          }}
          disabled={fromFlyer}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fromFlyer ? "Duck inherits from Flyer ✓" : "class Duck : public Flyer"}
        </button>
        <button
          type="button"
          onClick={() => {
            setFromSwimmer(true);
            markInteracted();
          }}
          disabled={fromSwimmer}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fromSwimmer ? "Duck inherits from Swimmer ✓" : ", public Swimmer"}
        </button>
      </div>

      <div ref={containerRef} className="relative rounded-2xl border border-card-border bg-muted p-6">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {arrows.map((a) => (
            <line
              key={a.key}
              x1={a.x1}
              y1={a.y1}
              x2={a.x2}
              y2={a.y2}
              stroke="var(--color-accent)"
              strokeWidth={2}
              markerEnd="url(#mi-arrowhead)"
            />
          ))}
          <defs>
            <marker id="mi-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" />
            </marker>
          </defs>
        </svg>

        <div className="relative flex items-start justify-center gap-16">
          <div
            ref={flyerRef}
            className={`rounded-xl border-2 px-4 py-2 text-sm font-mono bg-white transition-colors ${
              fromFlyer ? "border-accent" : "border-card-border opacity-60"
            }`}
          >
            <div className="font-semibold text-heading">Flyer</div>
            <div className="text-body text-xs">fly()</div>
          </div>
          <div
            ref={swimmerRef}
            className={`rounded-xl border-2 px-4 py-2 text-sm font-mono bg-white transition-colors ${
              fromSwimmer ? "border-accent" : "border-card-border opacity-60"
            }`}
          >
            <div className="font-semibold text-heading">Swimmer</div>
            <div className="text-body text-xs">swim()</div>
          </div>
        </div>

        <div className="relative flex justify-center mt-10">
          <div
            ref={duckRef}
            className="rounded-xl border-2 border-accent px-4 py-2 text-sm font-mono bg-white"
          >
            <div className="font-semibold text-heading">Duck</div>
            <div className="text-body text-xs">{duckMembers.join(", ")}</div>
          </div>
        </div>
      </div>

      {fromFlyer && fromSwimmer && (
        <div className="rounded-xl bg-accent-warm-bg p-4 text-sm text-heading">
          Duck now has fly(), swim(), and quack() — picked up from two completely separate base
          classes at once. (A real risk with multiple inheritance: if Flyer and Swimmer both
          declared a method with the same name, calling it on a Duck would be ambiguous — the
          compiler wouldn&rsquo;t know which one you meant without you specifying it explicitly.)
        </div>
      )}
    </div>
  );
}
