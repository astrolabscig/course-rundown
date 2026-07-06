"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import {
  parseIp,
  ipToBinary,
  classify,
  isPrivate,
  isLoopback,
  isBroadcast,
  isThisNetwork,
  DEFAULT_PREFIX_BY_CLASS,
  prefixToMaskUint32,
  uint32ToDotted,
  type IPClass,
} from "@/lib/networking/ipMath";
import { trackInteract } from "@/lib/track";

const classRanges: Record<IPClass, string> = {
  A: "0–127",
  B: "128–191",
  C: "192–223",
  D: "224–239 (multicast)",
  E: "240–255 (experimental)",
};

const examples = ["10.0.0.20", "144.16.72.57", "192.203.17.5", "127.0.0.1", "192.168.1.10"];

export default function IPClassifier() {
  const [input, setInput] = useState("144.16.72.57");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const octets = parseIp(input);

  return (
    <div className="space-y-4">
      <ExplainerBox title="What is an IPv4 address?">
        <p>
          Every device online needs its own address, the same way every house needs a postal
          address. An IPv4 address is just 4 numbers (0–255 each) written like{" "}
          <span className="font-mono">144.16.72.57</span> — but underneath, the computer sees it
          as 32 ones and zeros. The first part of those bits names the network (the
          &ldquo;street&rdquo;); the rest names the specific device on it (the &ldquo;house
          number&rdquo;).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="ip-classifier-input" className="text-sm font-medium text-heading">
            IPv4 address
          </label>
          <input
            id="ip-classifier-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              markInteracted();
            }}
            placeholder="144.16.72.57"
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-48 font-mono"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setInput(ex);
                markInteracted();
              }}
              className="px-3 py-1.5 rounded-full border border-card-border text-xs font-mono text-body hover:border-accent transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {!octets ? (
        <p className="text-sm text-error">
          Enter a valid IPv4 address: four numbers 0–255 separated by dots.
        </p>
      ) : (
        (() => {
          const ipClass = classify(octets.o1);
          const defaultPrefix = DEFAULT_PREFIX_BY_CLASS[ipClass];
          const binary = ipToBinary(octets);
          const binaryOctets = binary.split(".");
          const special = isLoopback(octets)
            ? "Loopback address (127.x.x.x) — always refers to \"this same device.\""
            : isBroadcast(octets)
            ? "The limited broadcast address — reaches every device on the local network."
            : isThisNetwork(octets)
            ? "\"This network\" address (0.0.0.0) — a placeholder, not a real host address."
            : isPrivate(octets)
            ? "A private address — reserved for internal networks, not routed on the public Internet."
            : null;

          return (
            <div className="space-y-4">
              <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {binaryOctets.map((oct, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`rounded-md px-2 py-1 font-mono text-sm ${
                          defaultPrefix !== null && i * 8 < defaultPrefix
                            ? "bg-accent text-white"
                            : "bg-white border border-card-border text-body"
                        }`}
                      >
                        {oct}
                      </div>
                      <div className="text-xs text-secondary mt-0.5">
                        {[octets.o1, octets.o2, octets.o3, octets.o4][i]}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-secondary">
                  {defaultPrefix !== null ? (
                    <>
                      <span className="text-accent font-semibold">Blue</span> bits = network
                      portion (default /{defaultPrefix} for class {ipClass}).{" "}
                      <span className="font-semibold">White</span> bits = host portion.
                    </>
                  ) : (
                    "Class D/E addresses aren't split into network/host portions — they're reserved for multicast or experimental use."
                  )}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                    Class
                  </div>
                  <div className="text-heading font-semibold">
                    Class {ipClass}{" "}
                    <span className="text-secondary font-normal text-sm">
                      (first octet {classRanges[ipClass]})
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                    Default mask
                  </div>
                  <div className="text-heading font-semibold font-mono">
                    {defaultPrefix !== null
                      ? `${uint32ToDotted(prefixToMaskUint32(defaultPrefix))} (/${defaultPrefix})`
                      : "n/a"}
                  </div>
                </div>
              </div>

              {special && (
                <div className="rounded-xl bg-accent-warm-bg p-4 text-sm text-heading">
                  {special}
                </div>
              )}
            </div>
          );
        })()
      )}
    </div>
  );
}
