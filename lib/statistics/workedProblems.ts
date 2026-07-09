export interface WorkedProblem {
  id: string;
  label: string;
  given?: string;
  goal: string;
  steps: { statement: string; reason: string }[];
  conclusion: string;
}

export const part1WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p1-scales",
    label: "Classifying the four scales of measurement",
    given:
      "Soil colour (brown, black, yellow); Severity of injury (fatal, serious, minor, no injury); Temperature; Distance between two locations.",
    goal: "Identify which scale of measurement each variable uses, and why.",
    steps: [
      { statement: "Soil colour: no ranking exists between brown/black/yellow — any reordering still makes sense.", reason: "No order = nominal scale" },
      { statement: "Severity of injury: fatal > serious > minor > no injury is a genuine ranking, but the 'distance' between fatal and serious isn't a measurable, equal quantity.", reason: "Order exists, but no equal intervals = ordinal scale" },
      { statement: "Temperature: 100° is measurably 50° more than 50°, but 0° does NOT mean 'no temperature at all' — it's just an arbitrary reference point.", reason: "Order + equal intervals, but no true zero = interval scale" },
      { statement: "Distance: 10km is measurably double 5km, AND 0km genuinely means 'no distance at all'.", reason: "Order + equal intervals + true zero = ratio scale" },
    ],
    conclusion: "Soil colour = nominal, severity of injury = ordinal, temperature = interval, distance = ratio — the deciding question at each step is simply 'is there order?', then 'are the gaps equal?', then 'is zero a real zero?'",
  },
  {
    id: "stats-p1-ivppss",
    label: "IVPPSS worked through the oak tree example",
    given:
      "A landowner owns 60 acres of timber. He wants to measure the mean diameter-breast-height (DBH) of the oak trees on his property. He measures the DBH of 75 randomly selected oak trees.",
    goal: "Identify the individual, variable, population, parameter, sample, and statistic.",
    steps: [
      { statement: "Individual = an oak tree.", reason: "The single item being examined — here it's a tree, not a person" },
      { statement: "Variable = diameter-breast-height (DBH).", reason: "The characteristic actually being recorded about each individual" },
      { statement: "Population = all oak trees on the property.", reason: "Every individual of interest, whether measured or not" },
      { statement: "Parameter = the mean DBH of ALL oak trees on the property.", reason: "A summary number computed from the entire population (usually unknown in practice)" },
      { statement: "Sample = the 75 oak trees that were actually measured.", reason: "The subset of the population that was actually examined" },
      { statement: "Statistic = the mean DBH of those 75 measured oak trees.", reason: "A summary number computed from the sample — the same TYPE of summary (a mean) as the parameter" },
    ],
    conclusion: "The statistic (computed from the 75 trees) is used to ESTIMATE the parameter (the true mean of all trees on the property) — this estimation step is exactly what inferential statistics is for.",
  },
];

