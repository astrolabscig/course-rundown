"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface NodeDef {
  id: string;
  parent: string | null;
}

const nodes: NodeDef[] = [
  { id: "a", parent: null },
  { id: "b", parent: "a" },
  { id: "c", parent: "a" },
  { id: "d", parent: "a" },
  { id: "e", parent: "b" },
  { id: "f", parent: "b" },
  { id: "g", parent: "c" },
  { id: "h", parent: "d" },
  { id: "i", parent: "d" },
  { id: "j", parent: "d" },
  { id: "k", parent: "e" },
  { id: "l", parent: "h" },
  { id: "m", parent: "k" },
];

function childrenOf(id: string): string[] {
  return nodes.filter((n) => n.parent === id).map((n) => n.id);
}

function levelOf(id: string): number {
  let level = 0;
  let cur = nodes.find((n) => n.id === id)!;
  while (cur.parent) {
    level++;
    cur = nodes.find((n) => n.id === cur.parent)!;
  }
  return level;
}

function ancestorsOf(id: string): string[] {
  const out: string[] = [];
  let cur = nodes.find((n) => n.id === id)!;
  while (cur.parent) {
    out.push(cur.parent);
    cur = nodes.find((n) => n.id === cur.parent)!;
  }
  return out;
}

function descendantsOf(id: string): string[] {
  const out: string[] = [];
  const queue = childrenOf(id);
  while (queue.length) {
    const cur = queue.shift()!;
    out.push(cur);
    queue.push(...childrenOf(cur));
  }
  return out;
}

const levelGroups: string[][] = [];
nodes.forEach((n) => {
  const lvl = levelOf(n.id);
  levelGroups[lvl] = levelGroups[lvl] || [];
  levelGroups[lvl].push(n.id);
});

const width = 480;
const height = 260;
const positions: Record<string, { x: number; y: number }> = {};
levelGroups.forEach((group, lvl) => {
  const y = 30 + lvl * 65;
  group.forEach((id, i) => {
    const x = (width * (i + 1)) / (group.length + 1);
    positions[id] = { x, y };
  });
});

export default function TreeTerminologySimulator() {
  const [selected, setSelected] = useState<string>("k");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const { ancestors, descendants, children, level, parent } = useMemo(() => {
    const node = nodes.find((n) => n.id === selected)!;
    return {
      ancestors: ancestorsOf(selected),
      descendants: descendantsOf(selected),
      children: childrenOf(selected),
      level: levelOf(selected),
      parent: node.parent,
    };
  }, [selected]);

  function select(id: string) {
    setSelected(id);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Family-tree words, applied to data structures">
        <p>
          A rooted tree borrows its vocabulary straight from family trees: a node's{" "}
          <strong>parent</strong> is one level up, its <strong>children</strong> are one level
          down, its <strong>ancestors</strong> are every node on the path back to the root, and its{" "}
          <strong>descendants</strong> are everything reachable going down from it. Click any node
          to see all of these highlighted at once (Rosen 11.1).
        </p>
      </ExplainerBox>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto">
          {nodes
            .filter((n) => n.parent)
            .map((n) => (
              <line
                key={n.id}
                x1={positions[n.parent!].x}
                y1={positions[n.parent!].y}
                x2={positions[n.id].x}
                y2={positions[n.id].y}
                stroke="var(--card-border)"
                strokeWidth="1.5"
              />
            ))}
          {nodes.map((n) => {
            const isSelected = n.id === selected;
            const isAncestor = ancestors.includes(n.id);
            const isChild = children.includes(n.id);
            const isDescendant = descendants.includes(n.id) && !isChild;
            let fill = "white";
            let stroke = "var(--card-border)";
            if (isSelected) {
              fill = "#4F7CFF";
              stroke = "#4F7CFF";
            } else if (isAncestor) {
              fill = "#FFE3B3";
              stroke = "#E0A930";
            } else if (isChild) {
              fill = "#C9F0DA";
              stroke = "#2FA86A";
            } else if (isDescendant) {
              fill = "#E4F7EC";
              stroke = "#2FA86A";
            }
            return (
              <g key={n.id} onClick={() => select(n.id)} className="cursor-pointer">
                <circle cx={positions[n.id].x} cy={positions[n.id].y} r="16" fill={fill} stroke={stroke} strokeWidth="2" />
                <text x={positions[n.id].x} y={positions[n.id].y + 4} textAnchor="middle" className={`text-xs font-mono font-bold ${isSelected ? "fill-white" : "fill-heading"}`}>
                  {n.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#4F7CFF]" /> selected</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#FFE3B3] border border-[#E0A930]" /> ancestors</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#C9F0DA] border border-[#2FA86A]" /> children</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#E4F7EC] border border-[#2FA86A]" /> other descendants</span>
      </div>

      <div className="rounded-xl bg-muted p-4 text-sm text-body space-y-1">
        <p><strong>{selected}</strong> is at level {level} (root = level 0).</p>
        <p>Parent: {parent ?? "none — this is the root"}</p>
        <p>Children: {children.length ? children.join(", ") : "none — this is a leaf"}</p>
        <p>Ancestors: {ancestors.length ? ancestors.join(", ") : "none"}</p>
        <p>Descendants: {descendants.length ? descendants.join(", ") : "none"}</p>
      </div>
    </div>
  );
}
