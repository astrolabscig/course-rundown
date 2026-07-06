"use client";

import { useLayoutEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type AccessLevel = "private" | "protected" | "public";

const childAccessResult: Record<AccessLevel, { allowed: boolean; reason: string }> = {
  private: {
    allowed: false,
    reason: "private members are not accessible in a derived class — Dog cannot name it directly.",
  },
  protected: {
    allowed: true,
    reason: "protected is reachable inside a derived class, while still hidden from outside code.",
  },
  public: {
    allowed: true,
    reason: "public members are accessible everywhere, including in a derived class.",
  },
};

interface NodeDef {
  id: string;
  name: string;
  parent: string | null;
  addedMember: string;
}

const nodes: NodeDef[] = [
  { id: "animal", name: "Animal", parent: null, addedMember: "eat()" },
  { id: "dog", name: "Dog", parent: "animal", addedMember: "bark()" },
  { id: "puppy", name: "Puppy", parent: "dog", addedMember: "play()" },
];

const inheritanceTypes = [
  { type: "Single", diagram: "Animal → Dog", desc: "One base class, one derived class." },
  { type: "Multilevel", diagram: "Animal → Dog → Puppy", desc: "A chain: a class derived from a class that is itself derived from another." },
  { type: "Multiple", diagram: "Flyer, Swimmer → Duck", desc: "One derived class with more than one base class." },
  { type: "Hierarchical", diagram: "Animal → Dog\nAnimal → Cat", desc: "One base class, several derived classes." },
  { type: "Hybrid", diagram: "Hierarchical + Multiple combined", desc: "A combination of more than one inheritance type in the same design." },
] as const;

type TypeName = (typeof inheritanceTypes)[number]["type"];

export default function InheritanceBuilder() {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [nameAccess, setNameAccess] = useState<AccessLevel>("protected");
  const [log, setLog] = useState<string[]>([]);
  const [phase, setPhase] = useState<"idle" | "constructing" | "constructed" | "destroying" | "destroyed">("idle");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, TypeName | null>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const interactedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [arrows, setArrows] = useState<{ key: string; x1: number; y1: number; x2: number; y2: number }[]>([]);

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const pairs = nodes
        .filter((n) => n.parent && connected.has(n.id))
        .map((n) => ({ from: n.id, to: n.parent as string }));
      const next: { key: string; x1: number; y1: number; x2: number; y2: number }[] = [];
      for (const pair of pairs) {
        const fromEl = boxRefs.current.get(pair.from);
        const toEl = boxRefs.current.get(pair.to);
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          next.push({
            key: `${pair.from}-${pair.to}`,
            x1: fromRect.left + fromRect.width / 2 - containerRect.left,
            y1: fromRect.top - containerRect.top,
            x2: toRect.left + toRect.width / 2 - containerRect.left,
            y2: toRect.bottom - containerRect.top,
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
  }, [connected]);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function connect(id: string) {
    setConnected((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    markInteracted();
  }

  const dogConnected = connected.has("dog");
  const puppyConnected = connected.has("puppy");
  const fullyConnected = dogConnected && puppyConnected;

  function runConstruction() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setLog([]);
    setPhase("constructing");
    const steps = ["Animal() constructor runs", "Dog() constructor runs", "Puppy() constructor runs"];
    steps.forEach((line, i) => {
      const t = setTimeout(() => {
        setLog((prev) => [...prev, line]);
        if (i === steps.length - 1) setPhase("constructed");
      }, (i + 1) * 500);
      timeoutsRef.current.push(t);
    });
    markInteracted();
  }

  function runDestruction() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setPhase("destroying");
    const steps = ["~Puppy() destructor runs", "~Dog() destructor runs", "~Animal() destructor runs"];
    steps.forEach((line, i) => {
      const t = setTimeout(() => {
        setLog((prev) => [...prev, line]);
        if (i === steps.length - 1) setPhase("destroyed");
      }, (i + 1) * 500);
      timeoutsRef.current.push(t);
    });
  }

  function resetDemo() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setLog([]);
    setPhase("idle");
  }

  function answerQuiz(id: string, answer: TypeName) {
    setQuizAnswers((prev) => ({ ...prev, [id]: answer }));
    markInteracted();
  }

  const access = childAccessResult[nameAccess];

  return (
    <div className="space-y-8">
      <ExplainerBox>
        <p>
          Inheritance is like a child inheriting traits from a parent: a{" "}
          <span className="font-mono">Dog</span> automatically gets everything an{" "}
          <span className="font-mono">Animal</span> already knows how to do (like{" "}
          <span className="font-mono">eat()</span>), without anyone rewriting that code — then Dog
          just adds its own extra trick (<span className="font-mono">bark()</span>) on top. And
          just like building a real house, you always pour the foundation before putting up walls:
          the base class finishes building itself first, before the derived class adds its own
          parts.
        </p>
      </ExplainerBox>

      {/* Hierarchy builder */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Build the hierarchy</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => connect("dog")}
            disabled={dogConnected}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {dogConnected ? "Dog inherits from Animal ✓" : "class Dog : public Animal"}
          </button>
          <button
            type="button"
            onClick={() => connect("puppy")}
            disabled={!dogConnected || puppyConnected}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {puppyConnected ? "Puppy inherits from Dog ✓" : "class Puppy : public Dog"}
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
                markerEnd="url(#inh-arrowhead)"
              />
            ))}
            <defs>
              <marker id="inh-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" />
              </marker>
            </defs>
          </svg>
          <div className="relative flex flex-col items-center gap-10">
            {nodes.map((node) => {
              const isConnected = node.parent === null || connected.has(node.id);
              const inheritedMembers = nodes
                .filter((n) => {
                  // ancestors reachable through the connected chain
                  let cur: NodeDef | undefined = node;
                  const chain: string[] = [];
                  while (cur?.parent) {
                    if (!connected.has(cur.id)) break;
                    chain.push(cur.parent);
                    cur = nodes.find((x) => x.id === cur!.parent);
                  }
                  return chain.includes(n.id);
                })
                .map((n) => n.addedMember);
              return (
                <div
                  key={node.id}
                  ref={(el) => {
                    if (el) boxRefs.current.set(node.id, el);
                    else boxRefs.current.delete(node.id);
                  }}
                  className={`rounded-xl border-2 px-4 py-2 text-sm font-mono bg-white transition-colors ${
                    isConnected ? "border-accent" : "border-card-border opacity-60"
                  }`}
                >
                  <div className="font-semibold text-heading">{node.name}</div>
                  <div className="text-body text-xs">
                    {[...inheritedMembers, node.addedMember].join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Access modifier toggle */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Toggle Animal&rsquo;s <span className="font-mono">name</span> member
        </h4>
        <div className="flex flex-wrap gap-2">
          {(["private", "protected", "public"] as AccessLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => {
                setNameAccess(level);
                markInteracted();
              }}
              aria-pressed={nameAccess === level}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                nameAccess === level
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-body border-card-border hover:border-accent"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        {!dogConnected ? (
          <p className="text-sm text-secondary">Connect Dog to Animal above to test this.</p>
        ) : (
          <div className="rounded-xl bg-muted p-4 text-sm">
            <p>
              Can <span className="font-mono">Dog</span> access <span className="font-mono">name</span>?{" "}
              <span className={access.allowed ? "text-success font-semibold" : "text-error font-semibold"}>
                {access.allowed ? "Yes" : "No"}
              </span>
              . {access.reason}
            </p>
          </div>
        )}
      </div>

      {/* Construction / destruction order */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Construction & destruction order</h4>
        {!fullyConnected ? (
          <p className="text-sm text-secondary">
            Connect both Dog and Puppy above to spawn a full Puppy object.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={runConstruction}
                disabled={phase === "constructing"}
                className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                Spawn a Puppy object (construct)
              </button>
              <button
                type="button"
                onClick={runDestruction}
                disabled={phase !== "constructed"}
                className="px-4 py-1.5 rounded-full border border-error text-error text-sm font-medium hover:bg-error-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Destroy it
              </button>
              <button
                type="button"
                onClick={resetDemo}
                className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
              >
                Reset
              </button>
            </div>
            {log.length > 0 && (
              <pre className="rounded-xl bg-[#1f1f1f] text-[#e8e8e8] font-mono text-sm p-4 whitespace-pre-wrap">
                {log.join("\n")}
              </pre>
            )}
            <p className="text-sm text-secondary">
              Notice: construction always runs base → derived (Animal, then Dog, then Puppy);
              destruction always runs the exact reverse (Puppy, then Dog, then Animal).
            </p>
          </div>
        )}
      </div>

      {/* 5 inheritance types recognition */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Name the inheritance type</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {inheritanceTypes.map((item) => {
            const answer = quizAnswers[item.type] ?? null;
            return (
              <div key={item.type} className="rounded-xl border border-card-border bg-white p-4 space-y-2">
                <pre className="text-sm font-mono text-body whitespace-pre-wrap">{item.diagram}</pre>
                <div className="flex flex-wrap gap-1.5">
                  {inheritanceTypes.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => answerQuiz(item.type, opt.type)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        answer === opt.type
                          ? opt.type === item.type
                            ? "bg-success text-white border-success"
                            : "bg-error text-white border-error"
                          : "bg-white text-body border-card-border hover:border-accent"
                      }`}
                    >
                      {opt.type}
                    </button>
                  ))}
                </div>
                {answer && (
                  <p className={`text-sm ${answer === item.type ? "text-success" : "text-error"}`}>
                    {answer === item.type ? "Correct — " : `Not quite — this is ${item.type}. `}
                    {item.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
