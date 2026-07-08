export interface DataPoint {
  year: number;
  gdp: number;
}

export type BusinessCyclePhase = "recovery" | "expansion" | "peak" | "recession" | "trough";

export interface PhasedPoint extends DataPoint {
  phase: BusinessCyclePhase;
  growthRate: number;
}

export interface Shock {
  startYear: number;
  sign: 1 | -1; // +1 = triggered recovery/boom, -1 = triggered recession
}

export const TOTAL_YEARS = 30;
const PERIOD = 8;
const AMPLITUDE = 7;
const TREND_SLOPE = 2.2;
const BASE_GDP = 100;
const SHOCK_WINDOW = 6;
const SHOCK_MAGNITUDE = 9;

function trendValue(year: number): number {
  return BASE_GDP + TREND_SLOPE * year;
}

function waveValue(year: number): number {
  return AMPLITUDE * Math.sin((2 * Math.PI * year) / PERIOD);
}

function shockContribution(year: number, shocks: Shock[]): number {
  let total = 0;
  for (const shock of shocks) {
    const t = year - shock.startYear;
    if (t < 0 || t > SHOCK_WINDOW) continue;
    const bump = Math.sin((Math.PI * t) / SHOCK_WINDOW);
    total += shock.sign * SHOCK_MAGNITUDE * bump;
  }
  return total;
}

export function generateActualSeries(shocks: Shock[] = []): DataPoint[] {
  const points: DataPoint[] = [];
  for (let year = 0; year <= TOTAL_YEARS; year++) {
    points.push({ year, gdp: trendValue(year) + waveValue(year) + shockContribution(year, shocks) });
  }
  return points;
}

export function generatePotentialSeries(): DataPoint[] {
  const points: DataPoint[] = [];
  for (let year = 0; year <= TOTAL_YEARS; year++) {
    points.push({ year, gdp: trendValue(year) });
  }
  return points;
}

/**
 * Classifies every point in a generated series into one of the five business
 * cycle phases, derived from the series' own local minima/maxima so labels
 * stay correct even after a user-triggered shock reshapes the curve.
 */
export function classifySeries(points: DataPoint[]): PhasedPoint[] {
  const n = points.length;
  const extrema: ("peak" | "trough" | null)[] = points.map(() => null);

  for (let i = 1; i < n - 1; i++) {
    const prev = points[i - 1].gdp;
    const cur = points[i].gdp;
    const next = points[i + 1].gdp;
    if (cur > prev && cur > next) extrema[i] = "peak";
    else if (cur < prev && cur < next) extrema[i] = "trough";
  }

  const phases: BusinessCyclePhase[] = points.map(() => "expansion");

  for (let i = 0; i < n; i++) {
    if (extrema[i] === "peak") {
      phases[i] = "peak";
      continue;
    }
    if (extrema[i] === "trough") {
      phases[i] = "trough";
      continue;
    }

    let prevIdx = i - 1;
    while (prevIdx >= 0 && !extrema[prevIdx]) prevIdx--;
    let nextIdx = i + 1;
    while (nextIdx < n && !extrema[nextIdx]) nextIdx++;
    const prevType = prevIdx >= 0 ? extrema[prevIdx] : null;
    const nextType = nextIdx < n ? extrema[nextIdx] : null;

    if (prevType === "trough" && nextType === "peak") {
      const span = nextIdx - prevIdx;
      const frac = (i - prevIdx) / span;
      phases[i] = frac < 0.3 ? "recovery" : "expansion";
    } else if (prevType === "peak" && nextType === "trough") {
      phases[i] = "recession";
    } else {
      const slope = i > 0 ? points[i].gdp - points[i - 1].gdp : points[1].gdp - points[0].gdp;
      phases[i] = slope >= 0 ? "expansion" : "recession";
    }
  }

  return points.map((p, i) => ({
    ...p,
    phase: phases[i],
    growthRate: i > 0 ? ((p.gdp - points[i - 1].gdp) / points[i - 1].gdp) * 100 : 0,
  }));
}
