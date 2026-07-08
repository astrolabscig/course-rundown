"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const people = ["Tom", "Patricia", "Hope", "Sandy", "Amy", "Marika", "Jeff", "Mary"];
const edges: [string, string][] = [
  ["Tom", "Patricia"],
  ["Tom", "Hope"],
  ["Patricia", "Sandy"],
  ["Hope", "Sandy"],
  ["Hope", "Amy"],
  ["Sandy", "Amy"],
  ["Amy", "Marika"],
  ["Marika", "Jeff"],
  ["Jeff", "Mary"],
  ["Mary", "Marika"],
];

const width = 480;
const height = 320;
const cx = width / 2;
const cy = height / 2;
const radius = 130;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function nodePos(i: number, total: number) {
  const angle = (2 * Math.PI * i) / total - Math.PI / 2;
  return { x: round2(cx + radius * Math.cos(angle)), y: round2(cy + radius * Math.sin(angle)) };
}

export default function GraphBuilder() {
  const [selected, setSelected] = useState<string | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const positions = useMemo(() => Object.fromEntries(people.map((p, i) => [p, nodePos(i, people.length)])), []);

  const neighbors = useMemo(() => {
    if (!selected) return [];
    return edges.filter(([a, b]) => a === selected || b === selected).map(([a, b]) => (a === selected ? b : a));
  }, [selected]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="A graph is just dots and lines for 'who is connected to whom'">
        <p>
          Each person is a <strong>vertex</strong>, and each acquaintance pair is an{" "}
          <strong>edge</strong>. Click a person below to highlight exactly who they know directly
          — their <strong>neighbors</strong> in the graph (Rosen 10.1-10.2).
        </p>
      </ExplainerBox>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto">
          {edges.map(([a, b], i) => {
            const highlighted = selected && (a === selected || b === selected);
            return (
              <line
                key={i}
                x1={positions[a].x}
                y1={positions[a].y}
                x2={positions[b].x}
                y2={positions[b].y}
                stroke={highlighted ? "#4F7CFF" : "var(--card-border)"}
                strokeWidth={highlighted ? 2.5 : 1.5}
              />
            );
          })}
          {people.map((p) => {
            const pos = positions[p];
            const isSelected = p === selected;
            const isNeighbor = neighbors.includes(p);
            return (
              <g
                key={p}
                onClick={() => {
                  setSelected(p === selected ? null : p);
                  markInteracted();
                }}
                className="cursor-pointer"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill={isSelected ? "#4F7CFF" : isNeighbor ? "#EAF2FF" : "white"}
                  stroke={isSelected || isNeighbor ? "#4F7CFF" : "var(--card-border)"}
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 34}
                  textAnchor="middle"
                  className={`text-[11px] font-mono ${isSelected ? "fill-accent font-bold" : "fill-heading"}`}
                >
                  {p}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-xl bg-muted p-4 text-sm text-body min-h-[3rem]">
        {selected ? (
          <>
            <strong>{selected}</strong> is directly acquainted with: {neighbors.join(", ")} (degree {neighbors.length}).
          </>
        ) : (
          "Click a person to see their direct acquaintances."
        )}
      </div>
    </div>
  );
}
