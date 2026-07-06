"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type Party = "root" | "tld" | "authoritative" | null;

interface Stage {
  narration: string;
  talkingTo: Party;
  direction: "ask" | "answer" | "none";
  resolved: boolean;
}

const stages: Stage[] = [
  {
    narration: "You type www.example.com into your browser and press Enter.",
    talkingTo: null,
    direction: "none",
    resolved: false,
  },
  {
    narration: "Your computer asks its recursive resolver (often run by your ISP): \"What's the IP for www.example.com?\" The resolver does all the legwork on your behalf.",
    talkingTo: null,
    direction: "none",
    resolved: false,
  },
  {
    narration: "The resolver doesn't know yet, so it asks a root server: \"Who handles .com addresses?\"",
    talkingTo: "root",
    direction: "ask",
    resolved: false,
  },
  {
    narration: "The root server doesn't know the exact IP either, but it knows who to ask next: \"Try this .com TLD server.\"",
    talkingTo: "root",
    direction: "answer",
    resolved: false,
  },
  {
    narration: "The resolver asks the .com TLD (Top-Level Domain) server: \"Who's authoritative for example.com?\"",
    talkingTo: "tld",
    direction: "ask",
    resolved: false,
  },
  {
    narration: "The TLD server replies: \"Ask this authoritative name server — it manages example.com directly.\"",
    talkingTo: "tld",
    direction: "answer",
    resolved: false,
  },
  {
    narration: "The resolver asks the authoritative server directly: \"What's the IP for www.example.com?\"",
    talkingTo: "authoritative",
    direction: "ask",
    resolved: false,
  },
  {
    narration: "The authoritative server actually owns this answer and replies with the real IP: 93.184.216.34.",
    talkingTo: "authoritative",
    direction: "answer",
    resolved: true,
  },
  {
    narration: "The resolver hands that IP back to your browser (and remembers it for a while, so it doesn't have to repeat this whole chain next time). Your browser can now open a connection directly to 93.184.216.34.",
    talkingTo: null,
    direction: "none",
    resolved: true,
  },
];

export default function DNSSimulator() {
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
  const servers: { key: Party; label: string }[] = [
    { key: "root", label: "Root server" },
    { key: "tld", label: ".com TLD server" },
    { key: "authoritative", label: "Authoritative server" },
  ];

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why does finding one IP address take so many steps?">
        <p>
          DNS is organised like asking for directions in stages, never trying to know everything
          at once: a root server only knows which office handles &ldquo;.com&rdquo; addresses in
          general; that office only knows which specific desk handles &ldquo;example.com&rdquo;;
          only that desk actually has the real answer. Splitting it this way means no single
          server needs to store the address of every website on the internet.
        </p>
      </ExplainerBox>

      <button
        type="button"
        onClick={play}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        ▶ Play DNS resolution
      </button>

      <div className="rounded-2xl border border-card-border bg-muted p-6 space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-xl border-2 border-accent bg-white px-4 py-3 text-sm font-mono font-semibold text-heading text-center">
            Browser
          </div>
          <div className="text-sm text-secondary">↔</div>
          <div className="rounded-xl border-2 border-accent bg-white px-4 py-3 text-sm font-mono font-semibold text-heading text-center">
            Recursive resolver
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          {servers.map((s) => (
            <div key={s.key} className="flex flex-col items-center gap-1">
              {stage.talkingTo === s.key && (
                <span className="text-xs font-mono text-accent">
                  {stage.direction === "ask" ? "asking ↓" : "answer ↑"}
                </span>
              )}
              <div
                className={`rounded-xl border-2 px-3 py-2 text-xs font-mono text-center transition-colors ${
                  stage.talkingTo === s.key ? "border-accent bg-accent text-white" : "border-card-border bg-white text-heading"
                }`}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {stage.resolved && (
          <div className="text-center text-sm font-mono text-success font-semibold">
            www.example.com → 93.184.216.34
          </div>
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
