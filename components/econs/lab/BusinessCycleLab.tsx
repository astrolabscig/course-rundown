"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ExplainerBox from "../../ExplainerBox";
import PhaseBadge, { phaseConfig } from "./PhaseBadge";
import ConceptExplainer from "./ConceptExplainer";
import PlaybackControls from "./PlaybackControls";
import { trackInteract } from "@/lib/track";
import {
  classifySeries,
  generateActualSeries,
  TOTAL_YEARS,
  type Shock,
  type BusinessCyclePhase,
  type PhasedPoint,
} from "@/lib/econs/lab/businessCycleModel";

const width = 700;
const height = 340;
const plotLeft = 55;
const plotRight = 670;
const plotTop = 30;
const plotBottom = 290;

function findPhaseMidpoints(points: PhasedPoint[]): { index: number; phase: BusinessCyclePhase }[] {
  const markers: { index: number; phase: BusinessCyclePhase }[] = [];
  let runStart = 0;
  for (let i = 1; i <= points.length; i++) {
    if (i === points.length || points[i].phase !== points[runStart].phase) {
      const mid = Math.floor((runStart + i - 1) / 2);
      markers.push({ index: mid, phase: points[runStart].phase });
      runStart = i;
    }
  }
  return markers;
}

export default function BusinessCycleLab() {
  const [shocks, setShocks] = useState<Shock[]>([]);
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const series = useMemo(() => classifySeries(generateActualSeries(shocks)), [shocks]);

  const { minGdp, maxGdp } = useMemo(() => {
    const values = series.map((p) => p.gdp);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.12;
    return { minGdp: min - padding, maxGdp: max + padding };
  }, [series]);

  function toPlotX(year: number) {
    return plotLeft + (year / TOTAL_YEARS) * (plotRight - plotLeft);
  }
  function toPlotY(gdp: number) {
    return plotBottom - ((gdp - minGdp) / (maxGdp - minGdp)) * (plotBottom - plotTop);
  }

  const pathD = useMemo(
    () => `M ${series.map((p) => `${toPlotX(p.year).toFixed(1)},${toPlotY(p.gdp).toFixed(1)}`).join(" L ")}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, minGdp, maxGdp]
  );

  const phaseMarkers = useMemo(() => findPhaseMidpoints(series), [series]);

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

  function triggerEvent(sign: 1 | -1) {
    setShocks((prev) => [...prev.slice(-2), { startYear: playhead, sign }]);
    markInteracted();
  }

  const current = series[playhead];
  const hovered = hoverIndex !== null ? series[hoverIndex] : null;
  const selected = selectedIndex !== null ? series[selectedIndex] : null;

  return (
    <div className="space-y-4">
      <ExplainerBox title="What is the business cycle?">
        <p>
          No real economy grows in a perfectly straight line. Instead, output repeatedly swings
          through five phases: a <strong>trough</strong> (the bottom), a <strong>recovery</strong>{" "}
          (early bounce-back), an <strong>expansion</strong> (sustained growth), a{" "}
          <strong>peak</strong> (as high as it gets for now), and a <strong>recession</strong> (the
          downturn back toward the next trough) — over and over. Press play and watch it happen,
          then try pushing the economy into a recession or recovery yourself.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <PlaybackControls playing={playing} onTogglePlay={togglePlay} onStep={step} speed={speed} onSpeedChange={setSpeed} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => triggerEvent(-1)}
            className="px-3 py-1.5 rounded-full border border-error text-error text-xs font-semibold hover:bg-error/10 transition-colors"
          >
            📉 Trigger recession
          </button>
          <button
            type="button"
            onClick={() => triggerEvent(1)}
            className="px-3 py-1.5 rounded-full border border-success text-success text-xs font-semibold hover:bg-success/10 transition-colors"
          >
            🚀 Trigger recovery
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-secondary">
          Year <strong className="text-heading font-mono">{current.year}</strong> · Real GDP{" "}
          <strong className="text-heading font-mono">{current.gdp.toFixed(1)}</strong>
        </span>
        <PhaseBadge phase={current.phase} />
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
            Real GDP
          </text>

          <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5" />

          {phaseMarkers.map((m, i) => (
            <text
              key={i}
              x={toPlotX(series[m.index].year)}
              y={toPlotY(series[m.index].gdp) - 14}
              textAnchor="middle"
              style={{ fontSize: 15 }}
            >
              {phaseConfig[m.phase].icon}
            </text>
          ))}

          {series.map((p, i) => (
            <circle
              key={i}
              cx={toPlotX(p.year)}
              cy={toPlotY(p.gdp)}
              r={6}
              fill="transparent"
              pointerEvents="all"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex((h) => (h === i ? null : h))}
              onClick={() => {
                setPlaying(false);
                setSelectedIndex(i);
                markInteracted();
              }}
            />
          ))}

          {hovered && (
            <circle cx={toPlotX(hovered.year)} cy={toPlotY(hovered.gdp)} r="4" fill="white" stroke="var(--accent)" strokeWidth="2" />
          )}

          <circle cx={toPlotX(current.year)} cy={toPlotY(current.gdp)} r="5.5" fill="var(--accent-warm)" stroke="white" strokeWidth="1.5" />
        </svg>

        {hovered && (
          <div className="mt-2 inline-block rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-body shadow-sm">
            Year {hovered.year} · GDP {hovered.gdp.toFixed(1)} · Growth {hovered.growthRate.toFixed(1)}% · {phaseConfig[hovered.phase].label}
          </div>
        )}
      </div>

      {selected && (
        <ConceptExplainer topic={selected.phase} onClose={() => setSelectedIndex(null)} />
      )}
    </div>
  );
}
