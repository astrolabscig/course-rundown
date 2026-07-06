"use client";

import { useRef, useState } from "react";
import {
  parseIp,
  calculateSubnet,
  uint32ToDotted,
  classify,
  DEFAULT_PREFIX_BY_CLASS,
} from "@/lib/networking/ipMath";
import { subnettingScenarios } from "@/lib/networking/subnettingDrills";
import { trackInteract } from "@/lib/track";

export default function SubnettingDrill() {
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [hinted, setHinted] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function showHint(id: string) {
    setHinted((prev) => ({ ...prev, [id]: true }));
    markInteracted();
  }

  function reveal(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: true }));
    markInteracted();
  }

  return (
    <div className="space-y-6">
      {subnettingScenarios.map((scenario, i) => {
        const octets = parseIp(scenario.ip);
        const result = octets ? calculateSubnet(octets, scenario.prefix) : null;
        const ipClass = octets ? classify(octets.o1) : null;
        const defaultPrefix = ipClass ? DEFAULT_PREFIX_BY_CLASS[ipClass] : null;
        const bitsBorrowed =
          result && defaultPrefix !== null && result.prefix > defaultPrefix
            ? result.prefix - defaultPrefix
            : 0;
        const isRevealed = revealed[scenario.id] ?? false;
        const isHinted = hinted[scenario.id] ?? false;
        const hostBits = result ? result.hostBits : null;

        return (
          <div key={scenario.id} className="rounded-xl border border-card-border bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-heading">Scenario {i + 1}</p>
            <p className="text-sm text-body">{scenario.prompt}</p>
            <p className="text-xs font-mono text-secondary">
              {scenario.ip} /{scenario.prefix}
            </p>

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor={`predict-${scenario.id}`} className="text-sm font-medium text-heading">
                  Your working / answer
                </label>
                <input
                  id={`predict-${scenario.id}`}
                  value={predictions[scenario.id] ?? ""}
                  onChange={(e) =>
                    setPredictions((prev) => ({ ...prev, [scenario.id]: e.target.value }))
                  }
                  placeholder="Write your answer, then reveal to check"
                  className="rounded-full border border-card-border px-3 py-1.5 text-sm w-72"
                />
              </div>
              <button
                type="button"
                onClick={() => showHint(scenario.id)}
                className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
              >
                Get a hint
              </button>
              <button
                type="button"
                onClick={() => reveal(scenario.id)}
                className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Reveal worked answer
              </button>
            </div>

            {isHinted && !isRevealed && hostBits !== null && (
              <div className="rounded-xl bg-accent-warm-bg p-4 text-sm text-heading">
                Hint: /{scenario.prefix} leaves {hostBits} host bit{hostBits === 1 ? "" : "s"} —
                that's 2^{hostBits} = {Math.pow(2, hostBits)} total addresses in this block.
                Convert the IP's last relevant octet to binary, AND it against the mask to find
                the network address, then the broadcast address is the same network with every
                host bit flipped to 1.
              </div>
            )}

            {isRevealed && result && (
              <div className="rounded-xl bg-muted p-4 space-y-1.5 text-sm text-body">
                <p>
                  <span className="font-semibold text-heading">Network address:</span>{" "}
                  <span className="font-mono">{uint32ToDotted(result.networkUint32)}</span>
                </p>
                <p>
                  <span className="font-semibold text-heading">Broadcast address:</span>{" "}
                  <span className="font-mono">{uint32ToDotted(result.broadcastUint32)}</span>
                </p>
                <p>
                  <span className="font-semibold text-heading">Usable host range:</span>{" "}
                  <span className="font-mono">
                    {uint32ToDotted(result.firstUsableUint32)} – {uint32ToDotted(result.lastUsableUint32)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-heading">Total / usable addresses:</span>{" "}
                  {result.totalAddresses} total, {result.usableHosts} usable (2^{result.hostBits} − 2)
                </p>
                {ipClass && defaultPrefix !== null && (
                  <p>
                    <span className="font-semibold text-heading">Class & borrowing:</span> class{" "}
                    {ipClass} (default /{defaultPrefix}){" "}
                    {bitsBorrowed > 0
                      ? `— /${result.prefix} borrows ${bitsBorrowed} bit${bitsBorrowed === 1 ? "" : "s"}, creating ${Math.pow(2, bitsBorrowed)} subnets (2^${bitsBorrowed}).`
                      : "— no bits borrowed beyond the default."}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
