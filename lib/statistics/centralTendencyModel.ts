export interface CentralTendencyResult {
  mean: number;
  trimmedMean: number;
  trimCount: number;
  trimmedData: number[];
  geometricMean: number | null;
  median: number;
  mode: number[];
}

export function computeCentralTendency(data: number[], trimPercent: number): CentralTendencyResult {
  const n = data.length;
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const sorted = [...data].sort((a, b) => a - b);
  const trimCount = Math.floor((trimPercent / 100) * n);
  const trimmedData = trimCount > 0 ? sorted.slice(trimCount, n - trimCount) : sorted;
  const trimmedMean = trimmedData.reduce((a, b) => a + b, 0) / trimmedData.length;

  const allPositive = data.every((x) => x > 0);
  const geometricMean = allPositive ? Math.pow(data.reduce((a, b) => a * b, 1), 1 / n) : null;

  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const freq: Record<number, number> = {};
  for (const x of data) freq[x] = (freq[x] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  const mode = Object.keys(freq)
    .filter((k) => freq[Number(k)] === maxFreq)
    .map(Number)
    .sort((a, b) => a - b);

  return { mean, trimmedMean, trimCount, trimmedData, geometricMean, median, mode };
}

export interface WeightedMeanInput {
  value: number;
  weight: number;
}

export function computeWeightedMean(inputs: WeightedMeanInput[]): number {
  const weightedSum = inputs.reduce((acc, i) => acc + i.value * i.weight, 0);
  const totalWeight = inputs.reduce((acc, i) => acc + i.weight, 0);
  return weightedSum / totalWeight;
}
