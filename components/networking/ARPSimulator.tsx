"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Stage {
  narration: string;
  arrow: "none" | "broadcast" | "reply";
  cacheEntry: boolean;
}

const stages: Stage[] = [
  {
    narration: "Host A wants to send a packet to 192.168.1.20, but it needs the destination's MAC address first — IP addresses get you to the right network, MAC addresses get you to the right physical device on it. Host A checks its ARP cache: empty, no entry yet.",
    arrow: "none",
    cacheEntry: false,
  },
  {
    narration: "Host A broadcasts an ARP Request to EVERY device on the local network: \"Who has 192.168.1.20? Tell 192.168.1.10.\"",
    arrow: "broadcast",
    cacheEntry: false,
  },
  {
    narration: "Every device receives the broadcast, but only Host B recognises 192.168.1.20 as its own address — it replies directly (unicast, not broadcast) with an ARP Reply: \"192.168.1.20 is at BB:BB:BB:BB:BB:BB.\"",
    arrow: "reply",
    cacheEntry: false,
  },
  {
    narration: "Host A stores this mapping in its ARP cache so it doesn't have to ask again for a while — the next packet to 192.168.1.20 can be addressed straight to that MAC.",
    arrow: "none",
    cacheEntry: true,
  },
];

export default function ARPSimulator() {
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
    timeoutRef.current = setTimeout(() => setIndex((i) => Math.min(stages.length - 1, i + 1)), 1100);
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
      <ExplainerBox title="Why do we need ARP if we already have an IP address?">
        <p>
          An IP address is like a house's street address — it gets your letter to the right
          street. But the mail carrier still needs to know which specific door to knock on: that's
          the MAC address, burned into the network card itself. ARP is simply the network shouting
          &ldquo;whoever lives at this street address, what's your door number?&rdquo; so devices
          can translate between the two.
        </p>
      </ExplainerBox>

      <button
        type="button"
        onClick={play}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        ▶ Play ARP request/reply
      </button>

      <div className="rounded-2xl border border-card-border bg-muted p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-xl border-2 border-accent bg-white px-4 py-3 text-sm font-mono font-semibold text-heading text-center">
            Host A
            <div className="text-xs text-secondary font-normal">192.168.1.10</div>
          </div>
          <div className="flex-1 text-center px-4 text-sm font-mono text-accent">
            {stage.arrow === "broadcast" && "— ARP Request (broadcast) →"}
            {stage.arrow === "reply" && "← ARP Reply (unicast)"}
          </div>
          <div className="rounded-xl border-2 border-accent-warm bg-white px-4 py-3 text-sm font-mono font-semibold text-heading text-center">
            Host B
            <div className="text-xs text-secondary font-normal">192.168.1.20 / BB:BB:BB:BB:BB:BB</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
          Host A's ARP cache
        </p>
        {stage.cacheEntry ? (
          <table className="text-sm font-mono text-body">
            <tbody>
              <tr>
                <td className="pr-4 font-semibold text-heading">192.168.1.20</td>
                <td>BB:BB:BB:BB:BB:BB</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-secondary">Empty.</p>
        )}
      </div>

      <div className="rounded-xl bg-muted p-4">
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
