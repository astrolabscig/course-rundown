"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { parseIp, octetsToUint32 } from "@/lib/networking/ipMath";
import { trackInteract } from "@/lib/track";

interface DeviceConfig {
  ip: string;
  mask: string;
  gateway: string;
  dns: string;
}

const defaultA: DeviceConfig = { ip: "192.168.1.10", mask: "255.255.255.0", gateway: "192.168.1.1", dns: "8.8.8.8" };
const defaultB: DeviceConfig = { ip: "192.168.1.20", mask: "255.255.255.0", gateway: "192.168.1.1", dns: "8.8.8.8" };

interface Diagnosis {
  ok: boolean;
  message: string;
}

function networkOf(ip: string, mask: string): number | null {
  const ipOctets = parseIp(ip);
  const maskOctets = parseIp(mask);
  if (!ipOctets || !maskOctets) return null;
  return (octetsToUint32(ipOctets) & octetsToUint32(maskOctets)) >>> 0;
}

function diagnose(a: DeviceConfig, b: DeviceConfig): Diagnosis {
  const aIp = parseIp(a.ip);
  const bIp = parseIp(b.ip);
  const aMask = parseIp(a.mask);
  const bMask = parseIp(b.mask);
  const aGw = parseIp(a.gateway);
  const bGw = parseIp(b.gateway);

  if (!aIp || !bIp || !aMask || !bMask || !aGw || !bGw) {
    return { ok: false, message: "One of the addresses isn't a valid IPv4 address — check the format (four numbers 0-255 separated by dots)." };
  }

  if (a.ip === b.ip) {
    return {
      ok: false,
      message: `IP address conflict: both devices are configured with ${a.ip}. Every device on a network needs its own unique address — give one of them a different IP.`,
    };
  }

  const aNet = networkOf(a.ip, a.mask);
  const aGwNet = networkOf(a.gateway, a.mask);
  if (aNet !== aGwNet) {
    return {
      ok: false,
      message: `Device A's gateway (${a.gateway}) is outside Device A's own subnet (using mask ${a.mask}). A device's default gateway must live on its own local network, or it has no way to reach it — Device A won't be able to reach anything beyond its own subnet.`,
    };
  }

  const bNet = networkOf(b.ip, b.mask);
  const bGwNet = networkOf(b.gateway, b.mask);
  if (bNet !== bGwNet) {
    return {
      ok: false,
      message: `Device B's gateway (${b.gateway}) is outside Device B's own subnet (using mask ${b.mask}) — same problem, just on Device B this time.`,
    };
  }

  if (a.mask !== b.mask) {
    return {
      ok: false,
      message: `Mismatched subnet masks: Device A uses ${a.mask}, Device B uses ${b.mask}. Even if the IPs look close together, the two devices disagree about where their local network ends — this alone can break direct communication.`,
    };
  }

  if (aNet === bNet) {
    return {
      ok: true,
      message: `Both devices resolve to the same network address (${aNet !== null ? "matching" : ""}) — they're on the same subnet and can communicate directly, no router needed.`,
    };
  }

  return {
    ok: false,
    message: `Device A and Device B are on different subnets (their IPs, masked, produce different network addresses). They aren't misconfigured — but for them to talk, traffic has to go through their gateways/a router. Direct communication on this local link won't work.`,
  };
}

function DeviceForm({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DeviceConfig;
  onChange: (v: DeviceConfig) => void;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-white p-4 space-y-2">
      <p className="text-sm font-semibold text-heading">{label}</p>
      {(["ip", "mask", "gateway", "dns"] as const).map((field) => (
        <div key={field} className="flex items-center gap-2">
          <label className="w-20 shrink-0 text-xs font-medium text-secondary uppercase" htmlFor={`${label}-${field}`}>
            {field}
          </label>
          <input
            id={`${label}-${field}`}
            value={value[field]}
            onChange={(e) => onChange({ ...value, [field]: e.target.value })}
            className="flex-1 rounded-full border border-card-border px-3 py-1 text-sm font-mono"
          />
        </div>
      ))}
    </div>
  );
}

export default function IPConfigSimulator() {
  const [a, setA] = useState<DeviceConfig>(defaultA);
  const [b, setB] = useState<DeviceConfig>(defaultB);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function test() {
    setResult(diagnose(a, b));
    markInteracted();
  }

  const presets: { label: string; apply: () => void }[] = [
    {
      label: "Working config",
      apply: () => {
        setA(defaultA);
        setB(defaultB);
        setResult(null);
      },
    },
    {
      label: "Wrong gateway",
      apply: () => {
        setA({ ...defaultA, gateway: "10.0.0.1" });
        setB(defaultB);
        setResult(null);
      },
    },
    {
      label: "Duplicate IP",
      apply: () => {
        setA(defaultA);
        setB({ ...defaultB, ip: defaultA.ip });
        setResult(null);
      },
    },
    {
      label: "Mismatched mask",
      apply: () => {
        setA(defaultA);
        setB({ ...defaultB, mask: "255.255.255.128" });
        setResult(null);
      },
    },
  ];

  return (
    <div className="space-y-4">
      <ExplainerBox title="What makes two devices able to talk to each other?">
        <p>
          Two devices on the same network can only reach each other directly if their IP
          addresses land in the same &ldquo;street&rdquo; (network portion, decided by their
          subnet mask), and each device's own gateway address is a real address on its OWN street
          — otherwise it's like giving someone directions to a door that isn't actually on their
          road.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              p.apply();
              markInteracted();
            }}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DeviceForm label="Device A" value={a} onChange={setA} />
        <DeviceForm label="Device B" value={b} onChange={setB} />
      </div>

      <button
        type="button"
        onClick={test}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        Test connection
      </button>

      {result && (
        <div
          className={`rounded-xl p-4 text-sm ${
            result.ok ? "bg-accent-warm-bg text-heading" : "bg-error-bg border-l-4 border-error text-error"
          }`}
        >
          <span className="font-semibold">{result.ok ? "Success — " : "Failed — "}</span>
          {result.message}
        </div>
      )}
    </div>
  );
}
