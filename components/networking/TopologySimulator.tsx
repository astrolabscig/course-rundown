"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type Topology = "bus" | "star" | "ring";
type FailureMode = "none" | "shared" | "single";

const sharedLabel: Record<Topology, string> = {
  bus: "the backbone cable",
  star: "the central switch",
  ring: "one link in the ring",
};

const deviceLabel = "PC3's own connection";

function Device({ name, dead }: { name: string; dead: boolean }) {
  return (
    <div
      className={`rounded-xl border-2 px-3 py-2 text-xs font-mono font-semibold text-center transition-colors ${
        dead ? "border-error bg-error-bg text-error line-through" : "border-accent bg-card text-heading"
      }`}
    >
      {name}
    </div>
  );
}

function BusLayout({ deadDevices, backboneDown }: { deadDevices: Set<string>; backboneDown: boolean }) {
  const names = ["PC1", "PC2", "PC3", "PC4"];
  return (
    <div className="space-y-3">
      <div className="flex justify-around">
        {names.map((n) => (
          <Device key={n} name={n} dead={backboneDown || deadDevices.has(n)} />
        ))}
      </div>
      <div className="flex justify-around">
        {names.map((n) => (
          <div key={n} className={`w-px h-4 mx-auto ${backboneDown ? "bg-error" : deadDevices.has(n) ? "bg-error" : "bg-accent"}`} />
        ))}
      </div>
      <div className={`h-2 rounded-full ${backboneDown ? "bg-error" : "bg-accent"}`} />
      <p className="text-center text-xs text-secondary">Backbone{backboneDown && " — FAILED"}</p>
    </div>
  );
}

function StarLayout({ deadDevices, switchDown }: { deadDevices: Set<string>; switchDown: boolean }) {
  const names = ["PC1", "PC2", "PC3", "PC4"];
  return (
    <div className="grid grid-cols-3 items-center gap-3 max-w-sm mx-auto">
      <Device name={names[0]} dead={switchDown || deadDevices.has(names[0])} />
      <div />
      <Device name={names[1]} dead={switchDown || deadDevices.has(names[1])} />
      <div />
      <div
        className={`rounded-xl border-2 px-3 py-3 text-xs font-mono font-bold text-center ${
          switchDown ? "border-error bg-error-bg text-error line-through" : "border-accent-warm bg-card text-heading"
        }`}
      >
        SWITCH
      </div>
      <div />
      <Device name={names[2]} dead={switchDown || deadDevices.has(names[2])} />
      <div />
      <Device name={names[3]} dead={switchDown || deadDevices.has(names[3])} />
    </div>
  );
}

function RingLayout({ deadDevices, linkDown }: { deadDevices: Set<string>; linkDown: boolean }) {
  const names = ["PC1", "PC2", "PC3", "PC4"];
  return (
    <div className="grid grid-cols-2 gap-x-16 gap-y-3 max-w-xs mx-auto">
      <Device name={names[0]} dead={deadDevices.has(names[0])} />
      <Device name={names[1]} dead={deadDevices.has(names[1])} />
      <Device name={names[3]} dead={deadDevices.has(names[3])} />
      <Device name={names[2]} dead={deadDevices.has(names[2])} />
      <div className="col-span-2 text-center text-xs text-secondary -mt-1">
        {linkDown ? (
          <span className="text-error font-semibold">Ring broken — one link has failed</span>
        ) : (
          <span>Ring intact — every device connects to two neighbours</span>
        )}
      </div>
    </div>
  );
}

export default function TopologySimulator() {
  const [topology, setTopology] = useState<Topology>("star");
  const [failure, setFailure] = useState<FailureMode>("none");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function pick(t: Topology) {
    setTopology(t);
    setFailure("none");
    markInteracted();
  }

  function fail(f: FailureMode) {
    setFailure(f);
    markInteracted();
  }

  const deadDevices = failure === "single" ? new Set(["PC3"]) : new Set<string>();
  const sharedDown = failure === "shared";

  return (
    <div className="space-y-4">
      <ExplainerBox title="The exam question this simulator answers">
        {"\"Think about it: what would happen if the switch failed? What if one computer's cable failed?\" — this is exactly that, for all three topologies."}
      </ExplainerBox>

      <div className="flex gap-2">
        {(["bus", "star", "ring"] as Topology[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => pick(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
              topology === t ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-5 sm:p-8">
        {topology === "bus" && <BusLayout deadDevices={deadDevices} backboneDown={sharedDown} />}
        {topology === "star" && <StarLayout deadDevices={deadDevices} switchDown={sharedDown} />}
        {topology === "ring" && <RingLayout deadDevices={deadDevices} linkDown={sharedDown} />}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fail("none")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            failure === "none" ? "border-success bg-success/10 text-success" : "border-card-border text-body hover:border-accent"
          }`}
        >
          Everything working
        </button>
        <button
          type="button"
          onClick={() => fail("single")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            failure === "single" ? "border-error bg-error-bg text-error" : "border-card-border text-body hover:border-accent"
          }`}
        >
          Fail {deviceLabel}
        </button>
        <button
          type="button"
          onClick={() => fail("shared")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            failure === "shared" ? "border-error bg-error-bg text-error" : "border-card-border text-body hover:border-accent"
          }`}
        >
          Fail {sharedLabel[topology]}
        </button>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4 text-sm text-body">
        {failure === "none" && "All devices are connected and can communicate normally."}
        {failure === "single" && topology === "bus" && (
          <>PC3&rsquo;s own drop cable failed — PC3 loses connectivity, but PC1, PC2, and PC4 are completely unaffected; the shared backbone is still fine.</>
        )}
        {failure === "single" && topology === "star" && (
          <>PC3&rsquo;s own cable to the switch failed — PC3 loses connectivity, but PC1, PC2, and PC4 keep working normally through the switch.</>
        )}
        {failure === "single" && topology === "ring" && (
          <>PC3 itself has failed — in a simple ring, this breaks the loop exactly like a link failure would, since PC3 was part of every path around the circle.</>
        )}
        {failure === "shared" && topology === "bus" && (
          <>The backbone itself failed — <strong className="text-heading">every device loses connectivity</strong>, because the backbone is the single shared path all of them depend on. This is the bus topology&rsquo;s defining weakness.</>
        )}
        {failure === "shared" && topology === "star" && (
          <>The central switch failed — <strong className="text-heading">every device loses connectivity</strong>, even though every individual cable is perfectly fine. This is exactly why the star topology&rsquo;s important failure point is the central device.</>
        )}
        {failure === "shared" && topology === "ring" && (
          <>One link in the ring failed — the loop is now broken. Depending on the specific ring technology, this can disrupt communication for the network, which is why simple ring networks are considered less fault-tolerant for a single break than a star topology is for a single cable fault.</>
        )}
      </div>
    </div>
  );
}
