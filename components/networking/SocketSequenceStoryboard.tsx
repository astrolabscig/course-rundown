"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type Lane = "server" | "client" | "both";

interface Step {
  lane: Lane;
  call: string;
  narration: string;
  listeningSocket: boolean;
  acceptedSocket: boolean;
}

const steps: Step[] = [
  {
    lane: "server",
    call: "socket()",
    narration:
      "The server creates a brand-new socket — an endpoint the OS will use for network communication. At this point it isn't attached to any address yet.",
    listeningSocket: false,
    acceptedSocket: false,
  },
  {
    lane: "server",
    call: "bind()",
    narration:
      "The server attaches that socket to a specific local IP address and port number (e.g. 192.168.10.5:8080), so the OS knows to hand incoming traffic for that address/port to this socket.",
    listeningSocket: true,
    acceptedSocket: false,
  },
  {
    lane: "server",
    call: "listen()",
    narration:
      "The server marks the socket as passive — willing to accept incoming connection requests — and sets a backlog (how many pending connections can queue up before being accepted).",
    listeningSocket: true,
    acceptedSocket: false,
  },
  {
    lane: "server",
    call: "accept()",
    narration:
      "The server calls accept() and blocks — it does nothing else, just waits here until some client actually tries to connect. This is the listening socket doing its one job: waiting.",
    listeningSocket: true,
    acceptedSocket: false,
  },
  {
    lane: "client",
    call: "socket()",
    narration: "Meanwhile, the client creates its own socket — again, not yet attached to anything.",
    listeningSocket: true,
    acceptedSocket: false,
  },
  {
    lane: "client",
    call: "connect()",
    narration:
      "The client actively reaches out to the server's known IP and port. This is what triggers the TCP three-way handshake at the transport layer. The moment it completes, the server's blocked accept() call finally returns.",
    listeningSocket: true,
    acceptedSocket: false,
  },
  {
    lane: "both",
    call: "accept() returns",
    narration:
      "accept() returns a brand-new socket — the accepted socket — dedicated entirely to this one client. The original listening socket is untouched and free to call accept() again for the next client. This is the key distinction the assignment asks for: one listening socket, many possible accepted sockets.",
    listeningSocket: true,
    acceptedSocket: true,
  },
  {
    lane: "client",
    call: "send()",
    narration: "The client sends its request (e.g. an HTTP GET, or a custom application message) over its socket.",
    listeningSocket: true,
    acceptedSocket: true,
  },
  {
    lane: "server",
    call: "recv()",
    narration: "The server reads the incoming request — using the accepted socket, not the listening socket.",
    listeningSocket: true,
    acceptedSocket: true,
  },
  {
    lane: "server",
    call: "send()",
    narration: "The server processes the request and sends its response back, again on the accepted socket.",
    listeningSocket: true,
    acceptedSocket: true,
  },
  {
    lane: "client",
    call: "recv()",
    narration: "The client reads the server's response.",
    listeningSocket: true,
    acceptedSocket: true,
  },
  {
    lane: "client",
    call: "close()",
    narration: "The client closes its socket — its side of the conversation is done.",
    listeningSocket: true,
    acceptedSocket: true,
  },
  {
    lane: "server",
    call: "close()",
    narration:
      "The server closes the accepted socket for this client. The listening socket, however, is still open — the server loops back to accept() and waits for the next client. (The listening socket itself is only closed when the server shuts down entirely.)",
    listeningSocket: true,
    acceptedSocket: false,
  },
];

export default function SocketSequenceStoryboard() {
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
    if (!playing || index >= steps.length - 1) return;
    timeoutRef.current = setTimeout(() => setIndex((i) => Math.min(steps.length - 1, i + 1)), 1500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [playing, index]);

  function play() {
    setIndex(0);
    setPlaying(true);
    markInteracted();
  }

  function step(delta: number) {
    setPlaying(false);
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  const current = steps[index];
  const serverStepsSoFar = steps.slice(0, index + 1).filter((s) => s.lane === "server" || s.lane === "both");
  const clientStepsSoFar = steps.slice(0, index + 1).filter((s) => s.lane === "client" || s.lane === "both");

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why the server and client call a different sequence of functions">
        <p>
          Both sides use the same underlying socket API, but their roles are asymmetric: the
          server has to prepare a rendezvous point and then patiently wait (bind → listen →
          accept), while the client just reaches out the moment it wants to (socket → connect).
          Step through the sequence below in the correct interleaved order.
        </p>
      </ExplainerBox>

      <button
        type="button"
        onClick={play}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        ▶ Play the full sequence
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Server</p>
          {serverStepsSoFar.map((s, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 font-mono text-sm transition-colors ${
                s === current ? "bg-accent text-white font-semibold" : "bg-card text-body"
              }`}
            >
              {s.call}
            </div>
          ))}
          {serverStepsSoFar.length === 0 && <p className="text-xs text-secondary">Not started yet.</p>}
        </div>
        <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Client</p>
          {clientStepsSoFar.map((s, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 font-mono text-sm transition-colors ${
                s === current ? "bg-accent text-white font-semibold" : "bg-card text-body"
              }`}
            >
              {s.call}
            </div>
          ))}
          {clientStepsSoFar.length === 0 && <p className="text-xs text-secondary">Not started yet.</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <span
          className={`px-2.5 py-1 rounded-full font-semibold ${
            current.listeningSocket ? "bg-accent/15 text-accent" : "bg-muted text-secondary"
          }`}
        >
          Listening socket: {current.listeningSocket ? "open" : "not yet created"}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full font-semibold ${
            current.acceptedSocket ? "bg-success/15 text-success" : "bg-muted text-secondary"
          }`}
        >
          Accepted socket: {current.acceptedSocket ? "open, dedicated to this client" : "not yet created"}
        </span>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4">
        <p className="text-sm text-body">{current.narration}</p>
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
          disabled={index === steps.length - 1}
          className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40"
        >
          ▶
        </button>
        <span className="text-sm text-secondary">
          Step {index + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
}
