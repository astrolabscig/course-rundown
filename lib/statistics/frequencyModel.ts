export interface FrequencyClass {
  lower: number;
  upper: number;
  boundaryLower: number;
  boundaryUpper: number;
  midpoint: number;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
}

export interface FrequencyDistribution {
  n: number;
  k: number;
  width: number;
  min: number;
  max: number;
  classes: FrequencyClass[];
}

export function computeClassCount(n: number): number {
  let k = 1;
  while (Math.pow(2, k) < n) k++;
  return k;
}

export function buildFrequencyDistribution(data: number[]): FrequencyDistribution {
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const k = computeClassCount(n);
  const width = Math.ceil((max - min) / k);

  const classes: FrequencyClass[] = [];
  let lower = min;
  for (let i = 0; i < k; i++) {
    const upper = lower + width - 1;
    const frequency = data.filter((x) => x >= lower && x <= upper).length;
    classes.push({
      lower,
      upper,
      boundaryLower: lower - 0.5,
      boundaryUpper: upper + 0.5,
      midpoint: (lower + upper) / 2,
      frequency,
      relativeFrequency: frequency / n,
      cumulativeFrequency: 0,
    });
    lower = upper + 1;
  }

  let running = 0;
  for (const c of classes) {
    running += c.frequency;
    c.cumulativeFrequency = running;
  }

  return { n, k, width, min, max, classes };
}
