"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type GraphType = "Kn" | "Cn" | "Wn" | "Qn" | "Kmn";

const width = 420;
const height = 340;
const cx = width / 2;
const cy = height / 2;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function circlePositions(count: number, radius: number, offsetY = 0) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: round2(cx + radius * Math.cos(angle)), y: round2(cy + offsetY + radius * Math.sin(angle)) };
  });
}

function buildGraph(type: GraphType, n: number, m: number) {
  if (type === "Kn") {
    const positions = circlePositions(n, 120);
    const edges: [number, number][] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push([i, j]);
    return { positions, edges, labels: positions.map((_, i) => `v${i + 1}`) };
  }
  if (type === "Cn") {
    const positions = circlePositions(n, 120);
    const edges: [number, number][] = positions.map((_, i) => [i, (i + 1) % n]);
    return { positions, edges, labels: positions.map((_, i) => `v${i + 1}`) };
  }
  if (type === "Wn") {
    const rim = circlePositions(n, 120);
    const positions = [{ x: cx, y: cy }, ...rim];
    const edges: [number, number][] = rim.map((_, i) => [i + 1, ((i + 1) % n) + 1]);
    for (let i = 1; i <= n; i++) edges.push([0, i]);
    return { positions, edges, labels: ["hub", ...rim.map((_, i) => `v${i + 1}`)] };
  }
  if (type === "Qn") {
    const count = Math.pow(2, n);
    const positions = circlePositions(count, 130);
    const labels = Array.from({ length: count }, (_, i) => i.toString(2).padStart(n, "0"));
    const edges: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      for (let bit = 0; bit < n; bit++) {
        const j = i ^ (1 << bit);
        if (j > i) edges.push([i, j]);
      }
    }
    return { positions, edges, labels };
  }
  // Kmn
  const left = Array.from({ length: m }, (_, i) => ({ x: cx - 110, y: 50 + (i * 240) / Math.max(1, m - 1 || 1) }));
  const right = Array.from({ length: n }, (_, i) => ({ x: cx + 110, y: 50 + (i * 240) / Math.max(1, n - 1 || 1) }));
  const positions = [...left, ...right];
  const edges: [number, number][] = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) edges.push([i, m + j]);
  const labels = [...left.map((_, i) => `a${i + 1}`), ...right.map((_, i) => `b${i + 1}`)];
  return { positions, edges, labels };
}

export default function NamedGraphExplorer() {
  const [type, setType] = useState<GraphType>("Cn");
  const [n, setN] = useState(5);
  const [m, setM] = useState(3);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const clampedN = type === "Qn" ? Math.min(4, Math.max(1, n)) : type === "Kmn" ? Math.min(6, Math.max(1, n)) : Math.min(9, Math.max(3, n));
  const clampedM = Math.min(6, Math.max(1, m));

  const { positions, edges, labels } = useMemo(() => buildGraph(type, clampedN, clampedM), [type, clampedN, clampedM]);

  const info: Record<GraphType, string> = {
    Kn: `Kₙ (complete graph): every pair of the ${clampedN} vertices is connected. ${clampedN} vertices, ${(clampedN * (clampedN - 1)) / 2} edges.`,
    Cn: `Cₙ (cycle): ${clampedN} vertices arranged in a single loop. ${clampedN} vertices, ${clampedN} edges.`,
    Wn: `Wₙ (wheel): a cycle of ${clampedN} plus one hub connected to every rim vertex. ${clampedN + 1} vertices, ${clampedN * 2} edges.`,
    Qn: `Qₙ (hypercube): ${Math.pow(2, clampedN)} vertices, one per n-bit string, edges between strings differing in exactly one bit. ${Math.pow(2, clampedN)} vertices, ${clampedN * Math.pow(2, clampedN - 1)} edges.`,
    Kmn: `K_{m,n} (complete bipartite): every one of the ${clampedM} left vertices connects to every one of the ${clampedN} right vertices, with no edges within a side. ${clampedM + clampedN} vertices, ${clampedM * clampedN} edges.`,
  };

  return (
    <div className="space-y-4">
      <ExplainerBox title="These five families show up constantly — worth recognizing on sight">
        <p>
          Complete graphs, cycles, wheels, hypercubes, and complete bipartite graphs are named
          because they appear over and over in computer science (networks, hash cubes,
          scheduling). Since they're defined by a simple rule rather than a specific drawing,
          questions like &ldquo;for which n does this have a Hamilton circuit?&rdquo; can be
          answered for the whole family at once (Rosen 10.2).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {(["Kn", "Cn", "Wn", "Qn", "Kmn"] as GraphType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
              type === t ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {t === "Kmn" ? "K_{m,n}" : t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-secondary">
          n =
          <input
            type="number"
            value={n}
            onChange={(e) => {
              setN(Number(e.target.value) || 1);
              markInteracted();
            }}
            className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
          />
        </label>
        {type === "Kmn" && (
          <label className="flex items-center gap-2 text-xs text-secondary">
            m =
            <input
              type="number"
              value={m}
              onChange={(e) => {
                setM(Number(e.target.value) || 1);
                markInteracted();
              }}
              className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
            />
          </label>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm mx-auto">
          {edges.map(([a, b], i) => (
            <line key={i} x1={positions[a].x} y1={positions[a].y} x2={positions[b].x} y2={positions[b].y} stroke="#4F7CFF" strokeWidth="1.2" strokeOpacity="0.5" />
          ))}
          {positions.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={type === "Qn" && clampedN >= 4 ? 8 : 12} fill="#4F7CFF" />
              <text x={p.x} y={p.y - 14} textAnchor="middle" className="fill-heading text-[9px] font-mono">
                {labels[i]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="rounded-xl bg-muted p-4 text-sm text-body font-mono">{info[type]}</div>
    </div>
  );
}
