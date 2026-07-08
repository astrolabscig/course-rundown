"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface HuffNode {
  label: string;
  weight: number;
  left: HuffNode | null;
  right: HuffNode | null;
}

interface MergeStep {
  narration: string;
  weight: number;
}

const presets = {
  book: { A: 0.08, B: 0.1, C: 0.12, D: 0.15, E: 0.2, F: 0.35 },
  exercise: { a: 0.2, b: 0.1, c: 0.15, d: 0.25, e: 0.3 },
};

function buildHuffman(freqs: Record<string, number>): { root: HuffNode; merges: MergeStep[] } {
  let nodes: HuffNode[] = Object.entries(freqs).map(([label, weight]) => ({ label, weight, left: null, right: null }));
  const merges: MergeStep[] = [];
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.weight - b.weight);
    const smallest = nodes[0];
    const secondSmallest = nodes[1];
    // Smaller weight becomes the right (1) child, larger becomes the left (0) child.
    const larger = smallest.weight <= secondSmallest.weight ? secondSmallest : smallest;
    const smaller = smallest.weight <= secondSmallest.weight ? smallest : secondSmallest;
    const merged: HuffNode = {
      label: `(${smaller.label}+${larger.label})`,
      weight: Number((smaller.weight + larger.weight).toFixed(4)),
      left: larger,
      right: smaller,
    };
    merges.push({
      narration: `Merge the two smallest weights: "${smaller.label}" (${smaller.weight}) and "${larger.label}" (${larger.weight}) → new node weight ${merged.weight}.`,
      weight: merged.weight,
    });
    nodes = [merged, ...nodes.slice(2)];
  }
  return { root: nodes[0], merges };
}

function collectCodes(node: HuffNode, prefix: string, out: Record<string, string>) {
  if (!node.left && !node.right) {
    out[node.label] = prefix || "0";
    return;
  }
  if (node.left) collectCodes(node.left, prefix + "0", out);
  if (node.right) collectCodes(node.right, prefix + "1", out);
}

export default function HuffmanCodingBuilder() {
  const [presetId, setPresetId] = useState<keyof typeof presets>("book");
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const { root, merges } = useMemo(() => buildHuffman(presets[presetId]), [presetId]);
  const codes = useMemo(() => {
    const out: Record<string, string> = {};
    collectCodes(root, "", out);
    return out;
  }, [root]);

  const avgLength = useMemo(() => {
    return Object.entries(presets[presetId]).reduce((sum, [label, freq]) => sum + freq * codes[label].length, 0);
  }, [presetId, codes]);

  const clampedIndex = Math.min(index, merges.length - 1);

  function go(delta: number) {
    setIndex((i) => Math.min(merges.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Huffman coding: give the most common symbols the shortest codes">
        <p>
          Repeatedly merge the two least-frequent symbols (or groups) into a single combined node,
          building a tree from the bottom up. Once every symbol is merged into one tree, follow the
          path from the root to each leaf — left branches are 0, right branches are 1 — and that
          path IS the symbol's binary code. Frequent symbols end up near the top (short codes),
          rare ones end up deep (longer codes) (Rosen 11.2, Example 5).
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(Object.keys(presets) as (keyof typeof presets)[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setPresetId(id);
              setIndex(0);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              presetId === id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {id === "book" ? "A-F frequencies" : "a-e frequencies"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(presets[presetId]).map(([label, freq]) => (
          <div key={label} className="rounded-lg border border-card-border px-3 py-1.5 text-sm font-mono">
            {label}: {freq}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{merges[clampedIndex].narration}</p>
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
          Merge {clampedIndex + 1} of {merges.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={clampedIndex === merges.length - 1}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>

      {clampedIndex === merges.length - 1 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(codes).map(([label, code]) => (
              <div key={label} className="rounded-lg border border-success bg-muted px-3 py-2 text-sm font-mono">
                {label}: <span className="font-bold text-success">{code}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-body">
            Average code length: <strong>{avgLength.toFixed(2)} bits</strong> per symbol — far
            better than a fixed-length code, which would need{" "}
            {Math.ceil(Math.log2(Object.keys(codes).length))} bits per symbol regardless of
            frequency.
          </p>
        </div>
      )}
    </div>
  );
}
