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
