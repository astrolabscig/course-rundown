"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Rule {
  action: "Allow" | "Block";
  protocol: "TCP" | "UDP" | "Any";
  port: number | "Any";
  note: string;
}

const rules: Rule[] = [
  { action: "Allow", protocol: "TCP", port: 443, note: "HTTPS web traffic" },
  { action: "Allow", protocol: "TCP", port: 80, note: "HTTP web traffic" },
  { action: "Block", protocol: "TCP", port: 23, note: "Telnet — insecure, unencrypted logins" },
  { action: "Block", protocol: "Any", port: 3389, note: "Remote desktop — commonly attacked if left open" },
  { action: "Allow", protocol: "UDP", port: 53, note: "DNS queries" },
];

const presets: { label: string; protocol: "TCP" | "UDP"; port: number }[] = [
  { label: "HTTPS (443/TCP)", protocol: "TCP", port: 443 },
  { label: "Telnet (23/TCP)", protocol: "TCP", port: 23 },
  { label: "RDP (3389/TCP)", protocol: "TCP", port: 3389 },
  { label: "DNS (53/UDP)", protocol: "UDP", port: 53 },
  { label: "Random port (9999/TCP)", protocol: "TCP", port: 9999 },
];

function evaluate(protocol: "TCP" | "UDP", port: number): { action: "Allowed" | "Blocked"; rule: Rule | null } {
  for (const rule of rules) {
    const protoMatch = rule.protocol === "Any" || rule.protocol === protocol;
    const portMatch = rule.port === "Any" || rule.port === port;
    if (protoMatch && portMatch) {
      return { action: rule.action === "Allow" ? "Allowed" : "Blocked", rule };
    }
  }
  return { action: "Blocked", rule: null }; // implicit deny
}

export default function FirewallSimulator() {
  const [log, setLog] = useState<{ protocol: string; port: number; result: string; reason: string }[]>([]);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function fire(protocol: "TCP" | "UDP", port: number) {
    const { action, rule } = evaluate(protocol, port);
    const reason = rule
      ? `Matched rule: ${rule.action} ${rule.protocol} ${rule.port} (${rule.note})`
      : "No rule matched — implicit deny (firewalls block by default unless a rule explicitly allows it).";
    setLog((prev) => [{ protocol, port, result: action, reason }, ...prev]);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="What is a firewall actually doing?">
        <p>
          A firewall is like a bouncer with a strict guest list, checked top to bottom: each
          arriving packet is compared against the rules in order, and the FIRST matching rule
          decides its fate — allowed in, turned away, or turned away and written down in a log. If
          nothing on the list matches at all, the safe default is to turn it away anyway (implicit
          deny) rather than let anything unrecognised through.
        </p>
      </ExplainerBox>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
          Firewall rules (checked in order)
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-1 text-heading font-semibold border-b border-card-border">Action</th>
              <th className="text-left p-1 text-heading font-semibold border-b border-card-border">Protocol</th>
              <th className="text-left p-1 text-heading font-semibold border-b border-card-border">Port</th>
              <th className="text-left p-1 text-heading font-semibold border-b border-card-border">Note</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={i} className="border-b border-card-border last:border-0">
                <td className={`p-1 font-semibold ${r.action === "Allow" ? "text-success" : "text-error"}`}>{r.action}</td>
                <td className="p-1 font-mono">{r.protocol}</td>
                <td className="p-1 font-mono">{r.port}</td>
                <td className="p-1 text-body">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => fire(p.protocol, p.port)}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            Send: {p.label}
          </button>
        ))}
      </div>

      {log.length > 0 && (
        <div className="space-y-2">
          {log.map((entry, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 text-sm ${
                entry.result === "Allowed" ? "bg-accent-warm-bg text-heading" : "bg-error-bg border-l-4 border-error text-error"
              }`}
            >
              <span className="font-mono font-semibold">
                {entry.protocol} port {entry.port}
              </span>{" "}
              — <span className="font-semibold">{entry.result}</span>. {entry.reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
