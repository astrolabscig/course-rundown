"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Stage {
  label: string;
  narration: string;
  // position 0-100 along the track, or null to hide
  aPos: number | null;
  bPos: number | null; // second device (B for Ethernet, C for Wi-Fi)
  collision?: boolean;
  aTag?: string;
  bTag?: string;
}

const ethernetStages: Stage[] = [
  {
    label: "Idle",
    narration: "The bus is quiet. Both A and B listen first (carrier sense) before sending anything.",
    aPos: 0,
    bPos: 100,
  },
  {
    label: "Both transmit",
    narration: "Both A and B hear silence at the same instant, so both start transmitting.",
    aPos: 35,
    bPos: 65,
  },
  {
    label: "Collision!",
    narration: "The two signals meet in the middle of the cable and collide — both A and B can detect this because they're still listening while they send.",
    aPos: 50,
    bPos: 50,
    collision: true,
  },
  {
    label: "Random backoff",
    narration: "Both devices stop immediately and wait a random amount of time before trying again, so they don't just collide again straight away.",
    aPos: 0,
    bPos: 100,
  },
  {
    label: "Retry succeeds",
    narration: "A happens to wait a shorter random time, so it retransmits first — and this time there's no collision.",
    aPos: 100,
    bPos: 100,
    aTag: "A",
  },
];

const wifiStages: Stage[] = [
  {
    label: "Out of earshot",
    narration: "Laptop A and Laptop C are both connected to the same Access Point, but they're too far apart to hear each other directly — the classic \"hidden terminal\" setup.",
    aPos: 0,
    bPos: 100,
  },
  {
    label: "Both transmit toward the AP",
    narration: "A listens, hears nothing (C is too far away to detect), and starts sending to the AP. At the same moment, C does exactly the same thing.",
    aPos: 45,
    bPos: 55,
  },
  {
    label: "Collision at the AP",
    narration: "Both signals arrive at the Access Point at the same time and collide there — but neither A nor C can tell, since neither could hear the other transmitting.",
    aPos: 50,
    bPos: 50,
    collision: true,
  },
  {
    label: "A sends RTS",
    narration: "Wi-Fi's fix: before sending real data, A sends a short RTS (Request To Send) to the AP.",
    aPos: 50,
    bPos: null,
    aTag: "RTS",
  },
  {
    label: "AP replies CTS",
    narration: "The AP broadcasts CTS (Clear To Send) — both A and C hear it. C now knows to stay quiet.",
    aPos: null,
    bPos: 50,
    bTag: "CTS",
  },
  {
    label: "A transmits cleanly",
    narration: "C waits it out, so A's data reaches the AP with no collision at all.",
    aPos: 100,
    bPos: null,
    aTag: "DATA",
  },
];

function Track({ stage, leftLabel, rightLabel, centerLabel }: { stage: Stage; leftLabel: string; rightLabel: string; centerLabel: string }) {
  return (
    <div className="relative h-24 rounded-2xl border border-card-border bg-muted px-4">
      <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-card-border" />
      <div className="absolute left-2 top-2 text-xs font-semibold text-secondary">{leftLabel}</div>
      <div className="absolute right-2 top-2 text-xs font-semibold text-secondary">{rightLabel}</div>
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2 text-xs font-semibold text-secondary">
        {centerLabel}
      </div>

      {stage.aPos !== null && (
        <div
          className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full text-xs font-mono font-bold text-white transition-all duration-700 ${
            stage.collision ? "bg-error" : "bg-accent"
          }`}
          style={{ left: `${stage.aPos}%` }}
        >
          {stage.aTag ?? "A"}
        </div>
      )}
      {stage.bPos !== null && (
        <div
          className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full text-xs font-mono font-bold text-white transition-all duration-700 ${
            stage.collision ? "bg-error" : "bg-accent-warm"
          }`}
          style={{ left: `${stage.bPos}%` }}
        >
          {stage.bTag ?? "B"}
        </div>
      )}
      {stage.collision && (
        <div className="absolute left-1/2 top-2 -translate-x-1/2 text-error font-bold text-sm animate-pulse">
          ⚡ COLLISION
        </div>
      )}
    </div>
  );
}

function CollisionScenario({
  mode,
  stages,
  leftLabel,
  rightLabel,
  centerLabel,
}: {
  mode: string;
  stages: Stage[];
  leftLabel: string;
  rightLabel: string;
  centerLabel: string;
}) {
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
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => Math.min(stages.length - 1, i + 1));
    }, 1100);
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

  return (
    <div className="space-y-3">
      <Track stage={stage} leftLabel={leftLabel} rightLabel={rightLabel} centerLabel={centerLabel} />
      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm font-semibold text-heading mb-1">{stage.label}</p>
        <p className="text-sm text-body">{stage.narration}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={play}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          ▶ Play {mode}
        </button>
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

export default function CollisionSimulator() {
  return (
    <div className="space-y-8">
      <ExplainerBox title="Why does Wi-Fi avoid collisions instead of detecting them?">
        <p>
          On a wired Ethernet cable, a device can listen and talk at the same time, so it can
          notice its own signal getting garbled and know a collision just happened. Over Wi-Fi, a
          device&rsquo;s own radio drowns out anything else while it&rsquo;s transmitting — it
          simply can&rsquo;t listen and talk at once. So instead of detecting collisions after they
          happen, Wi-Fi tries to avoid them before they happen.
        </p>
      </ExplainerBox>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Ethernet: CSMA/CD</h4>
        <CollisionScenario
          mode="Ethernet scenario"
          stages={ethernetStages}
          leftLabel="Device A"
          rightLabel="Device B"
          centerLabel="shared cable"
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Wi-Fi: CSMA/CA and the hidden terminal problem
        </h4>
        <CollisionScenario
          mode="Wi-Fi scenario"
          stages={wifiStages}
          leftLabel="Laptop A"
          rightLabel="Laptop C"
          centerLabel="Access Point"
        />
      </div>
    </div>
  );
}
