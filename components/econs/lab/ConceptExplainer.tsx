"use client";

export type ExplainerTopic =
  | "recovery"
  | "expansion"
  | "peak"
  | "recession"
  | "trough"
  | "inflationary-gap"
  | "recessionary-gap";

interface TopicContent {
  title: string;
  icon: string;
  beginner: string;
  advanced: string;
  policy: string[];
}

const content: Record<ExplainerTopic, TopicContent> = {
  recovery: {
    title: "Recovery",
    icon: "🚀",
    beginner:
      "The economy is just starting to bounce back after a rough patch — output is rising again, but it hasn't fully caught up yet. Confidence is cautiously returning.",
    advanced:
      "Early-cycle recovery is typically driven by pent-up demand, inventory restocking, and often the loose monetary policy left over from the preceding downturn. Growth rates can look dramatic here simply because they're measured off a low base.",
    policy: [
      "Central banks often keep interest rates low a while longer to support the fragile recovery.",
      "Governments may extend stimulus spending rather than withdraw it too early.",
    ],
  },
  expansion: {
    title: "Expansion",
    icon: "📈",
    beginner:
      "Business is good and getting better — output, jobs, and spending are all climbing steadily. This is the 'boom' part of the cycle.",
    advanced:
      "Sustained expansion usually comes with falling unemployment, rising capacity utilization, and gradually building inflationary pressure as the economy approaches its potential output.",
    policy: [
      "Central banks watch closely for overheating and may start raising interest rates pre-emptively.",
      "Governments may begin easing off stimulus as the economy no longer needs the support.",
    ],
  },
  peak: {
    title: "Peak",
    icon: "🏔",
    beginner:
      "Output is about as high as it can get right now — growth is running out of steam because the economy is close to (or past) full capacity.",
    advanced:
      "At the peak, aggregate demand growth typically outpaces the economy's ability to expand supply, so inflationary pressure tends to be at its highest, often prompting tighter monetary policy.",
    policy: [
      "Central banks often raise interest rates to cool an overheating economy.",
      "This is usually the wrong time for further fiscal stimulus, since it can worsen inflation.",
    ],
  },
  recession: {
    title: "Recession",
    icon: "📉",
    beginner:
      "Output is falling — businesses are producing less, and often laying people off. This is the downturn phase of the cycle.",
    advanced:
      "A recession is commonly triggered by a demand shock (falling consumption or investment) or a tightening of monetary policy from the previous peak, and is reinforced by falling confidence and rising precautionary saving.",
    policy: [
      "Central banks typically cut interest rates to encourage borrowing and spending.",
      "Governments may increase spending or cut taxes to boost demand (expansionary fiscal policy).",
    ],
  },
  trough: {
    title: "Trough",
    icon: "🕳",
    beginner:
      "This is the bottom of the cycle — output is at its lowest point before starting to recover. It's often the most painful point for unemployment.",
    advanced:
      "The trough marks the turning point where contractionary forces are exhausted; inventories are depleted, pent-up demand builds, and the conditions for the next recovery start to form.",
    policy: [
      "This is typically when stimulus (monetary and fiscal) is most aggressively applied to kick-start a recovery.",
      "Confidence measures are watched closely for early signs of a turning point.",
    ],
  },
  "inflationary-gap": {
    title: "Inflationary Gap",
    icon: "🔥",
    beginner:
      "Actual output is running ABOVE the economy's sustainable potential — like an engine being pushed past its safe redline. This usually shows up as rising inflation.",
    advanced:
      "A positive (inflationary) output gap means aggregate demand exceeds the economy's productive capacity, putting upward pressure on prices and wages as firms compete for scarce resources and labor.",
    policy: [
      "Central banks typically respond by raising interest rates to cool demand.",
      "Contractionary fiscal policy (higher taxes, lower spending) can also help close the gap.",
    ],
  },
  "recessionary-gap": {
    title: "Recessionary Gap",
    icon: "🧊",
    beginner:
      "Actual output is running BELOW the economy's potential — resources (including workers) are sitting idle that could otherwise be productive.",
    advanced:
      "A negative (recessionary) output gap means aggregate demand is insufficient to fully employ the economy's resources, typically coinciding with higher unemployment and disinflationary pressure.",
    policy: [
      "Central banks typically cut interest rates to stimulate demand.",
      "Expansionary fiscal policy (higher spending, lower taxes) can help close the gap.",
    ],
  },
};

export default function ConceptExplainer({ topic, onClose }: { topic: ExplainerTopic; onClose: () => void }) {
  const c = content[topic];
  return (
    <div className="rounded-2xl border-2 border-accent bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-heading flex items-center gap-2">
          <span aria-hidden="true">{c.icon}</span> {c.title}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-medium text-secondary hover:text-accent transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">In plain English</p>
        <p className="text-sm text-body">{c.beginner}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">The deeper explanation</p>
        <p className="text-sm text-body">{c.advanced}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">How policymakers might respond</p>
        <ul className="list-disc list-inside space-y-1">
          {c.policy.map((p, i) => (
            <li key={i} className="text-sm text-body">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
