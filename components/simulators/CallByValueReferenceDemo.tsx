"use client";

import { useState } from "react";
import CodeBlock from "../CodeBlock";
import { trackInteract } from "@/lib/track";

const code = `void byValue(int x) { x = 100; }        // x is a COPY; caller's variable is unchanged
void byReference(int &x) { x = 100; }   // x is an ALIAS; caller's variable changes

int main() {
    int a = 5;
    byValue(a);
    std::cout << a << "\\n";   // ?

    int b = 5;
    byReference(b);
    std::cout << b << "\\n";   // ?
}`;

export default function CallByValueReferenceDemo() {
  const [ran, setRan] = useState(false);

  function run() {
    setRan(true);
    trackInteract();
  }

  return (
    <div className="space-y-4">
      <CodeBlock code={code} />
      <button
        type="button"
        onClick={run}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        Run both calls
      </button>

      {ran && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-card-border bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
              byValue(a) — copy
            </div>
            <div className="flex items-center gap-3 text-sm font-mono mb-2">
              <span className="rounded-lg border-2 border-card-border px-3 py-1">a = 5</span>
              <span className="text-secondary">→ copied into →</span>
              <span className="rounded-lg border-2 border-dashed border-secondary px-3 py-1">x = 100</span>
            </div>
            <p className="text-sm text-body">
              The copy (<span className="font-mono">x</span>) changes to 100, but{" "}
              <span className="font-mono">a</span> in <span className="font-mono">main</span> never
              sees it.
            </p>
            <div className="mt-2 rounded-lg bg-[#1f1f1f] text-[#e8e8e8] font-mono text-sm p-3">
              5
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
              byReference(b) — alias
            </div>
            <div className="flex items-center gap-3 text-sm font-mono mb-2">
              <span className="rounded-lg border-2 border-accent px-3 py-1">b = 5</span>
              <span className="text-accent">⇄ same box, aliased as</span>
              <span className="rounded-lg border-2 border-accent px-3 py-1">x</span>
            </div>
            <p className="text-sm text-body">
              <span className="font-mono">x</span> is just another name for{" "}
              <span className="font-mono">b</span>&rsquo;s box — writing to it changes{" "}
              <span className="font-mono">b</span> directly.
            </p>
            <div className="mt-2 rounded-lg bg-[#1f1f1f] text-[#e8e8e8] font-mono text-sm p-3">
              100
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
