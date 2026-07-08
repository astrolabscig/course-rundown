"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Node {
  id: number;
  left: Node | null;
  right: Node | null;
}

function buildCompleteTree(count: number): Node {
  function make(i: number): Node | null {
    if (i > count) return null;
    return { id: i, left: make(2 * i), right: make(2 * i + 1) };
  }
  return make(1)!;
}

const tree = buildCompleteTree(16);

function preorder(node: Node | null, out: number[]) {
  if (!node) return;
  out.push(node.id);
  preorder(node.left, out);
  preorder(node.right, out);
}
function inorder(node: Node | null, out: number[]) {
  if (!node) return;
  inorder(node.left, out);
  out.push(node.id);
  inorder(node.right, out);
}
function postorder(node: Node | null, out: number[]) {
  if (!node) return;
  postorder(node.left, out);
  postorder(node.right, out);
  out.push(node.id);
}

function layout(node: Node | null, depth: number, xStart: number, xEnd: number, out: { x: number; y: number; id: number; parentX?: number; parentY?: number }[], parent?: { x: number; y: number }) {
  if (!node) return;
  const x = (xStart + xEnd) / 2;
  const y = 30 + depth * 55;
  out.push({ x, y, id: node.id, parentX: parent?.x, parentY: parent?.y });
  layout(node.left, depth + 1, xStart, x, out, { x, y });
  layout(node.right, depth + 1, x, xEnd, out, { x, y });
}

const nodePositions = (() => {
  const out: { x: number; y: number; id: number; parentX?: number; parentY?: number }[] = [];
  layout(tree, 0, 10, 630, out);
  return out;
})();

const orders = {
  preorder: (() => {
    const out: number[] = [];
    preorder(tree, out);
    return out;
  })(),
  inorder: (() => {
    const out: number[] = [];
    inorder(tree, out);
    return out;
  })(),
  postorder: (() => {
    const out: number[] = [];
    postorder(tree, out);
    return out;
  })(),
};

export default function TreeTraversalAnimator() {
  const [mode, setMode] = useState<"preorder" | "inorder" | "postorder">("preorder");
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const sequence = orders[mode];
  const clampedIndex = Math.min(index, sequence.length - 1);
  const visited = sequence.slice(0, clampedIndex + 1);

  function go(delta: number) {
    setIndex((i) => Math.min(sequence.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  const descriptions: Record<typeof mode, string> = {
    preorder: "Visit the node itself FIRST, then recurse left, then recurse right (root, left, right).",
    inorder: "Recurse left FIRST, then visit the node itself, then recurse right (left, root, right) — for a binary search tree this visits values in sorted order.",
    postorder: "Recurse left, then recurse right, then visit the node itself LAST (left, right, root).",
  };

  return (
    <div className="space-y-4">
      <ExplainerBox title="Same tree, three different visiting orders">
        <p>
          All three traversals explore the exact same tree — the only difference is WHEN each node
          gets added to the list relative to its children. Step through below and watch the same
          16-node tree produce three completely different sequences (Rosen 11.3, Examples 2-4).
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(["preorder", "inorder", "postorder"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setIndex(0);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition-colors ${
              mode === m ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <p className="text-xs text-secondary">{descriptions[mode]}</p>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox="0 0 640 260" className="w-full min-w-[560px]">
          {nodePositions.map((n, i) =>
            n.parentX !== undefined ? (
              <line key={`l${i}`} x1={n.parentX} y1={n.parentY! + 12} x2={n.x} y2={n.y - 12} stroke="var(--card-border)" strokeWidth="1.5" />
            ) : null
          )}
          {nodePositions.map((n) => {
            const visitOrder = visited.indexOf(n.id);
            const isCurrent = n.id === sequence[clampedIndex];
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r="14" fill={isCurrent ? "#4F7CFF" : visitOrder >= 0 ? "#EAF2FF" : "white"} stroke={isCurrent ? "#4F7CFF" : visitOrder >= 0 ? "#4F7CFF" : "var(--card-border)"} strokeWidth="2" />
                <text x={n.x} y={n.y + 4} textAnchor="middle" className={`text-[10px] font-mono font-bold ${isCurrent ? "fill-white" : "fill-heading"}`}>
                  {n.id}
                </text>
                {visitOrder >= 0 && (
                  <text x={n.x} y={n.y - 20} textAnchor="middle" className="fill-accent text-[9px] font-mono font-bold">
                    #{visitOrder + 1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-xl bg-muted p-4 text-sm font-mono text-body">
        Sequence so far: {visited.join(" → ")}
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
          Step {clampedIndex + 1} of {sequence.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={clampedIndex === sequence.length - 1}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
