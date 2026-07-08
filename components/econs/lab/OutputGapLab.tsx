"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ExplainerBox from "../../ExplainerBox";
import PlaybackControls from "./PlaybackControls";
import ConceptExplainer, { type ExplainerTopic } from "./ConceptExplainer";
import { trackInteract } from "@/lib/track";
import { generateActualSeries, generatePotentialSeries, TOTAL_YEARS, type DataPoint } from "@/lib/econs/lab/businessCycleModel";

const width = 700;
const height = 360;
const plotLeft = 55;
const plotRight = 670;
const plotTop = 30;
const plotBottom = 300;

interface GapPolygon {
  points: string;
  gapAbove: boolean; // true = actual above potential (inflationary)
}

export default function OutputGapLab() {
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<ExplainerTopic | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const actual = useMemo(() => generateActualSeries(), []);
  const potential = useMemo(() => generatePotentialSeries(), []);

  const { minGdp, maxGdp } = useMemo(() => {
    const values = [...actual, ...potential].map((p) => p.gdp);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return { minGdp: min - padding, maxGdp: max + padding };
  }, [actual, potential]);

  function toPlotX(year: number) {
    return plotLeft + (year / TOTAL_YEARS) * (plotRight - plotLeft);
  }
  function toPlotY(gdp: number) {
    return plotBottom - ((gdp - minGdp) / (maxGdp - minGdp)) * (plotBottom - plotTop);
  }

  const actualPath = useMemo(
    () => `M ${actual.map((p) => `${toPlotX(p.year).toFixed(1)},${toPlotY(p.gdp).toFixed(1)}`).join(" L ")}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actual, minGdp, maxGdp]
  );
  const potentialPath = useMemo(
    () => `M ${potential.map((p) => `${toPlotX(p.year).toFixed(1)},${toPlotY(p.gdp).toFixed(1)}`).join(" L ")}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [potential, minGdp, maxGdp]
  );

  const gapPolygons = useMemo(() => {
    const polys: GapPolygon[] = [];
    function sign(a: DataPoint, p: DataPoint) {
      return a.gdp >= p.gdp ? 1 : -1;
    }

    function pushPoly(yearA: number, actualA: number, potentialA: number, yearB: number, actualB: number, potentialB: number, above: boolean) {
      const pts = [
        [toPlotX(yearA), toPlotY(potentialA)],
        [toPlotX(yearA), toPlotY(actualA)],
        [toPlotX(yearB), toPlotY(actualB)],
        [toPlotX(yearB), toPlotY(potentialB)],
      ];
      polys.push({ points: pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "), gapAbove: above });
    }

    for (let i = 0; i < actual.length - 1; i++) {
      const a1 = actual[i];
      const a2 = actual[i + 1];
      const p1 = potential[i];
      const p2 = potential[i + 1];
      const s1 = sign(a1, p1);
      const s2 = sign(a2, p2);

      if (s1 === s2) {
        pushPoly(a1.year, a1.gdp, p1.gdp, a2.year, a2.gdp, p2.gdp, s1 === 1);
      } else {
        const diff1 = a1.gdp - p1.gdp;
        const diff2 = a2.gdp - p2.gdp;
        const t = diff1 / (diff1 - diff2);
        const crossYear = a1.year + t * (a2.year - a1.year);
        const crossGdp = p1.gdp + t * (p2.gdp - p1.gdp);
        pushPoly(a1.year, a1.gdp, p1.gdp, crossYear, crossGdp, crossGdp, s1 === 1);
        pushPoly(crossYear, crossGdp, crossGdp, a2.year, a2.gdp, p2.gdp, s2 === 1);
      }
    }
    return polys;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual, potential, minGdp, maxGdp]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (playhead >= TOTAL_YEARS) {
      setPlaying(false);
      return;
    }
    timeoutRef.current = setTimeout(() => setPlayhead((y) => Math.min(TOTAL_YEARS, y + 1)), 600 / speed);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, playhead, speed]);

  function togglePlay() {
    if (playhead >= TOTAL_YEARS) setPlayhead(0);
    setPlaying((p) => !p);
    markInteracted();
  }
  function step(delta: number) {
    setPlaying(false);
    setPlayhead((y) => Math.max(0, Math.min(TOTAL_YEARS, y + delta)));
    markInteracted();
  }

  const currentActual = actual[playhead];
  const currentPotential = potential[playhead];
  const gap = currentActual.gdp - currentPotential.gdp;
  const gapPct = (gap / currentPotential.gdp) * 100;
  const isInflationary = gap >= 0;

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why does 'above potential' also cause problems?">
        <p>
          Potential GDP (dashed green) is the economy's sustainable ceiling. Real GDP (blue) keeps
          wobbling around it. When Real GDP runs ABOVE potential, the economy is overheating — an{" "}
          <strong>inflationary gap</strong> (shaded orange). When it runs BELOW potential, resources
          sit idle — a <strong>recessionary gap</strong> (shaded blue). Scrub through time and
          watch the gap open and close.
        </p>
      </ExplainerBox>

      <PlaybackControls playing={playing} onTogglePlay={togglePlay} onStep={step} speed={speed} onSpeedChange={setSpeed} />

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-secondary">
          Year <strong className="text-heading font-mono">{currentActual.year}</strong>
        </span>
        <span className="text-secondary">
          Output Gap:{" "}
          <strong className={`font-mono ${isInflationary ? "text-accent-warm" : "text-accent"}`}>
            {gap >= 0 ? "+" : ""}
            {gap.toFixed(1)} ({gapPct >= 0 ? "+" : ""}
            {gapPct.toFixed(1)}%)
          </strong>
        </span>
        <button
          type="button"
          onClick={() => {
            setSelected(isInflationary ? "inflationary-gap" : "recessionary-gap");
            markInteracted();
          }}
          className="px-3 py-1 rounded-full border border-accent text-accent text-xs font-semibold hover:bg-muted transition-colors"
        >
          Why? ℹ
        </button>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72">
          <line x1={plotLeft} y1={plotTop - 5} x2={plotLeft} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
          <line x1={plotLeft} y1={plotBottom} x2={plotRight + 5} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
          <text x={(plotLeft + plotRight) / 2} y={plotBottom + 24} textAnchor="middle" className="fill-secondary text-xs">
            Time (years)
          </text>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            className="fill-secondary text-xs"
            transform={`translate(18, ${(plotTop + plotBottom) / 2}) rotate(-90)`}
          >
            GDP
          </text>

          {gapPolygons.map((poly, i) => (
            <polygon
              key={i}
              points={poly.points}
              fill={poly.gapAbove ? "var(--accent-warm)" : "var(--accent)"}
              fillOpacity="0.22"
            />
          ))}

          <path d={potentialPath} fill="none" stroke="var(--success)" strokeWidth="2" strokeDasharray="6,3" />
          <path d={actualPath} fill="none" stroke="var(--accent)" strokeWidth="2.5" />

          <circle cx={toPlotX(currentActual.year)} cy={toPlotY(currentActual.gdp)} r="5.5" fill="var(--accent-warm)" stroke="white" strokeWidth="1.5" />
          <circle cx={toPlotX(currentPotential.year)} cy={toPlotY(currentPotential.gdp)} r="4" fill="var(--success)" stroke="white" strokeWidth="1.5" />

          <text x={plotRight - 10} y={plotTop + 10} textAnchor="end" className="fill-accent font-semibold text-xs">
            Real GDP
          </text>
          <text x={plotRight - 10} y={plotTop + 24} textAnchor="end" className="fill-success font-semibold text-xs">
            Potential GDP
          </text>
        </svg>
      </div>

      {selected && <ConceptExplainer topic={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
