"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const vertexCount = 12;
const vertices = Array.from({ length: vertexCount }, (_, i) => `v${i + 1}`);
const rawEdges: [string, string, number][] = [
  ["v1", "v2", 1], ["v1", "v3", 5], ["v2", "v3", 4], ["v2", "v4", 2],
  ["v3", "v4", 6], ["v3", "v5", 3], ["v4", "v5", 7], ["v4", "v6", 8],
  ["v5", "v6", 9], ["v5", "v7", 2], ["v6", "v7", 5], ["v6", "v8", 6],
  ["v7", "v8", 1], ["v7", "v9", 4], ["v8", "v9", 3], ["v8", "v10", 7],
  ["v9", "v10", 2], ["v9", "v11", 8], ["v10", "v11", 5], ["v10", "v12", 6],
  ["v11", "v12", 1],
];

const width = 460;
const height = 340;
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function pos(i: number) {
  const angle = (2 * Math.PI * i) / vertexCount - Math.PI / 2;
  return { x: round2(width / 2 + 150 * Math.cos(angle)), y: round2(height / 2 + 150 * Math.sin(angle)) };
}
const positions = Object.fromEntries(vertices.map((v, i) => [v, pos(i)]));

interface Step {
  edge: [string, string, number] | null;
  accepted: boolean;
  narration: string;
  chosen: [string, string, number][];
}

function primMst(): { steps: Step[]; total: number } {
  const inTree = new Set<string>(["v1"]);
  const chosen: [string, string, number][] = [];
  const steps: Step[] = [{ edge: null, accepted: true, narration: "Start Prim's from v1 — it's the only vertex in the tree so far.", chosen: [] }];
  while (inTree.size < vertexCount) {
    let best: [string, string, number] | null = null;
    for (const [a, b, w] of rawEdges) {
      const aIn = inTree.has(a);
      const bIn = inTree.has(b);
      if (aIn === bIn) continue;
      if (!best || w < best[2]) best = [a, b, w];
    }
    if (!best) break;
    inTree.add(best[0]);
    inTree.add(best[1]);
    chosen.push(best);
    steps.push({
      edge: best,
      accepted: true,
      narration: `Cheapest edge connecting the growing tree to a new vertex: (${best[0]},${best[1]}) weight ${best[2]}. Add it.`,
      chosen: [...chosen],
    });
  }
  return { steps, total: chosen.reduce((s, e) => s + e[2], 0) };
}

function kruskalMst(): { steps: Step[]; total: number } {
  const parent: Record<string, string> = Object.fromEntries(vertices.map((v) => [v, v]));
  function find(v: string): string {
    while (parent[v] !== v) v = parent[v];
    return v;
  }
  function union(a: string, b: string) {
    parent[find(a)] = find(b);
  }
  const sorted = [...rawEdges].sort((a, b) => a[2] - b[2]);
  const chosen: [string, string, number][] = [];
  const steps: Step[] = [{ edge: null, accepted: true, narration: "Sort all edges by weight, cheapest first. Consider each in turn.", chosen: [] }];
  for (const [a, b, w] of sorted) {
    if (find(a) === find(b)) {
      steps.push({ edge: [a, b, w], accepted: false, narration: `Edge (${a},${b}) weight ${w} would create a cycle — skip it.`, chosen: [...chosen] });
      continue;
    }
    union(a, b);
    chosen.push([a, b, w]);
    steps.push({ edge: [a, b, w], accepted: true, narration: `Edge (${a},${b}) weight ${w} connects two separate components — add it.`, chosen: [...chosen] });
    if (chosen.length === vertexCount - 1) break;
  }
  return { steps, total: chosen.reduce((s, e) => s + e[2], 0) };
}

export default function MSTComparisonSimulator() {
  const [algo, setAlgo] = useState<"prim" | "kruskal">("prim");
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const prim = useMemo(() => primMst(), []);
  const kruskal = useMemo(() => kruskalMst(), []);
  const { steps } = algo === "prim" ? prim : kruskal;
  const clampedIndex = Math.min(index, steps.length - 1);
  const step = steps[clampedIndex];

  function go(delta: number) {
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  function edgeKey(a: string, b: string) {
    return [a, b].sort().join("-");
  }
  const chosenKeys = new Set(step.chosen.map(([a, b]) => edgeKey(a, b)));

  return (
    <div className="space-y-4">
      <ExplainerBox title="Two very different strategies, always the same total weight">
        <p>
          Prim's algorithm grows ONE connected tree, always adding the cheapest edge that reaches a
          new vertex. Kruskal's algorithm instead looks at ALL edges sorted by weight and greedily
          adds any edge that doesn't create a cycle, regardless of which component it's in. They
          often build the tree in a completely different order — but a theorem guarantees they
          always end up with the same total weight (Rosen 11.5, Examples 2-3).
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(["prim", "kruskal"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => {
              setAlgo(a);
              setIndex(0);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition-colors ${
              algo === a ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {a}&apos;s algorithm
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto">
          {rawEdges.map(([a, b, w], i) => {
            const inTree = chosenKeys.has(edgeKey(a, b));
            const isCurrent = step.edge && step.edge[0] === a && step.edge[1] === b;
            return (
              <g key={i}>
                <line
                  x1={positions[a].x}
                  y1={positions[a].y}
                  x2={positions[b].x}
                  y2={positions[b].y}
                  stroke={inTree ? "#2FA86A" : isCurrent ? "#E0455A" : "var(--card-border)"}
                  strokeWidth={inTree || isCurrent ? 2.5 : 1}
                  strokeOpacity={inTree || isCurrent ? 1 : 0.4}
                />
                <text x={(positions[a].x + positions[b].x) / 2} y={(positions[a].y + positions[b].y) / 2} textAnchor="middle" className="fill-secondary text-[9px] font-mono">
                  {w}
                </text>
              </g>
            );
          })}
          {vertices.map((v) => (
            <g key={v}>
              <circle cx={positions[v].x} cy={positions[v].y} r="12" fill="white" stroke="#4F7CFF" strokeWidth="2" />
              <text x={positions[v].x} y={positions[v].y + 4} textAnchor="middle" className="fill-heading text-[9px] font-mono font-bold">
                {v}
              </text>
            </g>
          ))}
        </svg>
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

      {clampedIndex === steps.length - 1 && (
        <div className="rounded-xl border border-success bg-muted p-4 text-sm text-body">
          Prim&apos;s total weight: <strong>{prim.total}</strong>. Kruskal&apos;s total weight: <strong>{kruskal.total}</strong>.{" "}
          {prim.total === kruskal.total ? "They match, as guaranteed." : "(unexpected mismatch)"}
        </div>
      )}
    </div>
  );
}
