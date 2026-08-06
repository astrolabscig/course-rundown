"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Req {
  id: string;
  label: string;
  dur: number;
  color: string;
}

const DEFAULT_REQUESTS: Req[] = [
  { id: "A", label: "Return a DNS answer", dur: 4, color: "bg-accent" },
  { id: "B", label: "Prepare a large file listing", dur: 12, color: "bg-accent-warm" },
  { id: "C", label: "Return a small web page", dur: 3, color: "bg-success" },
  { id: "D", label: "Validate an uploaded file", dur: 8, color: "bg-error" },
];

interface Timed extends Req {
  start: number;
  done: number;
  wait: number;
}

function runIterative(reqs: Req[]): Timed[] {
  let t = 0;
  return reqs.map((r) => {
    const start = t;
    const done = start + r.dur;
    t = done;
    return { ...r, start, done, wait: start };
  });
}

function runConcurrent(reqs: Req[]): Timed[] {
  return reqs.map((r) => ({ ...r, start: 0, done: r.dur, wait: 0 }));
}

function avg(nums: number[]) {
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

function Timeline({ rows, totalTime }: { rows: Timed[]; totalTime: number }) {
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="flex items-center gap-2">
          <span className="w-6 shrink-0 font-mono text-xs font-semibold text-heading">{r.id}</span>
          <div className="relative h-6 flex-1 rounded bg-muted overflow-hidden">
            <div
              className={`absolute top-0 h-full ${r.color} opacity-80 rounded flex items-center justify-center text-[10px] font-mono text-white`}
              style={{
                left: `${(r.start / totalTime) * 100}%`,
                width: `${((r.done - r.start) / totalTime) * 100}%`,
              }}
            >
              {r.dur}s
            </div>
          </div>
          <span className="w-28 shrink-0 font-mono text-xs text-secondary text-right">
            {r.start}s → {r.done}s
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ServerModelSimulator() {
  const [reqs, setReqs] = useState<Req[]>(DEFAULT_REQUESTS);
  const [order, setOrder] = useState<"table" | "sjf">("table");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function setDuration(id: string, dur: number) {
    setReqs((prev) => prev.map((r) => (r.id === id ? { ...r, dur: Math.max(1, dur) } : r)));
    markInteracted();
  }

  const iterativeOrder = useMemo(() => {
    if (order === "table") return reqs;
    return [...reqs].sort((a, b) => a.dur - b.dur);
  }, [reqs, order]);

  const iterative = useMemo(() => runIterative(iterativeOrder), [iterativeOrder]);
  const concurrent = useMemo(() => runConcurrent(reqs), [reqs]);

  const totalTime = Math.max(...iterative.map((r) => r.done), ...concurrent.map((r) => r.done));

  const iterAvgCompletion = avg(iterative.map((r) => r.done));
  const iterAvgWait = avg(iterative.map((r) => r.wait));
  const concAvgCompletion = avg(concurrent.map((r) => r.done));
  const concAvgWait = avg(concurrent.map((r) => r.wait));

  return (
    <div className="space-y-5">
      <ExplainerBox title="What's actually different between the two models">
        <p>
          All four requests land on the server at the exact same instant (time 0). An{" "}
          <strong className="text-heading">iterative server</strong> has only one worker: it
          finishes one request completely — start to finish — before it even looks at the next
          one. A <strong className="text-heading">concurrent server</strong> hands every request
          its own worker (a process or thread) immediately, so all four run side by side. Nothing
          about the total <em>work</em> changes between the two models — only how long each client
          has to sit and wait for it.
        </p>
      </ExplainerBox>

      <div className="grid gap-3 sm:grid-cols-4">
        {reqs.map((r) => (
          <label key={r.id} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-secondary">
              {r.id} — {r.label}
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                value={r.dur}
                onChange={(e) => setDuration(r.id, Number(e.target.value))}
                className="w-full rounded-lg border border-card-border px-2 py-1.5 text-sm font-mono"
              />
              <span className="text-xs text-secondary">s</span>
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
          Iterative processing order:
        </span>
        <button
          type="button"
          onClick={() => {
            setOrder("table");
            markInteracted();
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            order === "table" ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
          }`}
        >
          Table order (A, B, C, D)
        </button>
        <button
          type="button"
          onClick={() => {
            setOrder("sjf");
            markInteracted();
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            order === "sjf" ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
          }`}
        >
          Shortest job first
        </button>
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 space-y-5">
        <div>
          <p className="text-sm font-semibold text-heading mb-2">
            Iterative server ({order === "table" ? "processed A → B → C → D, in the order they're listed" : "processed shortest job first"})
          </p>
          <Timeline rows={iterative} totalTime={totalTime} />
        </div>
        <div>
          <p className="text-sm font-semibold text-heading mb-2">
            Concurrent server (every request gets a worker at t=0)
          </p>
          <Timeline rows={concurrent} totalTime={totalTime} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-muted p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Iterative</p>
          <p className="font-mono text-sm text-body">
            Average completion time: <span className="font-semibold text-heading">{iterAvgCompletion.toFixed(2)}s</span>
          </p>
          <p className="font-mono text-sm text-body">
            Average waiting time: <span className="font-semibold text-heading">{iterAvgWait.toFixed(2)}s</span>
          </p>
        </div>
        <div className="rounded-xl bg-accent-warm-bg p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Concurrent</p>
          <p className="font-mono text-sm text-body">
            Average completion time: <span className="font-semibold text-heading">{concAvgCompletion.toFixed(2)}s</span>
          </p>
          <p className="font-mono text-sm text-body">
            Average waiting time: <span className="font-semibold text-heading">{concAvgWait.toFixed(2)}s</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4 text-sm text-body space-y-2">
        <p>
          <strong className="text-heading">Reading the default (table-order) result:</strong> under
          the iterative model, request D — a completely unrelated, small validation job — has to
          wait 19 seconds just because it happened to be queued behind the 12-second file-listing
          job. Under the concurrent model, D finishes in 8 seconds flat, completely unaffected by
          B&rsquo;s size. The <em>total</em> work done is identical in both cases (4+12+3+8 = 27
          worker-seconds); concurrency doesn&rsquo;t do less work, it just lets independent work happen
          in parallel instead of queueing behind whatever got there first.
        </p>
        <p>
          <strong className="text-heading">Why not always use concurrent?</strong> A concurrent
          server needs to create and manage a worker (process or thread) per request, which costs
          memory and CPU scheduling overhead, and it introduces real engineering problems a purely
          iterative server never has to face — shared state between workers, race conditions, and
          the need for synchronization if two requests touch the same resource at once. For a
          workload with a handful of short, independent requests, that overhead is trivial and
          concurrency wins easily. For a very simple, low-traffic service, an iterative model can
          still be the right, much-simpler choice.
        </p>
      </div>
    </div>
  );
}
