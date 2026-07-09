export interface Formula {
  id: string;
  name: string;
  formula: string;
  where?: string[];
  note?: string;
}

export interface FormulaSection {
  id: string;
  title: string;
  formulas: Formula[];
}

export const statisticsFormulaSheet: FormulaSection[] = [
  {
    id: "formulas-frequency",
    title: "Frequency Distributions & Graphs",
    formulas: [
      {
        id: "f-classes",
        name: "Number of classes (k)",
        formula: "smallest k such that 2^k ≥ n",
        where: ["n = number of observations"],
        note: "Try k = 1, 2, 3, ... until 2^k first meets or exceeds n.",
      },
      {
        id: "f-width",
        name: "Class width (c)",
        formula: "c = (Max − Min) / k, rounded UP",
        where: ["Max, Min = highest and lowest observed values", "k = number of classes"],
        note: "Always round up, never down — rounding down can leave the largest values with no class.",
      },
      {
        id: "f-boundary",
        name: "Class boundary",
        formula: "boundary = (upper limit + next lower limit) / 2",
        note: "Closes the gap between consecutive classes; used for histograms, not the frequency table itself.",
      },
      {
        id: "f-midpoint",
        name: "Class midpoint",
        formula: "midpoint = (lower limit + upper limit) / 2",
      },
      {
        id: "f-relfreq",
        name: "Relative frequency",
        formula: "relative frequency = f / n",
        where: ["f = frequency of the class", "n = total number of observations"],
      },
      {
        id: "f-cumfreq",
        name: "Cumulative frequency",
        formula: "CF = running total of f, class by class",
      },
      {
        id: "f-pieangle",
        name: "Pie chart sector angle",
        formula: "angle = (f / n) × 360°",
      },
    ],
  },
  {
    id: "formulas-central-tendency",
    title: "Measures of Central Tendency",
    formulas: [
      {
        id: "f-mean-ungrouped",
        name: "Arithmetic mean (ungrouped)",
        formula: "x̄ = Σx / n",
      },
      {
        id: "f-mean-grouped",
        name: "Arithmetic mean (grouped)",
        formula: "x̄ = Σfx / Σf",
        where: ["x = class midpoint", "f = class frequency"],
      },
      {
        id: "f-mean-assumed",
        name: "Assumed mean method",
        formula: "x̄ = A + (Σfd / Σf),  d = x − A",
        where: ["A = assumed mean (any reasonable class midpoint)", "d = deviation of each midpoint from A"],
      },
      {
        id: "f-mean-coding",
        name: "Coding method",
        formula: "x̄ = A + (Σfu / Σf) × c,  u = (x − A) / c",
        where: ["c = class width", "u = coded deviation, rescaled by class width"],
      },
      {
        id: "f-mean-trimmed",
        name: "Trimmed mean (k%)",
        formula: "sort data, drop k% of n from EACH end, average what's left",
      },
      {
        id: "f-mean-geometric",
        name: "Geometric mean",
        formula: "GM = ⁿ√(x₁ × x₂ × x₃ × ... × xₙ)",
        note: "Only for positive values — used for growth rates, ratios, percentages.",
      },
      {
        id: "f-mean-weighted",
        name: "Weighted mean",
        formula: "x̄w = Σ(w·x) / Σw",
        where: ["w = weight assigned to each value x"],
      },
      {
        id: "f-median-even",
        name: "Median (ungrouped, even n)",
        formula: "median = average of the two middle sorted values",
      },
      {
        id: "f-median-grouped",
        name: "Median (grouped)",
        formula: "median = L + (c/f)(n/2 − F)",
        where: [
          "L = lower boundary of the median class",
          "c = class width, f = frequency of the median class",
          "F = cumulative frequency BEFORE the median class",
        ],
      },
      {
        id: "f-mode-grouped",
        name: "Mode (grouped)",
        formula: "mode = L + [Δ1 / (Δ1 + Δ2)] × c",
        where: [
          "L = lower boundary of the modal class (highest frequency)",
          "Δ1 = modal frequency − preceding class frequency",
          "Δ2 = modal frequency − succeeding class frequency",
        ],
      },
    ],
  },
  {
    id: "formulas-dispersion",
    title: "Measures of Dispersion",
    formulas: [
      {
        id: "f-range",
        name: "Range",
        formula: "range = Max − Min",
      },
      {
        id: "f-meandev",
        name: "Mean deviation",
        formula: "MD = Σ|x − x̄| / n",
      },
      {
        id: "f-popvar",
        name: "Population variance",
        formula: "σ² = Σ(x − μ)² / N",
        where: ["μ = population mean", "N = population size"],
      },
      {
        id: "f-popsd",
        name: "Population standard deviation",
        formula: "σ = √σ²",
      },
      {
        id: "f-samplevar",
        name: "Sample variance",
        formula: "s² = Σ(x − x̄)² / (n − 1)",
        note: "Divides by n−1 (Bessel's correction), not n — this is what makes it a sample formula.",
      },
      {
        id: "f-samplesd",
        name: "Sample standard deviation",
        formula: "s = √s²",
      },
      {
        id: "f-cv",
        name: "Coefficient of variation",
        formula: "CV = (SD / mean) × 100%",
        note: "Unit-free — the right tool for comparing spread across different scales.",
      },
    ],
  },
  {
    id: "formulas-position",
    title: "Measures of Position",
    formulas: [
      {
        id: "f-quartile-pos",
        name: "Quartile position (ungrouped)",
        formula: "position of Qk = k(n + 1) / 4,  k = 1, 2, 3",
        note: "If the position isn't a whole number, interpolate between the two nearest ranked values.",
      },
      {
        id: "f-decile-pos",
        name: "Decile position (ungrouped)",
        formula: "position of Dk = k(n + 1) / 10,  k = 1 ... 9",
      },
      {
        id: "f-percentile-pos",
        name: "Percentile position (ungrouped)",
        formula: "position of Pk = k(n + 1) / 100,  k = 1 ... 99",
      },
      {
        id: "f-percentile-grouped",
        name: "Percentile (grouped)",
        formula: "Pk = l + (c/f)(nk − F)",
        where: [
          "l = lower boundary of the class containing Pk",
          "nk = target cumulative position (n × k, k as a decimal, e.g. 0.90 for P90)",
          "f = frequency of that class, c = class width",
          "F = cumulative frequency BEFORE that class",
        ],
      },
      {
        id: "f-iqr",
        name: "Interquartile range (IQR)",
        formula: "IQR = Q3 − Q1",
      },
    ],
  },
  {
    id: "formulas-shape",
    title: "Measures of Shape & EDA",
    formulas: [
      {
        id: "f-skew",
        name: "Pearson's coefficient of skewness",
        formula: "Sk = 3(mean − median) / SD",
        note: "Sk > 0: positive (right) skew. Sk < 0: negative (left) skew. Sk ≈ 0: roughly symmetric.",
      },
      {
        id: "f-five-number",
        name: "Five-number summary",
        formula: "Min, Q1, Median, Q3, Max",
        note: "Exactly what a boxplot displays — the box spans Q1 to Q3, the line inside is the median.",
      },
    ],
  },
  {
    id: "formulas-empirical",
    title: "The Empirical Rule",
    formulas: [
      {
        id: "f-empirical",
        name: "68-95-99.7 rule",
        formula: "≈68% within ±1σ,  ≈95% within ±2σ,  ≈99.7% within ±3σ",
        note: "Only applies to roughly bell-shaped (approximately normal) distributions.",
      },
      {
        id: "f-zdistance",
        name: "Distance from the mean, in SDs",
        formula: "z = (x − mean) / SD",
      },
    ],
  },
];
