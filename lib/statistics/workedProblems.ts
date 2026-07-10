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
  {
    id: "stats-p3-tut2-q1",
    label: "Every measure of central tendency on one quiz-score dataset",
    given: "Scores obtained by 10 students in a class quiz: 12, 15, 12, 18, 20, 22, 15, 12, 25, 30.",
    goal: "Find the arithmetic mean, 10% trimmed mean, geometric mean, mode, and median.",
    steps: [
      { statement: "Sum = 12+15+12+18+20+22+15+12+25+30 = 181, so the arithmetic mean = 181/10 = 18.1.", reason: "Plain average of all 10 values" },
      { statement: "Sort the data: 12, 12, 12, 15, 15, 18, 20, 22, 25, 30. 10% of 10 = 1, so drop the 1 smallest (12) and 1 largest (30).", reason: "10% trimmed mean removes the most extreme value from each end before averaging" },
      { statement: "Remaining 8 values: 12, 12, 15, 15, 18, 20, 22, 25, summing to 139. Trimmed mean = 139/8 = 17.375.", reason: "Average only the values that survived trimming" },
      { statement: "Geometric mean = ¹⁰√(12×15×12×18×20×22×15×12×25×30) = ¹⁰√(2,309,472,000,000) ≈ 17.23.", reason: "Multiply all 10 values, then take the 10th root — always ≤ the arithmetic mean" },
      { statement: "12 appears 3 times — more than any other value — so the mode = 12.", reason: "Most frequently occurring value" },
      { statement: "With n=10 (even), the median is the average of the 5th and 6th sorted values: (15+18)/2 = 16.5.", reason: "Even-sized datasets average the two middle values" },
    ],
    conclusion: "Mean = 18.1, 10% trimmed mean = 17.375, geometric mean ≈ 17.23, mode = 12, median = 16.5 — try this exact dataset in the Central Tendency Calculator above (it's the default input) to see every step computed live.",
  },
  {
    id: "stats-p3-tut2-q3",
    label: "Modal class, mode, and median from a grouped Statistics test",
    given:
      "Marks of 40 students, grouped: 1-5:3, 6-10:6, 11-15:10, 16-20:12, 21-25:7, 26-30:2 (cumulative frequencies 3, 9, 19, 31, 38, 40).",
    goal: "Determine the modal class, the mode, and the median.",
    steps: [
      { statement: "The class 16-20 has the highest frequency (12), so it is the modal class.", reason: "The modal class is simply the class with the largest frequency" },
      { statement: "Mode = L + [Δ1/(Δ1+Δ2)] × c, where L=15.5 (lower boundary of 16-20), Δ1=12−10=2 (vs. the preceding class 11-15), Δ2=12−7=5 (vs. the succeeding class 21-25), c=5.", reason: "Set up the grouped-data mode formula's four ingredients" },
      { statement: "Mode = 15.5 + [2/(2+5)] × 5 = 15.5 + 1.4286 ≈ 16.93.", reason: "Substitute and compute" },
      { statement: "For the median, locate the n/2 = 20th position: cumulative frequency first reaches 20 in the class 16-20 (cum. freq. 31), with the previous cumulative frequency 19 (from 11-15).", reason: "Find which class contains the middle observation" },
      { statement: "Median = L + (c/f)(n/2 − F) = 15.5 + (5/12)(20−19) = 15.5 + 0.4167 ≈ 15.92.", reason: "Same interpolation formula used for percentiles, just targeting the 50% position" },
    ],
    conclusion: "Modal class = 16-20, mode ≈ 16.93, median ≈ 15.92 — this is the same L + (c/f)(target − F) pattern used for percentiles, just applied to find the middle of the data instead of an arbitrary percentile.",
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

export const part5WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p5-percentiles",
    label: "Percentiles from a grouped frequency table",
    given:
      "Length (mm) frequency table: 118-126:3, 127-135:5, 136-144:9, 145-153:12, 154-162:5, 163-171:4, 172-180:2 (n = 40, cumulative frequencies 3,8,17,29,34,38,40).",
    goal: "Find the 10th, 45th, and 90th percentiles.",
    steps: [
      { statement: "P10: n×k = 40×0.10 = 4. The class where cumulative frequency first reaches 4 is 127-135 (cum. freq. 8, previous cum. freq. 3).", reason: "Find which class contains the target rank" },
      { statement: "P10 = 126.5 + (9/5)(4−3) = 126.5 + 1.8 = 128.3", reason: "l=126.5 (boundary), c=9 (width), f=5 (class frequency), F=3 (previous cumulative frequency)" },
      { statement: "P45: n×k = 40×0.45 = 18. Falls in class 145-153 (cum. freq. 29, previous cum. freq. 17).", reason: "Find the class for the 45th percentile" },
      { statement: "P45 = 144.5 + (9/12)(18−17) = 144.5 + 0.75 = 145.25", reason: "Apply the same interpolation formula" },
      { statement: "P90: n×k = 40×0.90 = 36. Falls in class 163-171 (cum. freq. 38, previous cum. freq. 34).", reason: "Find the class for the 90th percentile" },
      { statement: "P90 = 162.5 + (9/4)(36−34) = 162.5 + 4.5 = 167", reason: "Apply the same interpolation formula" },
    ],
    conclusion: "P10 = 128.3, P45 = 145.25, P90 = 167 — try these exact percentiles in the calculator above (grouped mode) to see the same values.",
  },
];

