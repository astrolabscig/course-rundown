"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const layers = ["Application", "Transport", "Network", "Link"] as const;
type Side = "sender" | "wire" | "receiver";

interface Chip {
  label: string;
  color: string;
}

interface Stage {
  side: Side;
  layerIndex: number; // 0-3, meaningless when side === "wire"
  chips: Chip[];
  narration: string;
  wirePos?: number; // 0-100, only for side === "wire"
}

const chipStyles: Record<string, string> = {
  FRAME: "bg-secondary text-white",
  IP: "bg-accent-warm text-white",
  TCP: "bg-accent text-white",
  DATA: "bg-heading text-white",
};

function chip(label: string): Chip {
  return { label, color: chipStyles[label] ?? "bg-secondary text-white" };
}

const stages: Stage[] = [
  {
    side: "sender",
    layerIndex: 0,
    chips: [chip("DATA")],
    narration: "The application builds the message and hands it down to the next layer.",
  },
  {
    side: "sender",
    layerIndex: 1,
    chips: [chip("TCP"), chip("DATA")],
    narration: "Transport (TCP) adds a header for reliable, ordered delivery — and may split a long message into packets.",
  },
  {
    side: "sender",
    layerIndex: 2,
    chips: [chip("IP"), chip("TCP"), chip("DATA")],
    narration: "Network (IP) adds a header with source and destination addresses, so routers know where to send it.",
  },
  {
    side: "sender",
    layerIndex: 3,
    chips: [chip("FRAME"), chip("IP"), chip("TCP"), chip("DATA")],
    narration: "Link adds a frame header (and trailer) for the actual physical transmission, e.g. Ethernet.",
  },
  {
    side: "wire",
    layerIndex: 3,
    wirePos: 15,
    chips: [chip("FRAME"), chip("IP"), chip("TCP"), chip("DATA")],
    narration: "The complete frame leaves the sender's network card onto the physical medium.",
  },
  {
    side: "wire",
    layerIndex: 3,
    wirePos: 85,
    chips: [chip("FRAME"), chip("IP"), chip("TCP"), chip("DATA")],
    narration: "It travels across the network — possibly through several routers — to the destination.",
  },
  {
    side: "receiver",
    layerIndex: 3,
    chips: [chip("IP"), chip("TCP"), chip("DATA")],
    narration: "The receiver's Link layer strips the frame header/trailer straight away.",
  },
  {
    side: "receiver",
    layerIndex: 2,
    chips: [chip("TCP"), chip("DATA")],
    narration: "Network strips the IP header, once it's confirmed this device is the destination.",
  },
  {
    side: "receiver",
    layerIndex: 1,
    chips: [chip("DATA")],
    narration: "Transport strips its header, reassembles any split packets, and hands up a clean message.",
  },
  {
    side: "receiver",
    layerIndex: 0,
    chips: [chip("DATA")],
    narration: "The application receives exactly the original message — every header along the way did its job and was removed again.",
  },
];

function LayerStack({
  title,
  active,
  activeLayer,
}: {
  title: string;
  active: boolean;
  activeLayer: number | null;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary text-center">{title}</p>
      {layers.map((layer, i) => (
        <div
          key={layer}
          className={`rounded-lg border-2 px-3 py-2 text-center text-sm font-mono transition-colors ${
            active && activeLayer === i ? "border-accent bg-white text-heading font-semibold" : "border-card-border bg-white text-secondary"
          }`}
        >
          {layer}
        </div>
      ))}
    </div>
  );
}

export default function EncapsulationSimulator() {
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
    }, 1200);
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
    <div className="space-y-4">
      <ExplainerBox title="Why does data gain and lose headers along the way?">
        <p>
          Think of mailing a letter inside an envelope, then that envelope inside a courier bag,
          then that bag inside a delivery truck. Each layer adds its own wrapper with the
          information IT needs to do its job — and each wrapper is removed by the matching layer
          at the other end, in exactly the reverse order. The original letter never changes; only
          the wrapping does.
        </p>
      </ExplainerBox>

      <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-4">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <LayerStack
            title="Sender"
            active={stage.side === "sender"}
            activeLayer={stage.side === "sender" ? stage.layerIndex : null}
          />

          <div className="flex flex-col items-center justify-end h-full pb-2">
            <div className="relative w-16 sm:w-24 h-1 bg-card-border rounded-full mt-auto mb-[1.65rem]">
              {stage.side === "wire" && (
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full bg-accent transition-all duration-[1100ms]"
                  style={{ left: `${stage.wirePos}%` }}
                />
              )}
            </div>
          </div>

          <LayerStack
            title="Receiver"
            active={stage.side === "receiver"}
            activeLayer={stage.side === "receiver" ? stage.layerIndex : null}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {stage.chips.map((c, i) => (
            <span
              key={i}
              className={`rounded-md px-2 py-1 text-xs font-mono font-semibold ${c.color}`}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{stage.narration}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={play}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          ▶ Play the full journey
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
