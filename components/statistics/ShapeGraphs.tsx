import ExplainerBox from "../ExplainerBox";

const W = 240;
const H = 150;
const left = 12;
const right = 228;
const bottom = 128;
const top = 14;

function toX(x: number, domainMin: number, domainMax: number) {
  return left + ((x - domainMin) / (domainMax - domainMin)) * (right - left);
}
function toY(y: number) {
  return bottom - y * (bottom - top);
}

function pathFrom(fn: (x: number) => number, domainMin: number, domainMax: number, step = 0.05) {
  const points: string[] = [];
  for (let x = domainMin; x <= domainMax; x += step) {
    points.push(`${toX(x, domainMin, domainMax).toFixed(1)},${toY(fn(x)).toFixed(1)}`);
  }
  return `M ${points.join(" L ")}`;
}

function normalPdf(z: number) {
  return Math.exp((-z * z) / 2);
}

function splitNormal(x: number, sigmaL: number, sigmaR: number) {
  const s = x < 0 ? sigmaL : sigmaR;
  return Math.exp((-x * x) / (2 * s * s));
}

function laplace(x: number) {
  return Math.exp(-Math.abs(x));
}

function biweight(x: number, a: number) {
  const u = x / a;
  return Math.abs(u) <= 1 ? Math.pow(1 - u * u, 2) : 0;
}

interface SkewPanel {
  id: string;
  title: string;
  badge: string;
  color: string;
  sigmaL: number;
  sigmaR: number;
  modeX: number;
  medianX: number;
  meanX: number;
  caption: string;
}

const skewPanels: SkewPanel[] = [
  {
    id: "shape-neg-skew",
    title: "Negative (left) skew",
    badge: "Mean < Median < Mode",
    color: "var(--accent-warm, #E07A3F)",
    sigmaL: 2.4,
    sigmaR: 1,
    modeX: 0,
    medianX: -0.7,
    meanX: -1.5,
    caption: "A long tail stretches left — a few very small values drag the mean below the median.",
  },
  {
    id: "shape-symmetric",
    title: "Symmetric (no skew)",
    badge: "Mean = Median = Mode",
    color: "var(--accent)",
    sigmaL: 1.5,
    sigmaR: 1.5,
    modeX: 0,
    medianX: 0,
    meanX: 0,
    caption: "No tail dominates either side — all three measures of central tendency coincide.",
  },
  {
    id: "shape-pos-skew",
    title: "Positive (right) skew",
    badge: "Mode < Median < Mean",
    color: "var(--success, #2E9E5B)",
    sigmaL: 1,
    sigmaR: 2.4,
    modeX: 0,
    medianX: 0.7,
    meanX: 1.5,
    caption: "A long tail stretches right — a few very large values drag the mean above the median.",
  },
];

interface KurtosisPanel {
  id: string;
  title: string;
  badge: string;
  color: string;
  fn: (x: number) => number;
  caption: string;
}

const kurtosisPanels: KurtosisPanel[] = [
  {
    id: "shape-platykurtic",
    title: "Platykurtic",
    badge: "kurtosis < 3",
    color: "var(--accent-warm, #E07A3F)",
    fn: (x) => biweight(x, 2.5),
    caption: "Flatter peak, thinner tails than normal — values are more evenly spread out, fewer extremes.",
  },
  {
    id: "shape-mesokurtic",
    title: "Mesokurtic",
    badge: "kurtosis ≈ 3",
    color: "var(--accent)",
    fn: (x) => normalPdf(x),
    caption: "The normal distribution itself — the baseline every other shape is compared against.",
  },
  {
    id: "shape-leptokurtic",
    title: "Leptokurtic",
    badge: "kurtosis > 3",
    color: "var(--success, #2E9E5B)",
    fn: (x) => laplace(x),
    caption: "Sharper peak, fatter tails than normal — values cluster tighter near the mean, but extremes are more common.",
  },
];

function SkewSvg({ panel }: { panel: SkewPanel }) {
  const domainMin = -5;
  const domainMax = 5;
  const path = pathFrom((x) => splitNormal(x, panel.sigmaL, panel.sigmaR), domainMin, domainMax);
  const markers = [
    { x: panel.modeX, label: "Mode", dy: 0 },
    { x: panel.medianX, label: "Median", dy: 12 },
    { x: panel.meanX, label: "Mean", dy: 24 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--secondary)" strokeWidth="1" />
      <path d={path} fill={panel.color} fillOpacity="0.12" stroke={panel.color} strokeWidth="2" />
      {markers.map((m) => (
        <line
          key={m.label}
          x1={toX(m.x, domainMin, domainMax)}
          y1={top}
          x2={toX(m.x, domainMin, domainMax)}
          y2={bottom}
          stroke="var(--heading)"
          strokeWidth="1"
          strokeDasharray="3,2"
          opacity="0.55"
        />
      ))}
      {markers.map((m) => (
        <text
          key={m.label}
          x={toX(m.x, domainMin, domainMax)}
          y={bottom + 14 + m.dy}
          textAnchor="middle"
          className="fill-secondary text-[8px] font-mono"
        >
          {m.label}
        </text>
      ))}
    </svg>
  );
}

function KurtosisSvg({ panel }: { panel: KurtosisPanel }) {
  const domainMin = -4;
  const domainMax = 4;
  const refPath = pathFrom((x) => normalPdf(x), domainMin, domainMax);
  const path = pathFrom(panel.fn, domainMin, domainMax);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--secondary)" strokeWidth="1" />
      {panel.id !== "shape-mesokurtic" && (
        <path d={refPath} fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
      )}
      <path d={path} fill={panel.color} fillOpacity="0.12" stroke={panel.color} strokeWidth="2" />
    </svg>
  );
}

export default function ShapeGraphs() {
  return (
    <div className="space-y-6">
      <ExplainerBox title="Two families of shape: skewness (which way it leans) and kurtosis (how peaked/tailed it is)">
        <p>
          Skewness asks whether a distribution is lopsided — does one tail stretch further than the
          other? Kurtosis asks something different — for a given amount of spread, is the data
          piled up sharply near the mean with more extreme outliers (leptokurtic), spread out more
          evenly (platykurtic), or right in between like a normal distribution (mesokurtic)? The
          dashed grey curve in each kurtosis panel below is the normal distribution, for comparison.
        </p>
      </ExplainerBox>

      <div>
        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">Skewness</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {skewPanels.map((panel) => (
            <div key={panel.id} id={panel.id} className="rounded-xl border border-card-border bg-muted p-3 space-y-2 scroll-mt-24">
              <p className="text-sm font-semibold text-heading">{panel.title}</p>
              <SkewSvg panel={panel} />
              <p className="text-[11px] font-mono font-semibold" style={{ color: panel.color }}>
                {panel.badge}
              </p>
              <p className="text-xs text-secondary">{panel.caption}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">Kurtosis</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {kurtosisPanels.map((panel) => (
            <div key={panel.id} id={panel.id} className="rounded-xl border border-card-border bg-muted p-3 space-y-2 scroll-mt-24">
              <p className="text-sm font-semibold text-heading">{panel.title}</p>
              <KurtosisSvg panel={panel} />
              <p className="text-[11px] font-mono font-semibold" style={{ color: panel.color }}>
                {panel.badge}
              </p>
              <p className="text-xs text-secondary">{panel.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
