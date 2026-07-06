"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface NatEntry {
  privateAddr: string;
  publicPort: number;
}

const publicIp = "203.0.113.5";
const clients = ["192.168.1.10", "192.168.1.11", "192.168.1.12"];

export default function NATSimulator() {
  const [entries, setEntries] = useState<NatEntry[]>([]);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function sendRequest(client: string) {
    const port = 40000 + entries.length;
    setEntries((prev) => [...prev, { privateAddr: `${client}:5000`, publicPort: port }]);
    markInteracted();
  }

  function reset() {
    setEntries([]);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why can a whole house share one public IP address?">
        <p>
          Think of NAT like an office receptionist who has only ONE outside phone line. When
          someone in the office calls out, the receptionist notes down &ldquo;extension 12 is on
          line 3,&rdquo; dials out using the single shared line, and when the reply comes back on
          line 3, correctly forwards it to extension 12 — even though the outside world only ever
          saw one phone number for the whole building. That's exactly how a home router lets many
          private devices (192.168.x.x) share one public IP address.
        </p>
      </ExplainerBox>

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex flex-col gap-2">
            {clients.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => sendRequest(c)}
                className="rounded-xl border-2 border-accent bg-white px-3 py-2 text-sm font-mono text-heading hover:bg-accent hover:text-white transition-colors"
              >
                {c} — send request
              </button>
            ))}
          </div>
          <div className="text-2xl text-secondary">→</div>
          <div className="rounded-xl border-2 border-accent-warm bg-white px-4 py-3 text-sm font-mono font-semibold text-heading text-center">
            Router (NAT)
            <div className="text-xs text-secondary mt-1 font-normal">public IP: {publicIp}</div>
          </div>
          <div className="text-2xl text-secondary">→</div>
          <div className="rounded-xl border-2 border-card-border bg-white px-4 py-3 text-sm font-mono text-heading">
            Internet
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">NAT table</p>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            Reset
          </button>
        </div>
        {entries.length === 0 ? (
          <p className="text-sm text-secondary">Empty — click a client above to send a request.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-1 text-heading font-semibold border-b border-card-border">Private (inside)</th>
                  <th className="text-left p-1 text-heading font-semibold border-b border-card-border">Public (outside)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className="border-b border-card-border last:border-0">
                    <td className="p-1 font-mono">{e.privateAddr}</td>
                    <td className="p-1 font-mono">
                      {publicIp}:{e.publicPort}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {entries.length > 1 && (
          <p className="text-xs text-secondary mt-2">
            Notice: every client shows the exact same public IP ({publicIp}) to the outside world —
            only the port number tells the router which internal device a reply belongs to.
          </p>
        )}
      </div>
    </div>
  );
}