export const part6WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p6-skewness",
    label: "Skewness of hospital cancer-ward stay lengths",
    given: "Mean length of stay = 28 days, median = 25 days, mode = 23 days, standard deviation = 4.2 days.",
    goal: "Compute the coefficient of skewness and interpret it.",
    steps: [
      { statement: "Sk = 3(mean − median) / SD", reason: "Pearson's coefficient of skewness formula" },
      { statement: "Sk = 3(28 − 25) / 4.2 = 3(3) / 4.2 = 9 / 4.2", reason: "Substitute the given values" },
      { statement: "Sk ≈ 2.14", reason: "Divide" },
      { statement: "Since mean (28) > median (25) > mode (23), and Sk is positive, the tail stretches to the right.", reason: "Cross-check the sign against the mean/median/mode ordering" },
    ],
    conclusion: "Sk ≈ 2.14 — a positively skewed distribution. Most patients had shorter stays, but a few very long stays pulled the mean up above the median.",
  },
  {
    id: "stats-p6-boxplot",
    label: "Reading a boxplot",
    goal: "Explain what a boxplot's median position and whisker lengths reveal about skew.",
    steps: [
      { statement: "If the median sits near the center of the box, and both whiskers are similar lengths, the distribution is roughly symmetric.", reason: "Symmetric data has roughly equal spread above and below its center" },
      { statement: "If the median falls left of the box's center, OR the right whisker is longer than the left, the distribution is positively skewed.", reason: "A right-stretching tail pulls both the box's upper edge and the right whisker further out" },
      { statement: "If the median falls right of the box's center, OR the left whisker is longer than the right, the distribution is negatively skewed.", reason: "Mirror image of the positive-skew case" },
    ],
    conclusion: "A boxplot lets you diagnose skew visually in seconds, without computing any coefficient — exactly what Exploratory Data Analysis is for.",
  },
];

export const part7WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p7-food",
    label: "The Empirical Rule applied to food expenditure",
    given: "Monthly food expenditure for seniors living alone is symmetric and bell-shaped, with mean $150 and standard deviation $20.",
    goal: "Find the range covering about 68%, about 95%, and almost all of the monthly expenditure.",
    steps: [
      { statement: "68% falls within ±1 SD: $150 − $20 = $130 to $150 + $20 = $170.", reason: "The Empirical Rule's first band" },
      { statement: "95% falls within ±2 SD: $150 − $40 = $110 to $150 + $40 = $190.", reason: "The Empirical Rule's second band" },
      { statement: "99.7% (almost all) falls within ±3 SD: $150 − $60 = $90 to $150 + $60 = $210.", reason: "The Empirical Rule's third band" },
    ],
    conclusion: "About 68% spend between $130-$170, about 95% between $110-$190, and virtually everyone between $90-$210 — try these exact numbers in the Empirical Rule Explorer above.",
  },
  {
    id: "stats-p7-heights",
    label: "Verifying the Empirical Rule on 100 real adult male heights",
    given: "100 randomly selected adult men, mean height 69.92 inches, standard deviation 1.70 inches.",
    goal: "Explain what the Empirical Rule predicts, and why counting the actual data confirms it.",
    steps: [
      { statement: "±1 SD range: 69.92 − 1.70 = 68.22 to 69.92 + 1.70 = 71.62 inches. The rule predicts ~68 of the 100 men should fall in this range.", reason: "Apply the 68% band to this specific dataset" },
      { statement: "Counting the actual 100 heights that fall between 68.22 and 71.62 gives exactly 69 — almost exactly the predicted 68.", reason: "The Empirical Rule is a close approximation for real bell-shaped data, not just an abstract theoretical claim" },
      { statement: "±2 SD range: 66.52 to 73.32 inches. The rule predicts ~95; the actual count is 95 — an exact match.", reason: "Apply the 95% band" },
      { statement: "±3 SD range: 64.82 to 75.02 inches. All 100 measurements fall inside this range, matching the 'almost all' (99.7%) prediction.", reason: "Apply the 99.7% band" },
    ],
    conclusion: "This is exactly why the rule is trusted in practice — real, roughly-bell-shaped data reliably lands close to the theoretical 68/95/99.7% predictions.",
  },
];

