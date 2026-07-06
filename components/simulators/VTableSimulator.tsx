"use client";

import { useLayoutEffect, useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const setupCode = `class Animal {
public:
    /* virtual */ void speak() { std::cout << "...\\n"; }   // toggle "virtual" below
};

class Dog : public Animal {
public:
    void speak() { std::cout << "Woof\\n"; }
};

int main() {
    Animal *p = new Dog();
    p->speak();     // what gets called depends on virtual on/off
}`;

interface Arrow {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function DispatchDiagram({ isVirtual }: { isVirtual: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [arrows, setArrows] = useState<Arrow[]>([]);

  const pairs = isVirtual
    ? [
        { from: "pointer", to: "object" },
        { from: "object", to: "vtable" },
        { from: "vtable", to: "dogSpeak" },
      ]
    : [{ from: "pointer", to: "animalSpeak" }];

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next: Arrow[] = [];
      for (const pair of pairs) {
        const fromEl = boxRefs.current.get(pair.from);
        const toEl = boxRefs.current.get(pair.to);
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          next.push({
            key: `${pair.from}-${pair.to}`,
            x1: fromRect.left + fromRect.width / 2 - containerRect.left,
            y1: fromRect.bottom - containerRect.top,
            x2: toRect.left + toRect.width / 2 - containerRect.left,
            y2: toRect.top - containerRect.top,
          });
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVirtual]);

  function box(id: string, label: string, sub?: string, highlight?: boolean) {
    return (
      <div
        ref={(el) => {
          if (el) boxRefs.current.set(id, el);
          else boxRefs.current.delete(id);
        }}
        className={`rounded-lg border-2 px-3 py-2 text-sm font-mono bg-white text-center ${
          highlight ? "border-accent" : "border-card-border"
        }`}
      >
        <div className="font-semibold text-heading">{label}</div>
        {sub && <div className="text-secondary text-xs">{sub}</div>}
      </div>
    );
  }

  return (
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
            markerEnd="url(#vtable-arrowhead)"
          />
        ))}
        <defs>
          <marker id="vtable-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" />
          </marker>
        </defs>
      </svg>

      <div className="relative flex flex-col items-center gap-8">
        {box("pointer", "p (Animal*)", "static type: Animal", true)}

        {isVirtual ? (
          <>
            {box("object", "Dog object", "contains vptr", true)}
            {box("vtable", "Dog vtable", "speak → Dog::speak", true)}
            {box("dogSpeak", "Dog::speak()", 'prints "Woof"', true)}
          </>
        ) : (
          box("animalSpeak", "Animal::speak()", 'prints "..."', true)
        )}
      </div>
    </div>
  );
}

export default function VTableSimulator() {
  const [isVirtual, setIsVirtual] = useState(false);
  const [called, setCalled] = useState(false);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function toggleVirtual() {
    setIsVirtual((v) => !v);
    setCalled(false);
    markInteracted();
  }

  function callSpeak() {
    setCalled(true);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="What is a vtable and a vptr — and why does it exist?">
        <p>
          Imagine a restaurant chain where every branch shares the same menu item name,
          &ldquo;today&rsquo;s special,&rdquo; but each branch actually cooks something different
          for it. Every branch secretly keeps a card behind the counter saying &ldquo;when someone
          orders today&rsquo;s special HERE, that actually means make THIS dish.&rdquo; That card
          is the <strong>vtable</strong> (virtual table) — a lookup list mapping a method name to
          the actual code to run for this specific object&rsquo;s real type.
        </p>
        <p>
          The <strong>vptr</strong> (virtual pointer) is simply which branch&rsquo;s card a given
          object is carrying — a hidden pointer inside every object of a class with virtual
          functions, pointing at its own class&rsquo;s vtable. That&rsquo;s the whole trick behind
          runtime polymorphism: the object itself remembers what it really is, even when you&rsquo;re
          only holding onto it through a more general pointer type.
        </p>
      </ExplainerBox>

      <CodeBlock code={setupCode} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleVirtual}
          aria-pressed={isVirtual}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            isVirtual
              ? "bg-accent text-white border-accent"
              : "bg-white text-body border-card-border hover:border-accent"
          }`}
        >
          virtual: {isVirtual ? "on" : "off"}
        </button>
        <button
          type="button"
          onClick={callSpeak}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Call p-&gt;speak()
        </button>
      </div>

      <DispatchDiagram isVirtual={isVirtual} />

      {called && (
        <OutputPanel output={isVirtual ? "Woof" : "..."} />
      )}

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm font-medium text-heading">
          No virtual: the pointer decides. Virtual: the object decides.
        </p>
        <p className="text-sm text-body mt-1">
          {isVirtual
            ? "With virtual, the call is resolved at runtime: p follows the object's vptr into Dog's vtable and finds Dog::speak."
            : "Without virtual, the call is resolved at compile time using p's static type (Animal*), so it always calls Animal::speak — regardless of what p actually points to."}
        </p>
      </div>
    </div>
  );
}
