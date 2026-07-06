"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface CamEntry {
  mac: string;
  port: number;
}

interface Stage {
  narration: string;
  activePorts: number[]; // which ports the frame is currently sent out of
  cam: CamEntry[];
  label: string;
}

const stages: Stage[] = [
  {
    label: "Empty switch",
    narration: "The switch just powered on — its CAM (MAC address) table is completely empty. It doesn't know which device is on which port yet.",
    activePorts: [],
    cam: [],
  },
  {
    label: "Host A → Host B (unknown destination)",
    narration: "Host A (port 1) sends a frame to Host B. The switch reads the SOURCE address first and learns: \"AA:AA:AA on port 1\" — added to the CAM table immediately, regardless of the destination.",
    activePorts: [],
    cam: [{ mac: "AA:AA:AA (Host A)", port: 1 }],
  },
  {
    label: "Flooding",
    narration: "The switch looks up the DESTINATION MAC (Host B) in its CAM table — not there yet. Since it doesn't know which port Host B is on, it floods the frame out every port EXCEPT the one it came in on (ports 2 and 3).",
    activePorts: [2, 3],
    cam: [{ mac: "AA:AA:AA (Host A)", port: 1 }],
  },
  {
    label: "Host B replies",
    narration: "Host B (port 2) replies to Host A. The switch learns Host B's address too: \"BB:BB:BB on port 2\" — now added to the CAM table.",
    activePorts: [],
    cam: [
      { mac: "AA:AA:AA (Host A)", port: 1 },
      { mac: "BB:BB:BB (Host B)", port: 2 },
    ],
  },
  {
    label: "Known unicast",
    narration: "This reply's destination (Host A) IS now in the CAM table, on port 1 — so the switch forwards it out ONLY port 1, not to port 3. No more unnecessary flooding for traffic between these two.",
    activePorts: [1],
    cam: [
      { mac: "AA:AA:AA (Host A)", port: 1 },
      { mac: "BB:BB:BB (Host B)", port: 2 },
    ],
  },
];

export default function SwitchingSimulator() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (index >= stages.length - 1) {
      setPlaying(false);
      return;
    }
    timeoutRef.current = setTimeout(() => setIndex((i) => Math.min(stages.length - 1, i + 1)), 1300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  function play() {
    setIndex(0);
    setPlaying(true);
    markInteracted();
  }

  function step(delta: number) {
    setPlaying(false);
    setIndex((i) => Math.min(stages.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  const stage = stages[index];
  const ports = [
    { n: 1, label: "Host A (AA:AA:AA)" },
    { n: 2, label: "Host B (BB:BB:BB)" },
    { n: 3, label: "Host C (CC:CC:CC)" },
  ];

  return (
    <div className="space-y-4">
      <ExplainerBox title="How does a switch know where to send a frame?">
        <p>
          A switch is like a smart mail room clerk with no directory at first. Every time mail
          comes FROM an office, the clerk notes down &ldquo;oh, that office is behind this
          door&rdquo; — that's how the table gets built, just by watching senders, not by asking
          anyone directly. If a delivery's destination isn't in the notebook yet, the only safe
          option is to slip a copy under every other door and let the right office keep it.
        </p>
      </ExplainerBox>

      <button
        type="button"
        onClick={play}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        ▶ Play switching &amp; MAC learning
      </button>

      <div className="rounded-2xl border border-card-border bg-muted p-6">
        <div className="flex items-center justify-center gap-10">
          {ports.map((p) => (
            <div
              key={p.n}
              className={`rounded-xl border-2 px-3 py-2 text-xs font-mono text-center transition-colors ${
                stage.activePorts.includes(p.n) ? "border-accent bg-accent text-white" : "border-card-border bg-white text-heading"
              }`}
            >
              <div className="font-semibold">Port {p.n}</div>
              <div>{p.label}</div>
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-secondary mt-3">3-port switch</div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">CAM table</p>
        {stage.cam.length === 0 ? (
          <p className="text-sm text-secondary">Empty.</p>
        ) : (
          <table className="text-sm font-mono text-body">
            <tbody>
              {stage.cam.map((entry) => (
                <tr key={entry.mac}>
                  <td className="pr-4 font-semibold text-heading">{entry.mac}</td>
                  <td>port {entry.port}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm font-semibold text-heading mb-1">{stage.label}</p>
        <p className="text-sm text-body">{stage.narration}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={index === 0}
          className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={index === stages.length - 1}
          className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
        >
          ▶
        </button>
        <span className="text-sm text-secondary">
          Step {index + 1} of {stages.length}
        </span>
      </div>
    </div>
  );
}
