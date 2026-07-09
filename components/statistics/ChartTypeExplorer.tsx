"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { buildFrequencyDistribution } from "@/lib/statistics/frequencyModel";

const travelTimesData =
  "8,7,10,5,23,4,16,9,62,28,14,53,29,11,34,33,68,75,12,78,22,54,67,55,13,32,41,58,36,2,26,77,65,38,52,71,2,16,36,40,18,24,52,64,76,16,6,18,28,40";

const data = travelTimesData.split(",").map(Number);
const dist = buildFrequencyDistribution(data);

const colors = ["#4F7CFF", "#FF7A59", "#2FA86A", "#9B59B6", "#E0455A", "#E0A930"];

type ChartType = "histogram" | "ogive" | "pie";

const width = 500;
const height = 300;
const plotLeft = 50;
const plotRight = 470;
const plotTop = 20;
const plotBottom = 250;

function Histogram() {
  const maxFreq = Math.max(...dist.classes.map((c) => c.frequency));
  const totalRange = dist.classes[dist.classes.length - 1].boundaryUpper - dist.classes[0].boundaryLower;
  function toX(v: number) {
    return plotLeft + ((v - dist.classes[0].boundaryLower) / totalRange) * (plotRight - plotLeft);
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
      <line x1={plotLeft} y1={plotTop} x2={plotLeft} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
      <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
      {dist.classes.map((c, i) => {
        const x1 = toX(c.boundaryLower);
        const x2 = toX(c.boundaryUpper);
        const barHeight = (c.frequency / maxFreq) * (plotBottom - plotTop);
        return (
          <g key={i}>
            <rect x={x1} y={plotBottom - barHeight} width={x2 - x1} height={barHeight} fill={colors[i % colors.length]} stroke="white" strokeWidth="1" />
            <text x={(x1 + x2) / 2} y={plotBottom - barHeight - 6} textAnchor="middle" className="fill-heading text-xs font-mono">
              {c.frequency}
            </text>
            <text x={x1} y={plotBottom + 14} textAnchor="middle" className="fill-secondary text-[9px] font-mono">
              {c.boundaryLower}
            </text>
          </g>
        );
      })}
      <text x={toX(dist.classes[dist.classes.length - 1].boundaryUpper)} y={plotBottom + 14} textAnchor="middle" className="fill-secondary text-[9px] font-mono">
        {dist.classes[dist.classes.length - 1].boundaryUpper}
      </text>
      <text x={plotLeft - 10} y={plotTop} textAnchor="end" className="fill-secondary text-xs">
        Freq
      </text>
    </svg>
  );
}

function Ogive() {
  const totalRange = dist.classes[dist.classes.length - 1].boundaryUpper - dist.classes[0].boundaryLower;
  const maxCum = dist.n;
  function toX(v: number) {
    return plotLeft + ((v - dist.classes[0].boundaryLower) / totalRange) * (plotRight - plotLeft);
  }
  function toY(v: number) {
    return plotBottom - (v / maxCum) * (plotBottom - plotTop);
  }
  const points = [
    { x: dist.classes[0].boundaryLower, y: 0 },
    ...dist.classes.map((c) => ({ x: c.boundaryUpper, y: c.cumulativeFrequency })),
  ];
  const pathD = `M ${points.map((p) => `${toX(p.x)},${toY(p.y)}`).join(" L ")}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
      <line x1={plotLeft} y1={plotTop} x2={plotLeft} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
      <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r="3" fill="var(--accent)" />
      ))}
      {dist.classes.map((c, i) => (
        <text key={i} x={toX(c.boundaryUpper)} y={plotBottom + 14} textAnchor="middle" className="fill-secondary text-[9px] font-mono">
          {c.boundaryUpper}
        </text>
      ))}
      <text x={plotLeft - 10} y={plotTop} textAnchor="end" className="fill-secondary text-xs">
        Cum.
      </text>
    </svg>
  );
}

function PieChart() {
  const cx = width / 2;
  const cy = height / 2;
  const r = 100;
  let cumulativeAngle = -Math.PI / 2;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
      {dist.classes.map((c, i) => {
        const angle = c.relativeFrequency * 2 * Math.PI;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;
        cumulativeAngle = endAngle;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const midAngle = (startAngle + endAngle) / 2;
        const labelX = cx + (r + 20) * Math.cos(midAngle);
        const labelY = cy + (r + 20) * Math.sin(midAngle);
        return (
          <g key={i}>
            <path
              d={`M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
              fill={colors[i % colors.length]}
              stroke="white"
              strokeWidth="1.5"
            />
            <text x={labelX} y={labelY} textAnchor="middle" className="fill-heading text-[10px] font-mono">
              {(c.relativeFrequency * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ChartTypeExplorer() {
  const [chartType, setChartType] = useState<ChartType>("histogram");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const chart = useMemo(() => {
    if (chartType === "histogram") return <Histogram />;
    if (chartType === "ogive") return <Ogive />;
    return <PieChart />;
  }, [chartType]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Same table, three completely different pictures">
        <p>
          A histogram shows how much falls in each class — tall bars mean crowded classes. An ogive
          (cumulative frequency curve) shows how much has accumulated by each point — always
          climbing, since frequencies only add up. A pie chart shows each class as a share of the
          whole. All three come from the exact same frequency table built in Part 2 above.
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(["histogram", "ogive", "pie"] as ChartType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setChartType(t);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition-colors ${
              chartType === t ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-3">{chart}</div>
    </div>
  );
}
