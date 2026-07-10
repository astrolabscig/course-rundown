export type FormulaPart =
  | { type: "text"; value: string }
  | { type: "frac"; num: string; den: string }
  | { type: "sqrt"; value: string; index?: string };

export interface Formula {
  id: string;
  name: string;
  formula: FormulaPart[];
  where?: string[];
  note?: string;
}

export interface FormulaSection {
  id: string;
  title: string;
  formulas: Formula[];
}

const t = (value: string): FormulaPart => ({ type: "text", value });
const frac = (num: string, den: string): FormulaPart => ({ type: "frac", num, den });
const sqrt = (value: string, index?: string): FormulaPart => ({ type: "sqrt", value, index });

export const statisticsFormulaSheet: FormulaSection[] = [
  {
    id: "formulas-frequency",
    title: "Frequency Distributions & Graphs",
    formulas: [
      {
        id: "f-classes",
        name: "Number of classes (k)",
        formula: [t("smallest k such that 2ᵏ ≥ n")],
        where: ["n = number of observations"],
        note: "Try k = 1, 2, 3, ... until 2ᵏ first meets or exceeds n.",
      },
      {
        id: "f-width",
        name: "Class width (c)",
        formula: [t("c = "), frac("Max − Min", "k"), t(", rounded UP")],
        where: ["Max, Min = highest and lowest observed values", "k = number of classes"],
        note: "Always round up, never down — rounding down can leave the largest values with no class.",
      },
      {
        id: "f-boundary",
        name: "Class boundary",
        formula: [t("boundary = "), frac("upper limit + next lower limit", "2")],
        note: "Closes the gap between consecutive classes; used for histograms, not the frequency table itself.",
      },
      {
        id: "f-midpoint",
        name: "Class midpoint",
        formula: [t("midpoint = "), frac("lower limit + upper limit", "2")],
      },
      {
        id: "f-relfreq",
        name: "Relative frequency",
        formula: [t("relative frequency = "), frac("f", "n")],
        where: ["f = frequency of the class", "n = total number of observations"],
      },
      {
        id: "f-cumfreq",
        name: "Cumulative frequency",
        formula: [t("CF = running total of f, class by class")],
      },
      {
        id: "f-pieangle",
        name: "Pie chart sector angle",
        formula: [t("angle = "), frac("f", "n"), t(" × 360°")],
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
        formula: [t("x̄ = "), frac("Σx", "n")],
      },
      {
        id: "f-mean-grouped",
        name: "Arithmetic mean (grouped)",
        formula: [t("x̄ = "), frac("Σfx", "Σf")],
        where: ["x = class midpoint", "f = class frequency"],
      },
      {
        id: "f-mean-assumed",
        name: "Assumed mean method",
        formula: [t("x̄ = A + "), frac("Σfd", "Σf"), t(",  d = x − A")],
        where: ["A = assumed mean (any reasonable class midpoint)", "d = deviation of each midpoint from A"],
      },
      {
        id: "f-mean-coding",
        name: "Coding method",
        formula: [t("x̄ = A + "), frac("Σfu", "Σf"), t(" × c,  u = "), frac("x − A", "c")],
        where: ["c = class width", "u = coded deviation, rescaled by class width"],
      },
      {
        id: "f-mean-trimmed",
        name: "Trimmed mean (k%)",
        formula: [t("sort data, drop k% of n from EACH end, average what's left")],
      },
      {
        id: "f-mean-geometric",
        name: "Geometric mean",
        formula: [t("GM = "), sqrt("x₁ × x₂ × x₃ × ... × xₙ", "n")],
        note: "Only for positive values — used for growth rates, ratios, percentages.",
      },
      {
        id: "f-mean-weighted",
        name: "Weighted mean",
        formula: [t("x̄w = "), frac("Σ(w·x)", "Σw")],
        where: ["w = weight assigned to each value x"],
      },
      {
        id: "f-median-even",
        name: "Median (ungrouped, even n)",
        formula: [t("median = average of the two middle sorted values")],
      },
      {
        id: "f-median-grouped",
        name: "Median (grouped)",
        formula: [t("median = L + "), frac("c", "f"), t("("), frac("n", "2"), t(" − F)")],
        where: [
          "L = lower boundary of the median class",
          "c = class width, f = frequency of the median class",
          "F = cumulative frequency BEFORE the median class",
        ],
      },
      {
        id: "f-mode-grouped",
        name: "Mode (grouped)",
        formula: [t("mode = L + "), frac("Δ1", "Δ1 + Δ2"), t(" × c")],
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
        formula: [t("range = Max − Min")],
      },
      {
        id: "f-meandev",
        name: "Mean deviation",
        formula: [t("MD = "), frac("Σ|x − x̄|", "n")],
      },
      {
        id: "f-popvar",
        name: "Population variance",
        formula: [t("σ² = "), frac("Σ(x − μ)²", "N")],
        where: ["μ = population mean", "N = population size"],
      },
      {
        id: "f-popsd",
        name: "Population standard deviation",
        formula: [t("σ = "), sqrt("σ²")],
      },
      {
        id: "f-samplevar",
        name: "Sample variance",
        formula: [t("s² = "), frac("Σ(x − x̄)²", "n − 1")],
        note: "Divides by n−1 (Bessel's correction), not n — this is what makes it a sample formula.",
      },
      {
        id: "f-samplesd",
        name: "Sample standard deviation",
        formula: [t("s = "), sqrt("s²")],
      },
      {
        id: "f-cv",
        name: "Coefficient of variation",
        formula: [t("CV = "), frac("SD", "mean"), t(" × 100%")],
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
        formula: [t("position of Qk = "), frac("k(n + 1)", "4"), t(",  k = 1, 2, 3")],
        note: "If the position isn't a whole number, interpolate between the two nearest ranked values.",
      },
      {
        id: "f-decile-pos",
        name: "Decile position (ungrouped)",
        formula: [t("position of Dk = "), frac("k(n + 1)", "10"), t(",  k = 1 ... 9")],
      },
      {
        id: "f-percentile-pos",
        name: "Percentile position (ungrouped)",
        formula: [t("position of Pk = "), frac("k(n + 1)", "100"), t(",  k = 1 ... 99")],
      },
      {
        id: "f-percentile-grouped",
        name: "Percentile (grouped)",
        formula: [t("Pk = l + "), frac("c", "f"), t("(nk − F)")],
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
        formula: [t("IQR = Q3 − Q1")],
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
        formula: [t("Sk = "), frac("3(mean − median)", "SD")],
        note: "Sk > 0: positive (right) skew. Sk < 0: negative (left) skew. Sk ≈ 0: roughly symmetric.",
      },
      {
        id: "f-five-number",
        name: "Five-number summary",
        formula: [t("Min, Q1, Median, Q3, Max")],
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
        formula: [t("≈68% within ±1σ,  ≈95% within ±2σ,  ≈99.7% within ±3σ")],
        note: "Only applies to roughly bell-shaped (approximately normal) distributions.",
      },
      {
        id: "f-zdistance",
        name: "Distance from the mean, in SDs",
        formula: [t("z = "), frac("x − mean", "SD")],
      },
    ],
  },
  {
    id: "formulas-probability",
    title: "Probability",
    formulas: [
      {
        id: "f-classical-prob",
        name: "Classical probability",
        formula: [t("P(E) = "), frac("n(E)", "n(S)")],
        where: ["n(E) = number of outcomes in event E", "n(S) = number of outcomes in the sample space"],
        note: "Only valid when every outcome in S is equally likely.",
      },
      {
        id: "f-addition-rule",
        name: "Addition rule (general)",
        formula: [t("P(A ∪ B) = P(A) + P(B) − P(A ∩ B)")],
      },
      {
        id: "f-addition-mutex",
        name: "Addition rule (mutually exclusive)",
        formula: [t("P(A ∪ B) = P(A) + P(B),   since P(A ∩ B) = 0")],
      },
      {
        id: "f-independence",
        name: "Independence rule",
        formula: [t("P(A ∩ B) = P(A) × P(B)")],
        note: "Only true when A and B are independent — check it, don't assume it.",
      },
      {
        id: "f-complement",
        name: "Complement rule",
        formula: [t("P(A′) = 1 − P(A)")],
      },
      {
        id: "f-demorgan",
        name: "De Morgan's Law",
        formula: [t("(A ∪ B)′ = A′ ∩ B′,   (A ∩ B)′ = A′ ∪ B′")],
      },
      {
        id: "f-conditional-prob",
        name: "Conditional probability",
        formula: [t("P(B | A) = "), frac("P(A ∩ B)", "P(A)")],
        note: "Requires P(A) > 0.",
      },
      {
        id: "f-total-probability",
        name: "Total Probability Rule",
        formula: [t("P(B) = Σ P(B | Aᵢ) × P(Aᵢ)")],
        where: ["A₁, A₂, ..., Aₙ must partition the sample space (mutually exclusive, cover all of S)"],
      },
      {
        id: "f-bayes",
        name: "Bayes' Theorem",
        formula: [t("P(Aⱼ | B) = "), frac("P(B | Aⱼ) × P(Aⱼ)", "P(B)")],
        note: "The denominator P(B) is computed with the Total Probability Rule above.",
      },
    ],
  },
];
