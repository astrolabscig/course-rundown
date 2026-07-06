"use client";

import { useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import { outputSnippets } from "@/lib/outputSnippets";
import { trackInteract } from "@/lib/track";

export default function OutputPredictionDrill() {
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function reveal(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: true }));
    markInteracted();
  }

  return (
    <div className="space-y-6">
      {outputSnippets.map((snippet, i) => {
        const isRevealed = revealed[snippet.id] ?? false;
        return (
          <div key={snippet.id} className="rounded-xl border border-card-border bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-heading">Snippet {i + 1}</p>
            <CodeBlock code={snippet.code} />

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor={`predict-${snippet.id}`} className="text-sm font-medium text-heading">
                  Your prediction
                </label>
                <input
                  id={`predict-${snippet.id}`}
                  value={predictions[snippet.id] ?? ""}
                  onChange={(e) =>
                    setPredictions((prev) => ({ ...prev, [snippet.id]: e.target.value }))
                  }
                  placeholder="What does this print?"
                  className="rounded-full border border-card-border px-3 py-1.5 text-sm w-64"
                />
              </div>
              <button
                type="button"
                onClick={() => reveal(snippet.id)}
                className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Reveal
              </button>
            </div>

            {isRevealed && (
              <>
                <OutputPanel output={snippet.expectedOutput} />
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-sm text-body">{snippet.explanation}</p>
                  {snippet.seeAlso && (
                    <p className="text-sm text-secondary mt-1">See also: {snippet.seeAlso}</p>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
