"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import {
  parseIp,
  calculateSubnet,
  uint32ToDotted,
  classify,
  DEFAULT_PREFIX_BY_CLASS,
  maskUint32ToPrefix,
  prefixToMaskUint32,
} from "@/lib/networking/ipMath";
import { trackInteract } from "@/lib/track";

const presets: { label: string; ip: string; prefix: number }[] = [
  { label: "144.16.72.57 /18", ip: "144.16.72.57", prefix: 18 },
  { label: "192.203.17.0 /26", ip: "192.203.17.0", prefix: 26 },
  { label: "10.5.0.20 /16", ip: "10.5.0.20", prefix: 16 },
];

export default function SubnetCalculator() {
  const [ipStr, setIpStr] = useState(presets[0].ip);
  const [mode, setMode] = useState<"prefix" | "dotted">("prefix");
  const [prefixStr, setPrefixStr] = useState(String(presets[0].prefix));
  const [dottedMask, setDottedMask] = useState("255.255.192.0");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function applyPreset(p: (typeof presets)[number]) {
    setIpStr(p.ip);
    setMode("prefix");
    setPrefixStr(String(p.prefix));
    markInteracted();
  }

  const ipOctets = parseIp(ipStr);
  let prefix: number | null = null;
  if (mode === "prefix") {
    const n = Number(prefixStr);
    prefix = Number.isInteger(n) && n >= 0 && n <= 32 ? n : null;
  } else {
    const maskOctets = parseIp(dottedMask);
    if (maskOctets) {
      const maskInt = (maskOctets.o1 * 16777216 + maskOctets.o2 * 65536 + maskOctets.o3 * 256 + maskOctets.o4) >>> 0;
      prefix = maskUint32ToPrefix(maskInt);
    }
  }

  const result = ipOctets && prefix !== null ? calculateSubnet(ipOctets, prefix) : null;
  const ipClass = ipOctets ? classify(ipOctets.o1) : null;
  const defaultPrefix = ipClass ? DEFAULT_PREFIX_BY_CLASS[ipClass] : null;
  const bitsBorrowed =
    result && defaultPrefix !== null && result.prefix > defaultPrefix ? result.prefix - defaultPrefix : 0;
  const subnetsCreated = bitsBorrowed > 0 ? Math.pow(2, bitsBorrowed) : null;

  return (
    <div className="space-y-4">
      <ExplainerBox title="What does subnetting actually do?">
        <p>
          Subnetting means borrowing some bits from the host part of an address and handing them
          to the network part instead — like carving one big neighbourhood into smaller streets.
          Borrow more bits and you get more, smaller streets (subnets); borrow fewer and you get
          fewer, bigger ones. This calculator does the exact arithmetic an exam question expects,
          one labelled step at a time.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-mono text-body hover:border-accent transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="subnet-ip" className="text-sm font-medium text-heading">
            IP address
          </label>
          <input
            id="subnet-ip"
            value={ipStr}
            onChange={(e) => {
              setIpStr(e.target.value);
              markInteracted();
            }}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-44 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-heading">Mask given as</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMode("prefix");
                markInteracted();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                mode === "prefix"
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-body border-card-border hover:border-accent"
              }`}
            >
              Prefix (/n)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("dotted");
                markInteracted();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                mode === "dotted"
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-body border-card-border hover:border-accent"
              }`}
            >
              Dotted mask
            </button>
          </div>
        </div>

        {mode === "prefix" ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="subnet-prefix" className="text-sm font-medium text-heading">
              Prefix
            </label>
            <input
              id="subnet-prefix"
              value={prefixStr}
              onChange={(e) => {
                setPrefixStr(e.target.value);
                markInteracted();
              }}
              className="rounded-full border border-card-border px-3 py-1.5 text-sm w-20 font-mono"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label htmlFor="subnet-mask" className="text-sm font-medium text-heading">
              Dotted mask
            </label>
            <input
              id="subnet-mask"
              value={dottedMask}
              onChange={(e) => {
                setDottedMask(e.target.value);
                markInteracted();
              }}
              className="rounded-full border border-card-border px-3 py-1.5 text-sm w-40 font-mono"
            />
          </div>
        )}
      </div>

      {!ipOctets || prefix === null ? (
        <p className="text-sm text-error">
          Enter a valid IPv4 address and a valid mask (a prefix 0-32, or a contiguous dotted mask).
        </p>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-muted p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                1. Network address
              </div>
              <div className="font-mono font-semibold text-heading">
                {uint32ToDotted(result!.networkUint32)}
              </div>
              <p className="text-xs text-secondary mt-1">IP AND mask — the all-zeros host address.</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                2. Broadcast address
              </div>
              <div className="font-mono font-semibold text-heading">
                {uint32ToDotted(result!.broadcastUint32)}
              </div>
              <p className="text-xs text-secondary mt-1">Network address with all host bits set to 1.</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                3. First / last usable host
              </div>
              <div className="font-mono font-semibold text-heading">
                {uint32ToDotted(result!.firstUsableUint32)} – {uint32ToDotted(result!.lastUsableUint32)}
              </div>
              <p className="text-xs text-secondary mt-1">Network + 1 through broadcast − 1.</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                4. Addresses in this block
              </div>
              <div className="font-mono font-semibold text-heading">
                {result!.totalAddresses.toLocaleString()} total, {result!.usableHosts.toLocaleString()} usable
              </div>
              <p className="text-xs text-secondary mt-1">
                2^{result!.hostBits} total (2^{result!.hostBits} − 2 usable — network and broadcast
                aren&rsquo;t assignable to a device).
              </p>
            </div>
          </div>

          {ipClass && defaultPrefix !== null && (
            <div className="rounded-xl bg-accent-warm-bg p-4 text-sm text-heading">
              This is a class {ipClass} address, whose default mask is /{defaultPrefix}.{" "}
              {bitsBorrowed > 0 ? (
                <>
                  Using /{result!.prefix} borrows <span className="font-semibold">{bitsBorrowed}</span> bit
                  {bitsBorrowed === 1 ? "" : "s"} from the host portion, creating{" "}
                  <span className="font-semibold">{subnetsCreated}</span> subnets (2^{bitsBorrowed}) out of
                  the original network.
                </>
              ) : (
                "This mask matches the default — no bits have been borrowed for subnetting."
              )}
            </div>
          )}

          <div className="rounded-xl bg-muted p-4 text-sm text-body">
            <span className="font-mono">
              Mask: {uint32ToDotted(prefixToMaskUint32(result!.prefix))} (/{result!.prefix})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