export const part2WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p2-categorical",
    label: "Categorical frequency distribution: KNUST Business School specializations",
    given:
      "HTM, ACF, ACF, HTM, LSCM, ACF, LSCM, LSCM, ACF, MIB, ACF, LSCM, ACF, ACF, LSCM, HTM, LSCM, HTM, HTM, LSCM, LSCM, ACF, MIB, MIB, MIB, HTM, LSCM, ACF, HTM, HTM (30 students total).",
    goal: "Construct a categorical frequency distribution (tally, frequency, percentage) for the data.",
    steps: [
      { statement: "Tally each category as you go through the list once: HTM, ACF, LSCM, MIB.", reason: "A categorical frequency distribution just counts occurrences per category — no class widths needed since the categories already exist" },
      { statement: "HTM count = 9, ACF count = 8, LSCM count = 9, MIB count = 4.", reason: "Direct tally of the 30 values" },
      { statement: "Check the total: 9+8+9+4 = 30 — matches the full dataset, so no values were missed or double-counted.", reason: "Always verify the frequencies sum to n" },
      { statement: "Percentage = (frequency/n)×100: HTM = 30%, ACF ≈ 26.7%, LSCM = 30%, MIB ≈ 13.3%.", reason: "Convert each frequency to a percentage of the whole" },
    ],
    conclusion: "HTM: 9 (30%), ACF: 8 (26.7%), LSCM: 9 (30%), MIB: 4 (13.3%) — categorical data never needs class limits or boundaries, since the categories themselves ARE the classes.",
  },
  {
    id: "stats-p2-rules",
    label: "Why frequency distribution rules matter",
    goal: "Explain why a frequency table needs mutually exclusive, continuous, exhaustive, equal-width classes.",
    steps: [
      { statement: "Mutually exclusive: if classes overlapped (e.g. 10-20 and 15-25), a value like 17 could be tallied into two classes at once, inflating the total count.", reason: "Every observation must belong to exactly one class" },
      { statement: "Continuous (no gaps): if there were a gap between classes (e.g. 10-20, then 25-35), a value like 22 would have nowhere to go.", reason: "Every possible value in the data's range must land somewhere" },
      { statement: "Exhaustive: there must be enough classes to cover every value from the lowest to the highest — this is exactly what the 2^k ≥ n rule guarantees.", reason: "No observation should be left unaccounted for" },
      { statement: "Equal width: unequal class widths make the histogram's bar heights misleading, since a wider class naturally catches more values even at the same underlying density.", reason: "Keeps visual comparisons between classes fair" },
    ],
    conclusion: "All four rules exist to guarantee that every single data point ends up counted exactly once, in a class that fairly represents it — break any one rule and the resulting table (and any chart built from it) can mislead.",
  },
];

export const part3WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p3-trimmed",
    label: "20% trimmed mean",
    given: "Dataset: 22, 25, 29, 11, 14, 18, 13, 13, 17, 11, 8, 8, 7, 12, 15, 6, 8, 7, 9, 12 (n = 20).",
    goal: "Calculate the 20% trimmed mean.",
    steps: [
      { statement: "Sort the data: 6, 7, 7, 8, 8, 8, 9, 11, 11, 12, 12, 13, 13, 14, 15, 17, 18, 22, 25, 29", reason: "The trim has to remove the smallest AND largest values, so the data must be ordered first" },
      { statement: "20% of 20 = 4, so remove the 4 smallest and 4 largest values.", reason: "Trim percentage tells you how many values to drop from EACH end" },
      { statement: "Remaining 12 values: 8, 8, 9, 11, 11, 12, 12, 13, 13, 14, 15, 17", reason: "After trimming 4 from the bottom (6,7,7,8) and 4 from the top (18,22,25,29)" },
      { statement: "Sum = 8+8+9+11+11+12+12+13+13+14+15+17 = 143", reason: "Add the 12 remaining values" },
      { statement: "Trimmed mean = 143 / 12 = 11.9167", reason: "Divide by the count of remaining values, not the original n" },
    ],
    conclusion: "The 20% trimmed mean is 11.9167 — notice it's pulled down from what the full mean would be, since the dataset's largest values (22, 25, 29) got trimmed away.",
  },
  {
    id: "stats-p3-geomean",
    label: "Geometric mean of percentage figures",
    given: "Profits earned by a construction company on four projects: 9%, 12%, 41%, 6%.",
    goal: "Find the geometric mean project profit.",
    steps: [
      { statement: "Geometric mean is used specifically because these are percentages/rates, not raw amounts.", reason: "Averaging percentage changes with an arithmetic mean can be misleading; geometric mean is the standard tool for rates" },
      { statement: "GM = ⁿ√(X₁ × X₂ × X₃ × ... × Xₙ), here n = 4", reason: "Definition of the geometric mean" },
      { statement: "GM = ⁴√(9 × 12 × 41 × 6) = ⁴√26,568", reason: "Multiply all four values together first" },
      { statement: "GM ≈ 12.767", reason: "Take the 4th root of the product" },
    ],
    conclusion: "The geometric mean profit is approximately 12.767% — note this is always ≤ the arithmetic mean, and it requires every value to be positive.",
  },
  {
    id: "stats-p3-weighted",
    label: "Weighted mean across courses with different credit units",
    given: "Scores: A=70, B=65, C=80, D=75, E=90. Credit units (weights): A=3, B=2, C=4, D=3, E=2.",
    goal: "Calculate the weighted mean of the student's scores.",
    steps: [
      { statement: "A plain average would treat every course equally — but a 4-credit course should count more than a 2-credit one.", reason: "Why a weighted mean is needed instead of a simple arithmetic mean" },
      { statement: "Weighted sum = (70×3) + (65×2) + (80×4) + (75×3) + (90×2) = 210+130+320+225+180 = 1065", reason: "Multiply each score by its own weight, then add" },
      { statement: "Total weight = 3+2+4+3+2 = 14", reason: "Add up all the weights (credit units)" },
      { statement: "Weighted mean = 1065 / 14 ≈ 76.07", reason: "Divide the weighted sum by the total weight, not by the number of courses (5)" },
    ],
    conclusion: "The weighted mean score is approximately 76.07 — higher than the simple average of 76.0 would suggest only slightly here, but the gap grows fast when weights vary more.",
  },
];

