"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import {
  parseIp,
  octetsToUint32,
  uint32ToDotted,
  classify,
  DEFAULT_PREFIX_BY_CLASS,
} from "@/lib/networking/ipMath";
import { trackInteract } from "@/lib/track";

export default function FLSMLab() {
  const [baseIp, setBaseIp] = useState("192.168.10.0");
  const [requiredSubnets, setRequiredSubnets] = useState(4);
  const [requiredHosts, setRequiredHosts] = useState(20);
  const [prefixInput, setPrefixInput] = useState("26");
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [subnetList, setSubnetList] = useState<string[] | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function check() {
    markInteracted();
    setSubnetList(null);
    const octets = parseIp(baseIp);
    const prefix = Number(prefixInput);
    if (!octets || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
      setFeedback({ ok: false, message: "Enter a valid base network address and a prefix between 0 and 32." });
      return;
    }

    const ipClass = classify(octets.o1);
    const defaultPrefix = DEFAULT_PREFIX_BY_CLASS[ipClass];
    if (defaultPrefix === null) {
      setFeedback({ ok: false, message: `Class ${ipClass} addresses aren't normally subnetted this way — try a class A, B, or C base network.` });
      return;
    }
    if (prefix < defaultPrefix) {
      setFeedback({
        ok: false,
        message: `/${prefix} is actually LARGER than the whole class ${ipClass} network (default /${defaultPrefix}) — you'd need to borrow bits, not give them back. Try a prefix greater than /${defaultPrefix}.`,
      });
      return;
    }

    const hostBits = 32 - prefix;
    const hostsPerSubnet = Math.pow(2, hostBits) - 2;
    const borrowedBits = prefix - defaultPrefix;
    const subnetsCreated = Math.pow(2, borrowedBits);

    if (subnetsCreated < requiredSubnets) {
      setFeedback({
        ok: false,
        message: `/${prefix} only creates ${subnetsCreated} subnet${subnetsCreated === 1 ? "" : "s"}, but you need at least ${requiredSubnets}. Hint: each extra bit you borrow DOUBLES the number of subnets — try borrowing one more bit.`,
      });
      return;
    }
    if (hostsPerSubnet < requiredHosts) {
      setFeedback({
        ok: false,
        message: `/${prefix} only leaves ${hostsPerSubnet} usable hosts per subnet, but you need at least ${requiredHosts}. Hint: borrowing fewer bits leaves more host bits — try a slightly smaller prefix (a smaller /number).`,
      });
      return;
    }

    // Success — build the list of resulting subnets
    const blockSize = Math.pow(2, hostBits);
    const base = octetsToUint32(octets);
    const list: string[] = [];
    for (let i = 0; i < Math.min(subnetsCreated, 8); i++) {
      const start = (base + i * blockSize) >>> 0;
      const end = (start + blockSize - 1) >>> 0;
      list.push(`${uint32ToDotted(start)} – ${uint32ToDotted(end)}`);
    }
    setSubnetList(list);
    setFeedback({
      ok: true,
      message: `/${prefix} works: it creates ${subnetsCreated} equal-sized subnets of ${hostsPerSubnet} usable hosts each — enough for your ${requiredSubnets} subnets of ${requiredHosts}+ hosts.`,
    });
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="FLSM vs VLSM — what's the difference?">
        <p>
          FLSM (Fixed Length Subnet Mask) uses the SAME mask for every subnet — simple, but every
          subnet ends up the same size whether it needs 5 hosts or 500. It's the right tool when
          your departments all need roughly similar numbers of hosts; when they don't, that's
          exactly when VLSM (varying the mask per subnet) avoids wasting addresses.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="flsm-base" className="text-sm font-medium text-heading">
            Base network
          </label>
          <input
            id="flsm-base"
            value={baseIp}
            onChange={(e) => {
              setBaseIp(e.target.value);
              setFeedback(null);
            }}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-40 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="flsm-subnets" className="text-sm font-medium text-heading">
            Subnets needed
          </label>
          <input
            id="flsm-subnets"
            type="number"
            value={requiredSubnets}
            onChange={(e) => {
              setRequiredSubnets(Number(e.target.value));
              setFeedback(null);
            }}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-24 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="flsm-hosts" className="text-sm font-medium text-heading">
            Hosts needed per subnet
          </label>
          <input
            id="flsm-hosts"
            type="number"
            value={requiredHosts}
            onChange={(e) => {
              setRequiredHosts(Number(e.target.value));
              setFeedback(null);
            }}
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-24 font-mono"
          />
        </div>
      </div>

      <p className="text-sm text-body">
        Pick a prefix that satisfies both requirements above with ONE fixed mask:
      </p>
      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="flsm-prefix" className="text-sm font-medium text-heading">
            Your prefix
          </label>
          <div className="flex items-center gap-1">
            <span className="font-mono text-body">/</span>
            <input
              id="flsm-prefix"
              value={prefixInput}
              onChange={(e) => setPrefixInput(e.target.value)}
              className="rounded-full border border-card-border px-3 py-1.5 text-sm w-16 font-mono"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={check}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Check my answer
        </button>
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-4 text-sm ${
            feedback.ok ? "bg-accent-warm-bg text-heading" : "bg-error-bg border-l-4 border-error text-error"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {subnetList && (
        <div className="rounded-xl bg-muted p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">
            Resulting subnets{subnetList.length === 8 ? " (first 8 shown)" : ""}
          </p>
          <ul className="space-y-1 font-mono text-sm text-body">
            {subnetList.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
