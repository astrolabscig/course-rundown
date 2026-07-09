export interface DispersionResult {
  range: number;
  meanDeviation: number;
  populationVariance: number;
  populationSD: number;
  sampleVariance: number;
  sampleSD: number;
  coefficientOfVariation: number;
  mean: number;
}

export function computeDispersion(data: number[]): DispersionResult {
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const range = Math.max(...data) - Math.min(...data);

  const meanDeviation = data.reduce((acc, x) => acc + Math.abs(x - mean), 0) / n;

  const sumSquaredDiffs = data.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);
  const populationVariance = sumSquaredDiffs / n;
  const populationSD = Math.sqrt(populationVariance);

  const sampleVariance = n > 1 ? sumSquaredDiffs / (n - 1) : 0;
  const sampleSD = Math.sqrt(sampleVariance);

  const coefficientOfVariation = (populationSD / mean) * 100;

  return { range, meanDeviation, populationVariance, populationSD, sampleVariance, sampleSD, coefficientOfVariation, mean };
}
