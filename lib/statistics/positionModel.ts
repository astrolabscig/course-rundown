export interface GroupedClass {
  lower: number;
  upper: number;
  boundaryLower: number;
  boundaryUpper: number;
  frequency: number;
  cumulativeFrequency: number;
}

export interface PercentileStep {
  targetClass: GroupedClass;
  l: number;
  f: number;
  c: number;
  F: number;
  nk: number;
  value: number;
}

export function buildGroupedClasses(
  rows: { lower: number; upper: number; frequency: number }[]
): GroupedClass[] {
  let running = 0;
  return rows.map((r) => {
    running += r.frequency;
    return {
      lower: r.lower,
      upper: r.upper,
      boundaryLower: r.lower - 0.5,
      boundaryUpper: r.upper + 0.5,
      frequency: r.frequency,
      cumulativeFrequency: running,
    };
  });
}

export function computeGroupedPercentile(classes: GroupedClass[], k: number): PercentileStep {
  const n = classes[classes.length - 1].cumulativeFrequency;
  const nk = k * n;
  let targetIndex = classes.findIndex((c) => c.cumulativeFrequency >= nk);
  if (targetIndex === -1) targetIndex = classes.length - 1;
  const targetClass = classes[targetIndex];
  const F = targetIndex > 0 ? classes[targetIndex - 1].cumulativeFrequency : 0;
  const l = targetClass.boundaryLower;
  const f = targetClass.frequency;
  const c = targetClass.boundaryUpper - targetClass.boundaryLower;
  const value = l + (c / f) * (nk - F);
  return { targetClass, l, f, c, F, nk, value };
}

export interface UngroupedQuartiles {
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  sorted: number[];
}

function interpolatedRank(sorted: number[], position: number): number {
  const lowerIndex = Math.floor(position) - 1;
  const upperIndex = Math.ceil(position) - 1;
  if (lowerIndex === upperIndex) return sorted[lowerIndex];
  const frac = position - Math.floor(position);
  return sorted[lowerIndex] + frac * (sorted[upperIndex] - sorted[lowerIndex]);
}

export function computeUngroupedQuartiles(data: number[]): UngroupedQuartiles {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const q1 = interpolatedRank(sorted, (n + 1) / 4);
  const q2 = interpolatedRank(sorted, (n + 1) / 2);
  const q3 = interpolatedRank(sorted, (3 * (n + 1)) / 4);
  return { q1, q2, q3, iqr: q3 - q1, sorted };
}
