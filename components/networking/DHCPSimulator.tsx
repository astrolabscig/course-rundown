"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Stage {
  label: string;
  narration: string;
  arrow: "none" | "client-to-server" | "server-to-client";
  packetLabel?: string;
}

const stages: Stage[] = [
  {
    label: "Discover",
    narration: "The client has no IP address yet, so it broadcasts \"is there a DHCP server out there?\" to everyone on the local network.",
    arrow: "client-to-server",
    packetLabel: "DHCPDISCOVER (broadcast)",
  },
  {
    label: "Offer",
    narration: "A DHCP server replies with an offer: \"you can have this IP, this mask, this gateway, and this DNS server.\"",
    arrow: "server-to-client",
    packetLabel: "DHCPOFFER",
  },
  {
    label: "Request",
    narration: "The client replies, formally requesting that specific offered address (this also lets it politely decline offers from other DHCP servers, if there were more than one).",
    arrow: "client-to-server",
    packetLabel: "DHCPREQUEST",
  },
  {
    label: "Acknowledge",
    narration: "The server confirms with an ACK — the client can now actually use that IP, mask, gateway, and DNS server (for a limited \"lease\" time).",
    arrow: "server-to-client",
    packetLabel: "DHCPACK",
  },
];

const failureStage: Stage = {
  label: "No offer — pool exhausted",
  narration: "The DHCP server has no addresses left in its pool to hand out, so it never sends an Offer. The client waits, times out, and — on many systems — falls back to an APIPA address (169.254.x.x), which only works for talking to other APIPA devices on the same local network, not the wider network.",
  arrow: "none",
};

export default function DHCPSimulator() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
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
    timeoutRef.current = setTimeout(() => setIndex((i) => Math.min(stages.length - 1, i + 1)), 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  function play() {
    setShowFailure(false);
    setIndex(0);
    setPlaying(true);
    markInteracted();
  }

  function step(delta: number) {
    setPlaying(false);
    setIndex((i) => Math.min(stages.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  const stage = showFailure ? failureStage : stages[index];

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why does a device need DHCP at all?">
        <p>
          Every device needs an IP address to talk on a network, but nobody wants to type one in
          by hand on every phone and laptop that joins a Wi-Fi network. DHCP is the network's
          automatic &ldquo;welcome desk&rdquo;: a new device asks, and the server hands it a
          complete address configuration — IP, mask, gateway, DNS — good for a limited time,
          exactly like checking into a hotel room for a few nights.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={play}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          ▶ Play DORA
        </button>
        <button
          type="button"
          onClick={() => {
            setShowFailure(true);
            markInteracted();
          }}
          className="px-4 py-1.5 rounded-full border border-error text-error text-sm font-medium hover:bg-error-bg transition-colors"
        >
          Show: address pool exhausted
        </button>
      </div>

      <div className="relative rounded-2xl border border-card-border bg-muted p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-xl border-2 border-accent bg-white px-4 py-3 text-sm font-mono font-semibold text-heading">
            Client
          </div>
          <div className="flex-1 text-center px-4">
            {stage.arrow !== "none" && (
              <div className="text-sm font-mono text-accent">
                {stage.arrow === "client-to-server" ? "— " + (stage.packetLabel ?? "") + " →" : "← " + (stage.packetLabel ?? "")}
              </div>
            )}
          </div>
          <div className="rounded-xl border-2 border-accent-warm bg-white px-4 py-3 text-sm font-mono font-semibold text-heading">
            DHCP Server
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm font-semibold text-heading mb-1">{stage.label}</p>
        <p className="text-sm text-body">{stage.narration}</p>
      </div>

      {!showFailure && (
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
      )}
    </div>
  );
}