export const part9WorkedProblems: WorkedProblem[] = [
  {
    id: "stats-p9-discrete-dist",
    label: "Reading probabilities straight off a distribution table",
    given: "A discrete variable E has P(E=1)=0.05, P(E=2)=0.25, P(E=3)=0.3, P(E=4)=0.15, P(E=5)=0.25.",
    goal: "Find P(E ≥ 2), P(1 ≤ E < 5), and P(E ≥ 3).",
    steps: [
      { statement: "P(E ≥ 2) = P(E=2) + P(E=3) + P(E=4) + P(E=5) = 0.25 + 0.3 + 0.15 + 0.25 = 0.95", reason: "Sum every outcome that satisfies the condition — the axioms guarantee mutually exclusive outcomes just add" },
      { statement: "P(1 ≤ E < 5) = P(E=1) + P(E=2) + P(E=3) + P(E=4) = 0.05 + 0.25 + 0.3 + 0.15 = 0.75", reason: "E < 5 excludes E = 5, so only four of the five outcomes qualify" },
      { statement: "P(E ≥ 3) = P(E=3) + P(E=4) + P(E=5) = 0.3 + 0.15 + 0.25 = 0.7", reason: "Same technique, different qualifying set" },
    ],
    conclusion: "P(E≥2) = 0.95, P(1≤E<5) = 0.75, P(E≥3) = 0.7 — whenever outcomes are mutually exclusive, 'probability of a condition' is just 'add up every row that satisfies it.'",
  },
  {
    id: "stats-p9-set-ops",
    label: "Union, intersection, and complements from two overlapping events",
    given: "Events A and B with P(A) = 0.4, P(B) = 0.5, and P(A ∩ B) = 0.2.",
    goal: "Find P(A ∪ B), P(A ∩ B′), P(A′ ∩ B), and P(A′ ∩ B′).",
    steps: [
      { statement: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0.4 + 0.5 − 0.2 = 0.7", reason: "The overlap is counted in both P(A) and P(B), so it must be subtracted once to avoid double-counting" },
      { statement: "P(A ∩ B′) = P(A) − P(A ∩ B) = 0.4 − 0.2 = 0.2", reason: "'In A but not B' is everything in A minus the part that's also in B" },
      { statement: "P(A′ ∩ B) = P(B) − P(A ∩ B) = 0.5 − 0.2 = 0.3", reason: "Mirror image: 'in B but not A'" },
      { statement: "P(A′ ∩ B′) = 1 − P(A ∪ B) = 1 − 0.7 = 0.3", reason: "By De Morgan's Law, 'neither A nor B' is the complement of 'A or B'" },
    ],
    conclusion: "P(A∪B) = 0.7, P(A∩B′) = 0.2, P(A′∩B) = 0.3, P(A′∩B′) = 0.3 — try these exact numbers in the Probability Rules Calculator above (it's the default input).",
  },
  {
    id: "stats-p9-conditional",
    label: "Conditional probability by shrinking the sample space",
    given:
      "A number is picked from S = {2,3,4,5,6,7,8,9}. A: the number is odd. B: the number is a multiple of 3.",
    goal: "Find P(B), P(A and B), and P(B | A).",
    steps: [
      { statement: "B = {3, 6, 9}, so P(B) = 3/8 = 0.375.", reason: "3 of the 8 equally likely outcomes are multiples of 3" },
      { statement: "A = {3, 5, 7, 9}. A ∩ B = {3, 5, 7, 9} ∩ {3, 6, 9} = {3, 9}, so P(A and B) = 2/8 = 0.25.", reason: "Only 3 and 9 are odd AND a multiple of 3" },
      { statement: "P(B | A) = P(A and B) / P(A) = 0.25 / 0.5 = 0.5", reason: "P(A) = 4/8 = 0.5, since 4 of the 8 outcomes are odd" },
    ],
    conclusion: "P(B) = 0.375, P(A and B) = 0.25, P(B|A) = 0.5 — notice P(B|A) = 0.5 is bigger than P(B) = 0.375: knowing the number is odd genuinely raises the chance it's also a multiple of 3, because half of the odd numbers here (3 and 9) happen to be multiples of 3.",
  },
  {
    id: "stats-p9-total-probability",
    label: "Total Probability Rule: overall defect rate across three machines",
    given:
      "Machines A, B, C make 30%, 45%, 25% of a plant's products. 2% of A's output, 3% of B's, and 2% of C's are defective.",
    goal: "Find the overall probability that a randomly selected finished product is defective.",
    steps: [
      { statement: "Let A1, A2, A3 = 'made by machine A/B/C' and D = 'defective.' P(A1)=0.3, P(A2)=0.45, P(A3)=0.25, P(D|A1)=0.02, P(D|A2)=0.03, P(D|A3)=0.02.", reason: "Name every piece before combining them — A1, A2, A3 partition the whole output" },
      { statement: "P(D) = P(D|A1)P(A1) + P(D|A2)P(A2) + P(D|A3)P(A3)", reason: "Total Probability Rule: weight each machine's own defect rate by how much of the total output it makes" },
      { statement: "P(D) = (0.02)(0.3) + (0.03)(0.45) + (0.02)(0.25) = 0.006 + 0.0135 + 0.005 = 0.0245", reason: "Substitute and add" },
    ],
    conclusion: "P(D) = 0.0245 — about 2.45% of all finished products are defective, even though no single machine's own defect rate is anywhere near that shape; it's a weighted blend of all three.",
  },
  {
    id: "stats-p9-bayes",
    label: "Bayes' Theorem: which agency did the bad-tyre car come from?",
    given:
      "A firm rents 30% of cars from agency A, 20% from B, 50% from C. 15% of A's cars, 10% of B's, and 6% of C's have bad tyres. A rented car is found to have bad tyres.",
    goal: "Find P(came from C), P(came from A), P(came from B), and the overall P(bad tyres).",
    steps: [
      { statement: "Let A1, A2, A3 = 'from agency A/B/C' and T = 'has bad tyres.' P(A1)=0.3, P(A2)=0.2, P(A3)=0.5, P(T|A1)=0.15, P(T|A2)=0.1, P(T|A3)=0.06.", reason: "Same setup as Total Probability, but now the question runs BACKWARD from an observed effect (T) to its cause" },
      { statement: "P(T) = (0.15)(0.3) + (0.1)(0.2) + (0.06)(0.5) = 0.045 + 0.02 + 0.03 = 0.095", reason: "First compute the overall rate — this becomes Bayes' denominator" },
      { statement: "P(A3 | T) = P(T|A3)P(A3) / P(T) = (0.06 × 0.5) / 0.095 = 0.03 / 0.095 ≈ 0.3158", reason: "Bayes' Theorem: this specific slice of T, divided by all of T" },
      { statement: "P(A1 | T) = (0.15 × 0.3) / 0.095 = 0.045 / 0.095 ≈ 0.4737", reason: "Same formula, agency A's slice" },
      { statement: "P(A2 | T) = (0.1 × 0.2) / 0.095 = 0.02 / 0.095 ≈ 0.2105", reason: "Same formula, agency B's slice" },
    ],
    conclusion: "P(T) = 0.095. Given the bad tyres, P(A1|T) ≈ 0.4737, P(A2|T) ≈ 0.2105, P(A3|T) ≈ 0.3158 — notice these three posteriors sum to exactly 1, and agency A (the highest defect RATE at 15%) is now the most likely source, even though agency C rents out the most cars overall. Try this exact example in the Bayes' Theorem Calculator above.",
  },
];
