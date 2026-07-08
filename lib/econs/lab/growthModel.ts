export interface GrowthInputs {
  education: number;
  technology: number;
  investment: number;
  infrastructure: number;
}

export interface GrowthDataPoint {
  year: number;
  gdp: number;
}

const BASE_GROWTH_RATE = 2.0; // % per year with all sliders at 0
const SLIDER_WEIGHT = 0.5; // percentage points of growth per slider unit
export const GROWTH_YEARS = 40;
const BASE_GDP = 100;

export function computeGrowthRate(inputs: GrowthInputs): number {
  const total = inputs.education + inputs.technology + inputs.investment + inputs.infrastructure;
  return BASE_GROWTH_RATE + total * SLIDER_WEIGHT;
}

export function generatePotentialGrowthSeries(inputs: GrowthInputs): GrowthDataPoint[] {
  const rate = computeGrowthRate(inputs) / 100;
  const points: GrowthDataPoint[] = [];
  for (let year = 0; year <= GROWTH_YEARS; year++) {
    points.push({ year, gdp: BASE_GDP * Math.pow(1 + rate, year) });
  }
  return points;
}
