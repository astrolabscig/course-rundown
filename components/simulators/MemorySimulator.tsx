"use client";

import { useLayoutEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type Kind = "value" | "pointer";

interface Box {
  id: string;
  name: string;
  value: string;
  address: string;
  kind: Kind;
  region: "stack" | "heap";
  pointsTo?: string;
  dangling?: boolean;
  leaked?: boolean;
}

let addrCounter = 0;
function nextAddress() {
  addrCounter += 4;
  return "0x7ffe" + (0x2000 + addrCounter).toString(16);
}

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}

interface Arrow {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function MemorySimulator() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [linkingPointerId, setLinkingPointerId] = useState<string | null>(null);
  const [selectedPointerId, setSelectedPointerId] = useState<string | null>(null);
  const [varName, setVarName] = useState("");
  const [varValue, setVarValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [arrows, setArrows] = useState<Arrow[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next: Arrow[] = [];
      for (const box of boxes) {
        if (box.kind === "pointer" && box.pointsTo && !box.dangling) {
          const fromEl = boxRefs.current.get(box.id);
          const toEl = boxRefs.current.get(box.pointsTo);
          if (fromEl && toEl) {
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            next.push({
              key: box.id,
              x1: fromRect.left + fromRect.width / 2 - containerRect.left,
              y1: fromRect.bottom - containerRect.top,
              x2: toRect.left + toRect.width / 2 - containerRect.left,
              y2: toRect.top - containerRect.top,
            });
          }
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
  }, [boxes]);

  function addVariable(e: React.FormEvent) {
    e.preventDefault();
    if (!varName.trim()) return;
    const box: Box = {
      id: nextId("box"),
      name: varName.trim(),
      value: varValue.trim() || "0",
      address: nextAddress(),
      kind: "value",
      region: "stack",
    };
    setBoxes((prev) => [...prev, box]);
    setVarName("");
    setVarValue("");
    setShowAddForm(false);
    markInteracted();
  }

  function addPointer() {
    const count = boxes.filter((b) => b.kind === "pointer").length + 1;
    const box: Box = {
      id: nextId("box"),
      name: `p${count}`,
      value: "nullptr",
      address: nextAddress(),
      kind: "pointer",
      region: "stack",
    };
    setBoxes((prev) => [...prev, box]);
    markInteracted();
  }

  function allocateHeap() {
    const heapBox: Box = {
      id: nextId("box"),
      name: "block",
      value: "42",
      address: nextAddress(),
      kind: "value",
      region: "heap",
    };
    const count = boxes.filter((b) => b.kind === "pointer").length + 1;
    const ptrBox: Box = {
      id: nextId("box"),
      name: `p${count}`,
      value: heapBox.address,
      address: nextAddress(),
      kind: "pointer",
      region: "stack",
      pointsTo: heapBox.id,
    };
    setBoxes((prev) => [...prev, heapBox, ptrBox]);
    markInteracted();
  }

  function beginLink(pointerId: string) {
    setSelectedPointerId(null);
    setLinkingPointerId((current) => (current === pointerId ? null : pointerId));
  }

  function completeLink(targetId: string) {
    if (!linkingPointerId || targetId === linkingPointerId) return;
    setBoxes((prev) =>
      prev.map((b) => {
        if (b.id !== linkingPointerId) return b;
        const target = prev.find((t) => t.id === targetId);
        return { ...b, pointsTo: targetId, value: target?.address ?? b.value, dangling: false };
      })
    );
    setLinkingPointerId(null);
    markInteracted();
  }

  function deleteHeapVia(pointerId: string) {
    setBoxes((prev) => {
      const ptr = prev.find((b) => b.id === pointerId);
      const targetId = ptr?.pointsTo;
      return prev
        .filter((b) => b.id !== targetId)
        .map((b) =>
          b.id === pointerId
            ? { ...b, pointsTo: undefined, dangling: true, value: "freed" }
            : b
        );
    });
    setSelectedPointerId(pointerId);
    markInteracted();
  }

  function removeBox(id: string) {
    setBoxes((prev) => {
      const removed = prev.find((b) => b.id === id);
      let next = prev.filter((b) => b.id !== id);
      if (removed?.kind === "pointer" && removed.pointsTo) {
        const stillReferenced = next.some((b) => b.pointsTo === removed.pointsTo);
        if (!stillReferenced) {
          next = next.map((b) =>
            b.id === removed.pointsTo ? { ...b, leaked: true } : b
          );
        }
      }
      return next;
    });
    if (selectedPointerId === id) setSelectedPointerId(null);
    if (linkingPointerId === id) setLinkingPointerId(null);
    markInteracted();
  }

  function editTargetValue(pointerId: string, newValue: string) {
    setBoxes((prev) => {
      const ptr = prev.find((b) => b.id === pointerId);
      if (!ptr?.pointsTo) return prev;
      return prev.map((b) => (b.id === ptr.pointsTo ? { ...b, value: newValue } : b));
    });
  }

  function selectPointer(id: string) {
    if (linkingPointerId) return;
    setSelectedPointerId((current) => (current === id ? null : id));
  }

  const stackBoxes = boxes.filter((b) => b.region === "stack");
  const heapBoxes = boxes.filter((b) => b.region === "heap");
  const selectedPointer = boxes.find((b) => b.id === selectedPointerId);
  const selectedTarget = selectedPointer?.pointsTo
    ? boxes.find((b) => b.id === selectedPointer.pointsTo)
    : undefined;

  function boxClasses(box: Box, isLinkTarget: boolean) {
    if (box.leaked) return "border-error bg-error-bg";
    if (box.dangling) return "border-secondary bg-white border-dashed opacity-70";
    if (isLinkTarget) return "border-accent bg-white ring-2 ring-accent cursor-pointer";
    if (box.kind === "pointer") return "border-accent bg-white cursor-pointer";
    return "border-card-border bg-white";
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="What are the Stack and Heap?">
        <p>
          The <strong>Stack</strong> is like a small desk drawer: every normal variable you create
          goes here, and it&rsquo;s cleaned out automatically the moment it&rsquo;s no longer needed.
          Fast, tidy, but limited in space.
        </p>
        <p>
          The <strong>Heap</strong> is like a storage unit you rent yourself with{" "}
          <span className="font-mono">new</span>: nothing empties it for you, so whatever you put
          there stays until you explicitly free it with <span className="font-mono">delete</span>{" "}
          — forget, and you&rsquo;re quietly &ldquo;paying rent&rdquo; on space you don&rsquo;t need
          anymore (a memory leak).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          + Variable
        </button>
        <button
          type="button"
          onClick={addPointer}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          + Pointer
        </button>
        <button
          type="button"
          onClick={allocateHeap}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          new int(42) — allocate on heap
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={addVariable} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="mem-var-name" className="text-sm font-medium text-heading">
              Name
            </label>
            <input
              id="mem-var-name"
              value={varName}
              onChange={(e) => setVarName(e.target.value)}
              placeholder="score"
              className="rounded-full border border-card-border px-3 py-1.5 text-sm w-32"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="mem-var-value" className="text-sm font-medium text-heading">
              Value
            </label>
            <input
              id="mem-var-value"
              value={varValue}
              onChange={(e) => setVarValue(e.target.value)}
              placeholder="42"
              className="rounded-full border border-card-border px-3 py-1.5 text-sm w-24"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Create
          </button>
        </form>
      )}

      {linkingPointerId && (
        <p className="text-sm text-accent font-medium">
          Click a box below to point to it.
        </p>
      )}

      <div ref={containerRef} className="relative rounded-2xl border border-card-border bg-muted p-4">
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
              markerEnd="url(#mem-arrowhead)"
            />
          ))}
          <defs>
            <marker id="mem-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" />
            </marker>
          </defs>
        </svg>

        <div className="relative space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
              Stack
            </div>
            <div className="flex flex-wrap gap-3 min-h-[3rem]">
              {stackBoxes.length === 0 && (
                <p className="text-sm text-secondary">No stack variables yet.</p>
              )}
              {stackBoxes.map((box) => (
                <div
                  key={box.id}
                  ref={(el) => {
                    if (el) boxRefs.current.set(box.id, el);
                    else boxRefs.current.delete(box.id);
                  }}
                  onClick={() => {
                    if (linkingPointerId) {
                      completeLink(box.id);
                      return;
                    }
                    if (box.kind === "pointer") selectPointer(box.id);
                  }}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-mono transition-colors ${boxClasses(
                    box,
                    Boolean(linkingPointerId) && box.id !== linkingPointerId
                  )}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-heading">{box.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBox(box.id);
                      }}
                      aria-label={`Remove ${box.name}`}
                      className="text-secondary hover:text-error text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-secondary text-xs">{box.address}</div>
                  <div className="text-body">
                    {box.kind === "pointer" ? `→ ${box.value}` : box.value}
                  </div>
                  {box.kind === "pointer" && !box.dangling && (
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          beginLink(box.id);
                        }}
                        className="text-xs text-accent hover:underline"
                      >
                        {linkingPointerId === box.id ? "cancel" : "point to…"}
                      </button>
                      {box.pointsTo && heapBoxes.some((h) => h.id === box.pointsTo) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHeapVia(box.id);
                          }}
                          className="text-xs text-error hover:underline"
                        >
                          delete
                        </button>
                      )}
                    </div>
                  )}
                  {box.dangling && (
                    <div className="mt-1 text-xs text-secondary italic">dangling</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
              Heap
            </div>
            <div className="flex flex-wrap gap-3 min-h-[3rem]">
              {heapBoxes.length === 0 && (
                <p className="text-sm text-secondary">Nothing allocated yet.</p>
              )}
              {heapBoxes.map((box) => (
                <div
                  key={box.id}
                  ref={(el) => {
                    if (el) boxRefs.current.set(box.id, el);
                    else boxRefs.current.delete(box.id);
                  }}
                  onClick={() => {
                    if (linkingPointerId) completeLink(box.id);
                  }}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-mono transition-colors ${boxClasses(
                    box,
                    Boolean(linkingPointerId)
                  )}`}
                >
                  <div className="font-semibold text-heading">{box.name}</div>
                  <div className="text-secondary text-xs">{box.address}</div>
                  <div className="text-body">{box.value}</div>
                  {box.leaked && (
                    <div className="mt-1 text-xs text-error font-semibold">
                      LEAKED — unreachable, never freed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedPointer && (
        <div className="rounded-xl bg-muted p-4 text-sm">
          {selectedPointer.dangling ? (
            <p className="text-error font-medium">
              Runtime warning: dereferencing <span className="font-mono">*{selectedPointer.name}</span> after{" "}
              <span className="font-mono">delete</span> — undefined behaviour (use-after-free).
            </p>
          ) : selectedTarget ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-heading">
                *{selectedPointer.name} ={" "}
              </span>
              <input
                value={selectedTarget.value}
                onChange={(e) => editTargetValue(selectedPointer.id, e.target.value)}
                className="rounded-full border border-card-border px-3 py-1 text-sm w-24 font-mono"
              />
              <span className="text-secondary">
                (editing this changes <span className="font-mono">{selectedTarget.name}</span> live)
              </span>
            </div>
          ) : (
            <p className="text-secondary">
              <span className="font-mono">{selectedPointer.name}</span> is nullptr — dereferencing it
              crashes the program (segmentation fault).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
