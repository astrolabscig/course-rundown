"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const vertices = ["a", "b", "c", "d", "e", "z"];
const rawEdges: [string, string, number][] = [
  ["a", "b", 4],
  ["a", "d", 2],
  ["b", "c", 3],
  ["b", "e", 3],
  ["d", "e", 3],
  ["e", "z", 1],
];

const positions: Record<string, { x: number; y: number }> = {
  a: { x: 40, y: 160 },
  b: { x: 160, y: 60 },
  d: { x: 160, y: 260 },
  c: { x: 300, y: 60 },
  e: { x: 300, y: 200 },
  z: { x: 420, y: 160 },
};

function neighbors(v: string): { to: string; weight: number }[] {
  const out: { to: string; weight: number }[] = [];
  for (const [a, b, w] of rawEdges) {
    if (a === v) out.push({ to: b, weight: w });
    if (b === v) out.push({ to: a, weight: w });
  }
  return out;
}

interface DijkstraStep {
  current: string;
  distances: Record<string, number>;
  visited: string[];
  narration: string;
  updated: string[];
}

function runDijkstra(start: string): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const distances: Record<string, number> = Object.fromEntries(vertices.map((v) => [v, v === start ? 0 : Infinity]));
  const predecessors: Record<string, string | null> = Object.fromEntries(vertices.map((v) => [v, null]));
  const visited = new Set<string>();

  steps.push({
    current: start,
    distances: { ...distances },
    visited: [],
    updated: [],
    narration: `Initialize: distance(${start}) = 0, every other vertex = ∞.`,
  });

  while (visited.size < vertices.length) {
    let current: string | null = null;
    let best = Infinity;
    for (const v of vertices) {
      if (!visited.has(v) && distances[v] < best) {
        best = distances[v];
        current = v;
      }
    }
    if (current === null) break;
    visited.add(current);

    const updated: string[] = [];
    for (const { to, weight } of neighbors(current)) {
      if (visited.has(to)) continue;
      const candidate = distances[current] + weight;
      if (candidate < distances[to]) {
        distances[to] = candidate;
        predecessors[to] = current;
        updated.push(to);
      }
    }

    steps.push({
      current,
      distances: { ...distances },
      visited: Array.from(visited),
      updated,
      narration:
        updated.length > 0
          ? `Visit ${current} (shortest confirmed distance ${best}). Relax its edges: update ${updated
              .map((u) => `distance(${u})=${distances[u]}`)
              .join(", ")}.`
          : `Visit ${current} (shortest confirmed distance ${best}). No neighbor gets a shorter path through ${current}.`,
    });
  }

  // Reconstruct path to z
  const path: string[] = [];
  let cur: string | null = "z";
  while (cur) {
    path.unshift(cur);
    cur = predecessors[cur];
  }

  steps.push({
    current: "z",
    distances: { ...distances },
    visited: Array.from(visited),
    updated: [],
    narration: `Done. Shortest path from ${start} to z: ${path.join(" → ")}, total length ${distances.z}.`,
  });

  return steps;
}

export default function DijkstraSimulator() {
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const steps = useMemo(() => runDijkstra("a"), []);
  const clampedIndex = Math.min(index, steps.length - 1);
  const step = steps[clampedIndex];

  function go(delta: number) {
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Dijkstra always finalizes the closest unvisited vertex next">
        <p>
          Starting from a, Dijkstra's algorithm keeps a running &ldquo;best distance so far&rdquo;
          for every vertex. At each step it locks in the closest unvisited vertex (its distance
          can never improve after that), then checks whether going through it gives any neighbor a
          shorter path. Watch the distance table update step by step below (Rosen 10.6, Example 1).
        </p>
      </ExplainerBox>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox="0 0 460 320" className="w-full max-w-lg mx-auto">
          {rawEdges.map(([a, b, w], i) => (
            <g key={i}>
              <line
                x1={positions[a].x}
                y1={positions[a].y}
                x2={positions[b].x}
                y2={positions[b].y}
                stroke="var(--card-border)"
                strokeWidth="1.5"
              />
              <text x={(positions[a].x + positions[b].x) / 2} y={(positions[a].y + positions[b].y) / 2 - 6} textAnchor="middle" className="fill-secondary text-[11px] font-mono">
                {w}
              </text>
            </g>
          ))}
          {vertices.map((v) => {
            const isVisited = step.visited.includes(v);
            const isCurrent = v === step.current;
            return (
              <g key={v}>
                <circle
                  cx={positions[v].x}
                  cy={positions[v].y}
                  r="18"
                  fill={isCurrent ? "#4F7CFF" : isVisited ? "#EAF2FF" : "white"}
                  stroke={isCurrent || isVisited ? "#4F7CFF" : "var(--card-border)"}
                  strokeWidth="2"
                />
                <text x={positions[v].x} y={positions[v].y + 5} textAnchor="middle" className={`text-xs font-mono font-bold ${isCurrent ? "fill-white" : "fill-heading"}`}>
                  {v}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border">
        <table className="w-full text-sm border-collapse text-center">
          <thead>
            <tr>
              {vertices.map((v) => (
                <th key={v} className="p-2 bg-muted border-b border-card-border font-mono text-heading">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {vertices.map((v) => (
                <td key={v} className={`p-2 font-mono ${step.updated.includes(v) ? "text-accent font-bold" : "text-body"}`}>
                  {step.distances[v] === Infinity ? "∞" : step.distances[v]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{step.narration}</p>
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
