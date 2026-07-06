"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { parseIp, octetsToUint32, uint32ToDotted, calculateSubnet } from "@/lib/networking/ipMath";
import { trackInteract } from "@/lib/track";

export default function CIDRCalculator() {
  const [ipStr, setIpStr] = useState("144.16.192.24");
  const [prefixStr, setPrefixStr] = useState("29");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const octets = parseIp(ipStr);
  const prefixNum = Number(prefixStr);
  const validPrefix = Number.isInteger(prefixNum) && prefixNum >= 0 && prefixNum <= 32;
  const result = octets && validPrefix ? calculateSubnet(octets, prefixNum) : null;
  const enteredInt = octets ? octetsToUint32(octets) : null;
  const isAlignedStart = result && enteredInt !== null ? enteredInt === result.networkUint32 : null;

  return (
    <div className="space-y-4">
      <ExplainerBox title="What does /29 actually mean?">
        <p>
          CIDR notation (Classless Inter-Domain Routing) writes an address as{" "}
          <span className="font-mono">address/prefix</span>, where the prefix is simply how many
          leftmost bits count as the network part — no more class A/B/C boxes to squeeze into. Two
          rules always apply: the block&rsquo;s size must be a power of 2 (2^(32 − prefix)
          addresses), and the block&rsquo;s starting address must be a multiple of that size — you
          can&rsquo;t start a 16-address block just anywhere.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="cidr-ip" className="text-sm font-medium text-heading">
            Address
          </label>
          <input
            id="cidr-ip"
            value={ipStr}
            onChange={(e) => {
              setIpStr(e.target.value);
              markInteracted();
            }}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-44 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cidr-prefix" className="text-sm font-medium text-heading">
            Prefix
          </label>
          <div className="flex items-center gap-1">
            <span className="font-mono text-body">/</span>
            <input
              id="cidr-prefix"
              value={prefixStr}
              onChange={(e) => {
                setPrefixStr(e.target.value);
                markInteracted();
              }}
              className="rounded-full border border-card-border px-3 py-1.5 text-sm w-16 font-mono"
            />
          </div>
        </div>
      </div>

      {!octets || !validPrefix ? (
        <p className="text-sm text-error">Enter a valid IPv4 address and a prefix between 0 and 32.</p>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
              Block size
            </div>
            <div className="font-mono font-semibold text-heading">
              2^{result!.hostBits} = {result!.totalAddresses} addresses
            </div>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
              Range
            </div>
            <div className="font-mono font-semibold text-heading">
              {uint32ToDotted(result!.networkUint32)} – {uint32ToDotted(result!.broadcastUint32)}
            </div>
          </div>

          {isAlignedStart === false && (
            <div className="rounded-xl bg-error-bg border-l-4 border-error p-4 text-sm text-error">
              <span className="font-mono">{ipStr}</span> is <strong>not</strong> a valid block
              start for a {result!.totalAddresses}-address block — it isn&rsquo;t a multiple of{" "}
              {result!.totalAddresses}. The block that actually contains it starts at{" "}
              <span className="font-mono">{uint32ToDotted(result!.networkUint32)}</span>.
            </div>
          )}
          {isAlignedStart === true && (
            <div className="rounded-xl bg-accent-warm-bg p-4 text-sm text-heading">
              <span className="font-mono">{ipStr}</span> is a valid start for a{" "}
              {result!.totalAddresses}-address block — good, it&rsquo;s divisible by the block size.
            </div>
          )}

          <div className="rounded-xl bg-muted p-4 text-sm text-body">
            Reminder from the rule: a 16-address block cannot start at{" "}
            <span className="font-mono">144.16.223.36</span> (36 isn&rsquo;t divisible by 16), but{" "}
            <span className="font-mono">144.16.192.64</span> works fine (64 ÷ 16 = 4, no remainder).
          </div>
        </div>
      )}
    </div>
  );
}
