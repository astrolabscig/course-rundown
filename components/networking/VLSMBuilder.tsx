"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { parseIp, octetsToUint32, uint32ToDotted, prefixToMaskUint32 } from "@/lib/networking/ipMath";
import { trackInteract } from "@/lib/track";

interface Department {
  name: string;
  hosts: number;
}

interface Allocation {
  name: string;
  hostsNeeded: number;
  prefix: number;
  blockSize: number;
  usableHosts: number;
  networkStart: number;
  networkEnd: number;
}

function hostBitsNeeded(hostsNeeded: number): number {
  let h = 0;
  while (Math.pow(2, h) - 2 < hostsNeeded) h++;
  return h;
}

function solveVLSM(baseStart: number, baseSize: number, depts: Department[]): Allocation[] | null {
  const sorted = [...depts].sort((a, b) => b.hosts - a.hosts);
  let pointer = baseStart;
  const allocations: Allocation[] = [];

  for (const dept of sorted) {
    const hostBits = hostBitsNeeded(dept.hosts);
    const blockSize = Math.pow(2, hostBits);
    const aligned = Math.ceil(pointer / blockSize) * blockSize;
    const end = aligned + blockSize - 1;
    if (end > baseStart + baseSize - 1) return null; // doesn't fit
    allocations.push({
      name: dept.name,
      hostsNeeded: dept.hosts,
      prefix: 32 - hostBits,
      blockSize,
      usableHosts: blockSize - 2,
      networkStart: aligned,
      networkEnd: end,
    });
    pointer = aligned + blockSize;
  }

  return allocations;
}

const subnetOptionsTable = [
  { x: 128, binary: "1000 0000", subnets: 2, hosts: 126 },
  { x: 192, binary: "1100 0000", subnets: 4, hosts: 62 },
  { x: 224, binary: "1110 0000", subnets: 8, hosts: 30 },
  { x: 240, binary: "1111 0000", subnets: 16, hosts: 14 },
  { x: 248, binary: "1111 1000", subnets: 32, hosts: 6 },
  { x: 252, binary: "1111 1100", subnets: 64, hosts: 2 },
];

export default function VLSMBuilder() {
  const [baseIp, setBaseIp] = useState("192.203.17.0");
  const [depts, setDepts] = useState<Department[]>([
    { name: "D1", hosts: 110 },
    { name: "D2", hosts: 45 },
    { name: "D3", hosts: 50 },
  ]);
  const [solved, setSolved] = useState(false);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function updateHosts(index: number, value: string) {
    const n = Number(value);
    setDepts((prev) => prev.map((d, i) => (i === index ? { ...d, hosts: Number.isNaN(n) ? 0 : n } : d)));
    setSolved(false);
  }

  function solve() {
    setSolved(true);
    markInteracted();
  }

  const baseOctets = parseIp(baseIp);
  const baseStart = baseOctets ? octetsToUint32(baseOctets) : null;
  const baseSize = 256; // treating the base as a /24, matching the slide's Class C example
  const allocations = solved && baseStart !== null ? solveVLSM(baseStart, baseSize, depts) : null;

  return (
    <div className="space-y-6">
      <ExplainerBox title="Why not just use one fixed mask for everyone?">
        <p>
          A single subnet mask forces every subnet in a network to be the exact same size — but
          real departments rarely need the same number of hosts. VLSM (Variable Length Subnet
          Masking) lets the <em>same</em> base network be split into subnets of{" "}
          <em>different</em> sizes, so a 110-host department and a 45-host department don&rsquo;t
          have to waste address space matching each other.
        </p>
      </ExplainerBox>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Step 1 — why one fixed mask can&rsquo;t work here
        </h4>
        <p className="text-sm text-body">
          Suppose we&rsquo;re assigned class C network <span className="font-mono">192.203.17.0</span>{" "}
          and need 3 subnets with 110, 45, and 50 hosts. Trying every possible single mask
          (255.255.255.X):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 text-heading font-semibold border-b border-card-border">X</th>
                <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Binary</th>
                <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Subnets</th>
                <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Usable hosts</th>
              </tr>
            </thead>
            <tbody>
              {subnetOptionsTable.map((row) => (
                <tr key={row.x} className="border-b border-card-border last:border-0">
                  <td className="p-2 font-mono">{row.x}</td>
                  <td className="p-2 font-mono">{row.binary}</td>
                  <td className="p-2">{row.subnets}</td>
                  <td className="p-2">{row.hosts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-error">
          None of these give both ≥3 usable-sized subnets and a subnet big enough for 110 hosts at
          the same time — a single fixed mask cannot satisfy (110, 45, 50). That&rsquo;s exactly
          why VLSM exists.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Step 2 — solve it with VLSM</h4>
        <p className="text-sm text-body">
          Try this: change the base network or the host requirements below, then click Solve. The
          rule: always carve out the <em>biggest</em> requirement first, using the smallest block
          that fits it, then repeat on what&rsquo;s left.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="vlsm-base" className="text-sm font-medium text-heading">
              Base network (/24)
            </label>
            <input
              id="vlsm-base"
              value={baseIp}
              onChange={(e) => {
                setBaseIp(e.target.value);
                setSolved(false);
              }}
              className="rounded-full border border-card-border px-3 py-1.5 text-sm w-40 font-mono"
            />
          </div>
          {depts.map((d, i) => (
            <div key={d.name} className="flex flex-col gap-1">
              <label htmlFor={`vlsm-dept-${i}`} className="text-sm font-medium text-heading">
                {d.name} hosts needed
              </label>
              <input
                id={`vlsm-dept-${i}`}
                type="number"
                value={d.hosts}
                onChange={(e) => updateHosts(i, e.target.value)}
                className="rounded-full border border-card-border px-3 py-1.5 text-sm w-24 font-mono"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={solve}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Solve
          </button>
        </div>

        {solved && (
          <div className="space-y-3">
            {!baseOctets ? (
              <p className="text-sm text-error">Enter a valid base network address.</p>
            ) : allocations === null ? (
              <p className="text-sm text-error">
                These requirements don&rsquo;t fit inside a single /24 — try smaller numbers.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Dept</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Needed</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Block</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Mask</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Usable range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((a) => (
                      <tr key={a.name} className="border-b border-card-border last:border-0">
                        <td className="p-2 font-semibold text-heading">{a.name}</td>
                        <td className="p-2">{a.hostsNeeded}</td>
                        <td className="p-2 font-mono">
                          {uint32ToDotted(a.networkStart)}/{a.prefix} ({a.usableHosts} usable)
                        </td>
                        <td className="p-2 font-mono">{uint32ToDotted(prefixToMaskUint32(a.prefix))}</td>
                        <td className="p-2 font-mono">
                          {uint32ToDotted(a.networkStart + 1)} – {uint32ToDotted(a.networkEnd - 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
