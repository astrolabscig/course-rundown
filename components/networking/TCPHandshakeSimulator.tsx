"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface TcpStage {
  narration: string;
  arrow: "none" | "syn" | "synack" | "ack" | "data" | "lost";
}

function buildTcpStages(dropAck: boolean): TcpStage[] {
  const stages: TcpStage[] = [
    { narration: "The client wants a reliable connection, so it sends a SYN (\"synchronize\") — like knocking and saying \"can we talk?\"", arrow: "syn" },
    { narration: "The server agrees and replies SYN-ACK — \"yes, and can you hear me too?\"", arrow: "synack" },
  ];
  if (dropAck) {
    stages.push({ narration: "The client's final ACK gets lost on the way (packet loss happens). The server never receives confirmation...", arrow: "lost" });
    stages.push({ narration: "...so after a timeout, the server assumes something went wrong and retransmits its SYN-ACK, waiting for a valid ACK before it will send any real data. This retry-until-confirmed behaviour is exactly what makes TCP reliable.", arrow: "synack" });
  }
  stages.push({ narration: "The client sends ACK — \"got it, let's go.\" All three parts of the handshake are now confirmed.", arrow: "ack" });
  stages.push({ narration: "Only now does real data start flowing, in order, with each side tracking sequence numbers to detect anything lost along the way.", arrow: "data" });
  return stages;
}

export default function TCPHandshakeSimulator() {
  const [dropAck, setDropAck] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [udpSent, setUdpSent] = useState<{ delivered: boolean } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const stages = buildTcpStages(dropAck);

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
    timeoutRef.current = setTimeout(() => setIndex((i) => Math.min(stages.length - 1, i + 1)), 1200);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, stages.length]);

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

  function sendUdp(lose: boolean) {
    setUdpSent({ delivered: !lose });
    markInteracted();
  }

  const stage = stages[index];
  const arrowText: Record<TcpStage["arrow"], string> = {
    none: "",
    syn: "— SYN →",
    synack: "← SYN-ACK —",
    ack: "— ACK →",
    data: "— DATA →",
    lost: "— ACK → ✕ (lost)",
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <ExplainerBox title="Why does TCP bother with a handshake before sending any data?">
          <p>
            TCP is like two people confirming a phone call is actually connected before either
            starts talking: &ldquo;can you hear me?&rdquo; / &ldquo;yes, can you hear me?&rdquo; /
            &ldquo;yes, go ahead.&rdquo; Only once both sides have proven they can hear each other
            does the real conversation start — and if any part of that confirmation goes missing,
            TCP will patiently retry rather than assume the call connected.
          </p>
        </ExplainerBox>

        <label className="flex items-center gap-2 text-sm text-body">
          <input
            type="checkbox"
            checked={dropAck}
            onChange={(e) => {
              setDropAck(e.target.checked);
              setIndex(0);
              setPlaying(false);
              markInteracted();
            }}
          />
          Simulate the final ACK getting lost
        </label>

        <button
          type="button"
          onClick={play}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          ▶ Play TCP handshake
        </button>

        <div className="rounded-2xl border border-card-border bg-muted p-6">
          <div className="flex items-center justify-between">
            <div className="rounded-xl border-2 border-accent bg-white px-4 py-3 text-sm font-mono font-semibold text-heading">
              Client
            </div>
            <div className="flex-1 text-center px-4 text-sm font-mono text-accent">
              {arrowText[stage.arrow]}
            </div>
            <div className="rounded-xl border-2 border-accent-warm bg-white px-4 py-3 text-sm font-mono font-semibold text-heading">
              Server
            </div>
          </div>
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

      <div className="space-y-3">
        <ExplainerBox title="What does UDP do instead?">
          <p>
            UDP skips the handshake entirely — it just fires the message and hopes for the best,
            like shouting across a room without waiting to see if anyone actually heard you. No
            setup, no confirmation, no automatic retry: faster, but it's entirely up to the
            application to notice if something never arrived.
          </p>
        </ExplainerBox>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => sendUdp(false)}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Send UDP packet
          </button>
          <button
            type="button"
            onClick={() => sendUdp(true)}
            className="px-4 py-1.5 rounded-full border border-error text-error text-sm font-medium hover:bg-error-bg transition-colors"
          >
            Send UDP packet (simulate loss)
          </button>
        </div>
        {udpSent && (
          <div className={`rounded-xl p-4 text-sm ${udpSent.delivered ? "bg-accent-warm-bg text-heading" : "bg-error-bg border-l-4 border-error text-error"}`}>
            {udpSent.delivered
              ? "Delivered — no handshake, no acknowledgement, just sent and arrived."
              : "Lost in transit — and unlike TCP, nothing here will notice or retry automatically. If the application cares, IT has to detect and handle the loss itself."}
          </div>
        )}
      </div>
    </div>
  );
}