export const part4WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p4-groups",
    label: "Range, mean deviation, and variance on the same dataset",
    given: "Group 1 quiz scores: 38, 91, 45, 65, 39, 48, 78, 34, 65, 59 (n = 10, mean = 56.2).",
    goal: "Find the range, mean deviation, population variance/SD, and sample variance/SD.",
    steps: [
      { statement: "Range = highest − lowest = 91 − 34 = 57", reason: "The crudest possible spread measure — just the two extremes" },
      { statement: "Mean deviation = Σ|x − mean| / n = 154 / 10 = 15.4", reason: "Average distance from the mean, using absolute value so positive and negative deviations don't cancel out" },
      { statement: "Population variance = Σ(x − mean)² / n = 3161.6 / 10 = 316.16, so population SD = √316.16 ≈ 17.78", reason: "Squaring the deviations (instead of taking absolute value) penalizes large deviations more heavily, and makes the algebra of later statistics much cleaner" },
      { statement: "Sample variance = Σ(x − mean)² / (n−1) = 3161.6 / 9 ≈ 351.29, so sample SD ≈ 18.74", reason: "Dividing by n−1 instead of n corrects for the fact that a sample's own mean is always a slightly-too-good fit to the sample's own data" },
    ],
    conclusion: "Range 57, mean deviation 15.4, population SD ≈ 17.78, sample SD ≈ 18.74 — the sample versions are always slightly larger than the population versions on the same numbers, because dividing by a smaller number (n−1 instead of n) gives a bigger result.",
  },
  {
    id: "stats-p4-cv",
    label: "Why compare spread using the coefficient of variation",
    goal: "Explain why the coefficient of variation (CV = SD/mean × 100%) is sometimes better than comparing standard deviations directly.",
    steps: [
      { statement: "Standard deviation is measured in the SAME units as the data (dollars, cm, scores, etc.).", reason: "This makes it meaningless to directly compare an SD of 5kg to an SD of 5cm — different units entirely" },
      { statement: "Even in the same units, an SD of 10 means something very different for a dataset with mean 20 than for one with mean 2,000.", reason: "10 is huge relative to 20, but tiny relative to 2,000" },
      { statement: "CV expresses SD as a PERCENTAGE of the mean, which cancels out the units and accounts for scale.", reason: "Dividing SD by the mean makes it a pure, unit-free ratio" },
    ],
    conclusion: "The coefficient of variation is the right tool whenever you need to compare variability across datasets with different units or wildly different means — raw standard deviation alone can't do that fairly.",
  },
];
