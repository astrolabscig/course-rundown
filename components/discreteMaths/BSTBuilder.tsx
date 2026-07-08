"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface BstNode {
  value: string;
  left: BstNode | null;
  right: BstNode | null;
}

const words = ["mathematics", "physics", "geography", "zoology", "meteorology", "geology", "psychology", "chemistry"];

interface Step {
  word: string;
  narration: string;
  tree: BstNode | null;
}

function cloneTree(node: BstNode | null): BstNode | null {
  if (!node) return null;
  return { value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function buildSteps(): Step[] {
  const steps: Step[] = [];
  let root: BstNode | null = null;

  for (const word of words) {
    if (!root) {
      root = { value: word, left: null, right: null };
      steps.push({ word, narration: `"${word}" becomes the root — the tree was empty.`, tree: cloneTree(root) });
      continue;
    }
    let cur = root;
    const path: string[] = [];
    while (true) {
      if (word < cur.value) {
        path.push(`"${word}" < "${cur.value}" alphabetically → go left`);
        if (!cur.left) {
          cur.left = { value: word, left: null, right: null };
          break;
        }
        cur = cur.left;
      } else {
        path.push(`"${word}" > "${cur.value}" alphabetically → go right`);
        if (!cur.right) {
          cur.right = { value: word, left: null, right: null };
          break;
        }
        cur = cur.right;
      }
    }
    steps.push({ word, narration: path.join("; ") + ".", tree: cloneTree(root) });
  }
  return steps;
}

function layout(node: BstNode | null, depth: number, xStart: number, xEnd: number, out: { x: number; y: number; node: BstNode; parentX?: number; parentY?: number }[], parent?: { x: number; y: number }) {
  if (!node) return;
  const x = (xStart + xEnd) / 2;
  const y = 30 + depth * 55;
  out.push({ x, y, node, parentX: parent?.x, parentY: parent?.y });
  layout(node.left, depth + 1, xStart, x, out, { x, y });
  layout(node.right, depth + 1, x, xEnd, out, { x, y });
}

export default function BSTBuilder() {
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const steps = useMemo(() => buildSteps(), []);
  const clampedIndex = Math.min(index, steps.length - 1);
  const step = steps[clampedIndex];

  const nodes = useMemo(() => {
    const out: { x: number; y: number; node: BstNode; parentX?: number; parentY?: number }[] = [];
    layout(step.tree, 0, 10, 630, out);
    return out;
  }, [step]);

  function go(delta: number) {
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Smaller goes left, bigger goes right — every single time">
        <p>
          A binary search tree keeps one simple rule at every node: anything alphabetically (or
          numerically) smaller goes into the left subtree, anything bigger goes into the right
          subtree. Insert a new word by starting at the root and repeatedly following that rule
          until you fall off the tree — that empty spot is where the new word goes (Rosen 11.2,
          Example 1).
        </p>
      </ExplainerBox>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">
          Inserting <strong>&ldquo;{step.word}&rdquo;</strong>: {step.narration}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox="0 0 640 260" className="w-full min-w-[560px]">
          {nodes.map((n, i) =>
            n.parentX !== undefined ? (
              <line key={`l${i}`} x1={n.parentX} y1={n.parentY! + 10} x2={n.x} y2={n.y - 10} stroke="var(--card-border)" strokeWidth="1.5" />
            ) : null
          )}
          {nodes.map((n, i) => {
            const isNew = n.node.value === step.word;
            return (
              <g key={i}>
                <rect x={n.x - 44} y={n.y - 12} width="88" height="24" rx="6" fill={isNew ? "#4F7CFF" : "white"} stroke={isNew ? "#4F7CFF" : "var(--card-border)"} strokeWidth="1.5" />
                <text x={n.x} y={n.y + 4} textAnchor="middle" className={`text-[9px] font-mono ${isNew ? "fill-white font-bold" : "fill-heading"}`}>
                  {n.node.value}
                </text>
              </g>
            );
          })}
        </svg>
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
          Step {clampedIndex + 1} of {steps.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={clampedIndex === steps.length - 1}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
