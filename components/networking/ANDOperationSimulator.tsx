"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { parseIp, octetsToUint32, uint32ToOctets, maskUint32ToPrefix } from "@/lib/networking/ipMath";
import { trackInteract } from "@/lib/track";

function bitsArray(n: number): number[] {
  const bits: number[] = [];
  for (let i = 31; i >= 0; i--) bits.push((n >>> i) & 1);
  return bits;
}

function BitsRow({
  label,
  bits,
  dim,
}: {
  label: string;
  bits: number[];
  dim?: boolean;
}) {
  const groups = [bits.slice(0, 8), bits.slice(8, 16), bits.slice(16, 24), bits.slice(24, 32)];
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs font-semibold text-secondary uppercase tracking-wide">
        {label}
      </span>
      <div className="flex gap-2 overflow-x-auto">
        {groups.map((group, gi) => (
          <div key={gi} className="flex gap-0.5">
            {group.map((bit, bi) => (
              <span
                key={bi}
                className={`flex h-6 w-5 items-center justify-center rounded text-xs font-mono ${
                  dim ? "bg-white border border-card-border text-secondary" : "bg-accent text-white"
                }`}
              >
                {bit}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ANDOperationSimulator() {
  const [ipStr, setIpStr] = useState("144.16.72.57");
  const [maskStr, setMaskStr] = useState("255.255.0.0");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function update(setter: (v: string) => void, value: string) {
    setter(value);
    markInteracted();
  }

  const ipOctets = parseIp(ipStr);
  const maskOctets = parseIp(maskStr);
  const ipInt = ipOctets ? octetsToUint32(ipOctets) : null;
  const maskInt = maskOctets ? octetsToUint32(maskOctets) : null;
  const maskPrefix = maskInt !== null ? maskUint32ToPrefix(maskInt) : null;
  const resultInt = ipInt !== null && maskInt !== null ? (ipInt & maskInt) >>> 0 : null;
  const resultDotted = resultInt !== null ? uint32ToOctets(resultInt) : null;

  return (
    <div className="space-y-4">
      <ExplainerBox>
        <p>
          To find which network an address belongs to, the computer lines up the address and the
          mask as binary, bit-by-bit, and applies the logical AND rule: a result bit is 1 only if{" "}
          <em>both</em> bits above it are 1. Every bit under a mask&rsquo;s 1s survives unchanged;
          every bit under a mask&rsquo;s 0s gets zeroed out. What&rsquo;s left is the network
          address — the &ldquo;street name&rdquo; with the &ldquo;house number&rdquo; part wiped
          to zero.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="and-ip" className="text-sm font-medium text-heading">
            IP address
          </label>
          <input
            id="and-ip"
            value={ipStr}
            onChange={(e) => update(setIpStr, e.target.value)}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-44 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="and-mask" className="text-sm font-medium text-heading">
            Mask
          </label>
          <input
            id="and-mask"
            value={maskStr}
            onChange={(e) => update(setMaskStr, e.target.value)}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-44 font-mono"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            update(setIpStr, "144.16.72.57");
            update(setMaskStr, "255.255.192.0");
          }}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Try the custom-mask example
        </button>
      </div>

      {!ipOctets || !maskOctets || maskPrefix === null ? (
        <p className="text-sm text-error">
          Enter a valid IPv4 address and a valid contiguous mask (like 255.255.192.0).
        </p>
      ) : (
        <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-2 overflow-x-auto">
          <BitsRow label="IP" bits={bitsArray(ipInt!)} />
          <BitsRow label="AND mask" bits={bitsArray(maskInt!)} dim />
          <div className="border-t border-card-border my-1" />
          <BitsRow label="Network" bits={bitsArray(resultInt!)} />
          <p className="text-sm text-body pt-2">
            <span className="font-mono">{ipStr}</span> AND{" "}
            <span className="font-mono">{maskStr}</span> (/{maskPrefix}) ={" "}
            <span className="font-mono font-semibold text-heading">
              {resultDotted && `${resultDotted.o1}.${resultDotted.o2}.${resultDotted.o3}.${resultDotted.o4}`}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
