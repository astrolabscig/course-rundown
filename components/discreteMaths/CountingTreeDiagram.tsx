"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface TreeNode {
  label: string;
  children?: TreeNode[];
}

const productTree: TreeNode = {
  label: "start",
  children: [0, 1].map((b1) => ({
    label: `bit 1 = ${b1}`,
    children: [0, 1].map((b2) => ({
      label: `bit 2 = ${b2}`,
      children: [0, 1].map((b3) => ({ label: `bit 3 = ${b3}` })),
    })),
  })),
};

const sumTree: TreeNode = {
  label: "start",
  children: [
    { label: "pick a fruit", children: ["apple", "banana", "cherry"].map((f) => ({ label: f })) },
    { label: "pick a candy", children: ["mint", "toffee"].map((c) => ({ label: c })) },
  ],
};

function countLeaves(node: TreeNode): number {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

function layout(node: TreeNode, depth: number, xStart: number, xEnd: number, out: { x: number; y: number; node: TreeNode; parentX?: number; parentY?: number }[], parent?: { x: number; y: number }) {
  const x = (xStart + xEnd) / 2;
  const y = 40 + depth * 60;
  out.push({ x, y, node, parentX: parent?.x, parentY: parent?.y });
  if (node.children && node.children.length > 0) {
    const totalLeaves = node.children.map(countLeaves);
    const total = totalLeaves.reduce((a, b) => a + b, 0);
    let cursor = xStart;
    node.children.forEach((child, i) => {
      const width = ((xEnd - xStart) * totalLeaves[i]) / total;
      layout(child, depth + 1, cursor, cursor + width, out, { x, y });
      cursor += width;
    });
  }
}

function TreeSvg({ tree }: { tree: TreeNode }) {
  const nodes: { x: number; y: number; node: TreeNode; parentX?: number; parentY?: number }[] = [];
  layout(tree, 0, 10, 630, nodes);
  const maxY = Math.max(...nodes.map((n) => n.y)) + 40;
  return (
    <svg viewBox={`0 0 640 ${maxY}`} className="w-full">
      {nodes.map((n, i) =>
        n.parentX !== undefined ? (
          <line key={`l${i}`} x1={n.parentX} y1={n.parentY! + 10} x2={n.x} y2={n.y - 10} stroke="var(--card-border)" strokeWidth="1.5" />
        ) : null
      )}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="4" fill="#4F7CFF" />
          <text x={n.x} y={n.y - 14} textAnchor="middle" className="fill-heading text-[10px] font-mono">
            {n.node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function CountingTreeDiagram() {
  const [mode, setMode] = useState<"product" | "sum">("product");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const tree = mode === "product" ? productTree : sumTree;
  const leaves = countLeaves(tree);

  return (
    <div className="space-y-4">
      <ExplainerBox title="A decision tree makes the product and sum rules visible">
        <p>
          The <strong>product rule</strong> applies when you make several independent choices in a
          row — multiply the branch counts at each level. The <strong>sum rule</strong> applies
          when you choose ONE path out of several mutually exclusive categories — add up the leaf
          counts of each branch instead of multiplying (Rosen 6.1, Example 64&rsquo;s bit-string
          counting is the product rule in action).
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(["product", "sum"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition-colors ${
              mode === m ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {m} rule
          </button>
        ))}
      </div>

      <p className="text-sm text-secondary">
        {mode === "product"
          ? "3-bit strings: each of the 3 bit positions independently has 2 choices (0 or 1)."
          : "Choosing one snack: either a fruit (3 options) OR a candy (2 options) — never both."}
      </p>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-3">
        <TreeSvg tree={tree} />
      </div>

      <div className="rounded-xl bg-muted p-4 text-sm text-body">
        {mode === "product" ? (
          <p>
            Product rule: 2 × 2 × 2 = <strong>{leaves}</strong> total 3-bit strings — each level of
            the tree multiplies the branch count.
          </p>
        ) : (
          <p>
            Sum rule: 3 + 2 = <strong>{leaves}</strong> total choices — the two categories are
            mutually exclusive, so their leaf counts simply add.
          </p>
        )}
      </div>
    </div>
  );
}
