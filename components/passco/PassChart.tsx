// Small registry of hand-reconstructed figures referenced by Passco questions
// whose source PDF only embedded the figure as a raster image. Each is
// redrawn as SVG here, matching the app's usual chart style, rather than
// trying to inline a rasterized screenshot.

function ConsumptionFunctionSlopes() {
  return (
    <div className="rounded-2xl border border-card-border bg-muted p-4">
      <svg viewBox="0 0 100 65" className="w-full h-44">
        <line x1="8" y1="5" x2="8" y2="58" stroke="var(--card-border)" strokeWidth="0.6" />
        <line x1="8" y1="58" x2="95" y2="58" stroke="var(--card-border)" strokeWidth="0.6" />
        <text x="0" y="10" fontSize="4" fill="var(--secondary)">Demand</text>
        <text x="70" y="63" fontSize="4" fill="var(--secondary)">Output, y</text>

        {/* C1 and C3 share the same slope (parallel) -- verified by pixel-measuring the source image */}
        <line x1="8" y1="45" x2="70" y2="25" stroke="var(--accent)" strokeWidth="1.2" />
        <text x="71" y="26" fontSize="4.5" fill="var(--accent)">C1</text>

        <line x1="8" y1="32" x2="70" y2="12" stroke="var(--accent-warm)" strokeWidth="1.2" />
        <text x="71" y="12" fontSize="4.5" fill="var(--accent-warm)">C3</text>

        {/* C2: measurably steeper slope than C1/C3, dashed, shares C1's starting point */}
        <line x1="8" y1="45" x2="70" y2="9" stroke="var(--secondary)" strokeWidth="1" strokeDasharray="2,1.5" />
        <text x="71" y="9" fontSize="4.5" fill="var(--secondary)">C2</text>
      </svg>
      <p className="text-center text-xs text-secondary">
        C1 and C3 are parallel (same slope, different intercept — a pure shift in autonomous consumption).
        C2 has a visibly steeper slope than both.
      </p>
    </div>
  );
}

function KeynesianCrossInvestmentChange() {
  return (
    <div className="rounded-2xl border border-card-border bg-muted p-4">
      <svg viewBox="0 0 100 70" className="w-full h-48">
        <line x1="8" y1="5" x2="8" y2="62" stroke="var(--card-border)" strokeWidth="0.6" />
        <line x1="8" y1="62" x2="95" y2="62" stroke="var(--card-border)" strokeWidth="0.6" />
        <text x="0" y="10" fontSize="4" fill="var(--secondary)">Demand</text>
        <text x="82" y="67" fontSize="4" fill="var(--secondary)">Output, Y</text>

        {/* 45-degree line */}
        <line x1="8" y1="62" x2="70" y2="0" stroke="var(--card-border)" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
        <text x="55" y="18" fontSize="4" fill="var(--secondary)">45°</text>

        {/* Original AE line: C + I */}
        <line x1="8" y1="45" x2="80" y2="10" stroke="var(--accent)" strokeWidth="1.2" />
        <text x="81" y="10" fontSize="4" fill="var(--accent)">C + I</text>

        {/* New AE line: C + I' (parallel, shifted up by delta-I) */}
        <line x1="8" y1="33" x2="80" y2="-2" stroke="var(--accent-warm)" strokeWidth="1.2" />
        <text x="81" y="2" fontSize="4" fill="var(--accent-warm)">C + I&apos;</text>

        {/* Point A on original AE line, Point B directly above on new AE line -- same income level */}
        <circle cx="35" cy="31.7" r="1.3" fill="var(--heading)" />
        <text x="30" y="29" fontSize="4" fill="var(--heading)">A</text>
        <circle cx="35" cy="19.7" r="1.3" fill="var(--heading)" />
        <text x="30" y="18" fontSize="4" fill="var(--heading)">B</text>
        <line x1="35" y1="31.7" x2="35" y2="19.7" stroke="var(--error)" strokeWidth="1" />
      </svg>
      <p className="text-center text-xs text-secondary">
        Standard reconstruction (the source PDF&apos;s original image is corrupted beyond recovery).
        A and B mark the vertical distance between the old and new AE lines at the same income
        level — exactly the size of the investment increase, before any multiplier effect unfolds.
      </p>
    </div>
  );
}

const registry: Record<string, () => React.JSX.Element> = {
  "consumption-function-slopes": ConsumptionFunctionSlopes,
  "keynesian-cross-investment-change": KeynesianCrossInvestmentChange,
};

export default function PassChart({ id }: { id: string }) {
  const Chart = registry[id];
  if (!Chart) return null;
  return <Chart />;
}
