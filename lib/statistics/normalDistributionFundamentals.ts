import type { BasicsGroup } from "@/lib/basics";

export const normalDistributionFundamentalsGroups: BasicsGroup[] = [
  {
    id: "continuous-uniform-exponential",
    title: "Continuous Uniform & Exponential: two more named continuous shapes",
    entries: [
      {
        id: "continuous-uniform",
        title: "The Continuous Uniform distribution",
        summary: "A flat probability density between two points a and b — every equally-sized sub-interval is equally likely.",
        eli5:
          "If buses arrive exactly every 20 minutes and you show up at a random moment, your waiting time is equally likely to be anywhere from 0 to 20 minutes — no value in that range is more likely than any other. That flat, uniform 'no favorite value' shape is exactly what the continuous uniform distribution describes, and it's the direct continuous cousin of the discrete uniform distribution (a fair die) you already met.",
        code: "f(x) = 1/(b−a),  a ≤ x ≤ b\nF(x) = (x−a)/(b−a),  a ≤ x ≤ b\n\nE(X) = (a+b)/2\nVar(X) = (b−a)²/12",
        points: [
          "Bus waiting time over [0,20]: E(X)=10 minutes, Var(X)=(20)²/12≈33.33, SD(X)≈5.77 minutes.",
          "P(a<X<x) is always just (x−a)/(b−a) — the fraction of the interval's total width that's been covered, since the density is flat.",
          "Try the 'Discrete Uniform' preset in the Distribution Explorer above and the uniform preset in the Continuous RV Explorer in Part 11 to compare the discrete and continuous versions side by side.",
        ],
      },
      {
        id: "exponential",
        title: "The Exponential distribution",
        summary: "Models waiting time or time-between-events in a Poisson process — right-skewed, with a long tail.",
        eli5:
          "If events happen at random following a Poisson process (customer arrivals, machine failures, insurance claims), the GAP between consecutive events follows an Exponential distribution. It's right-skewed: short waits are most common, but long waits — while rare — are always possible, giving the curve a long tail stretching to the right.",
        code: "f(x) = (1/θ)e^(−x/θ),  x > 0        [θ = mean waiting time]\nF(x) = 1 − e^(−x/θ)\n\nUsing rate λ = 1/θ:\nf(x) = λe^(−λx)\nF(x) = 1 − e^(−λx)\n\nE(X) = θ = 1/λ\nVar(X) = θ² = 1/λ²",
        points: [
          "Mean waiting time θ=10: P(X>10) = e⁻¹ ≈ 0.3679, P(X>30) = e⁻³ ≈ 0.0498 — the probability of a long wait shrinks fast but never hits exactly zero.",
          "To find an x such that P(X<x)=0.95, solve 1−e^(−x/θ)=0.95 for x — this is exactly how percentiles are found for any distribution once you have its CDF.",
          "Poisson (counts events per interval) and Exponential (measures the GAP between events) are two sides of the same coin — literally derived from the same underlying random process.",
        ],
      },
    ],
  },
  {
    id: "normal-distribution",
    title: "The Normal distribution: the single most important shape in statistics",
    entries: [
      {
        id: "normal-properties",
        title: "Properties of the Normal distribution",
        summary: "Bell-shaped, symmetric about the mean, with mean = median = mode, and total area under the curve always equal to 1.",
        eli5:
          "The normal distribution is the famous 'bell curve' — and it earns the name 'the most important distribution in statistics' because so many real-world measurements (heights, exam scores, measurement errors) cluster this way: most values near the middle, tapering off symmetrically in both directions. Its shape is completely determined by just two numbers: the mean μ (where the peak sits) and the standard deviation σ (how wide or narrow the bell is).",
        code: "X ~ N(μ, σ²)\n\nf(x) = [1/(σ√(2π))] · e^(−(x−μ)²/(2σ²)),  −∞ < x < ∞",
        points: [
          "Mean, median, and mode all coincide at the exact center of a normal curve — a direct consequence of perfect symmetry.",
          "The curve is unimodal (one peak), continuous, and never actually touches the x-axis, no matter how far out you go.",
          "This is exactly the same bell shape behind the Empirical Rule (68-95-99.7%) from Part 7 — the Empirical Rule is really just a normal-distribution fact stated without needing z-scores.",
        ],
      },
      {
        id: "standard-normal-zscore",
        title: "The standard normal distribution and the z-score transform",
        summary: "Any normal random variable X can be converted to the standard normal Z = (X−μ)/σ, with mean 0 and SD 1.",
        eli5:
          "There are infinitely many different normal curves — one for every possible (μ,σ) pair — which would need infinitely many probability tables. The z-score transform solves this: it recenters and rescales ANY normal variable into one universal 'standard' version, Z ~ N(0,1), so a single table (or one calculator) can answer probability questions for every normal distribution that exists.",
        code: "Z = (X − μ) / σ         [converts X ~ N(μ,σ²) to Z ~ N(0,1)]\n\nΦ(z) = P(Z ≤ z)          [the standard normal CDF, read from a table or computed]\n\nΦ(−k) = 1 − Φ(k)\nP(Z > k) = 1 − Φ(k)\nP(−k ≤ Z ≤ k) = 2Φ(k) − 1",
        points: [
          "A z-score tells you how many standard deviations a value sits above (positive) or below (negative) the mean — a universal 'how unusual is this?' measurement.",
          "Symmetry means P(Z < −k) always equals P(Z > k) — you never need a table of negative z-values, just flip the sign and use the complement.",
          "The exact same z-score idea already appeared in Part 6 (measures of shape) and Part 7 (the Empirical Rule) — the Normal distribution is where that idea gets its full, precise computational power.",
        ],
      },
      {
        id: "normal-probability-computation",
        title: "Computing probabilities: turn X into Z, then read the area",
        summary: "P(a < X < b) = Φ(zᵦ) − Φ(zₐ), where zₐ and zᵦ are the z-scores of a and b.",
        eli5:
          "Once you convert both endpoints of a range into z-scores, the whole problem becomes a lookup: 'what's the area under the standard normal curve between these two z-values?' — which is exactly Φ(bigger z) minus Φ(smaller z). This three-step pattern (standardize → look up → subtract) solves virtually every normal-distribution probability question.",
        code: "1. Convert: zₐ = (a−μ)/σ,  zᵦ = (b−μ)/σ\n2. Look up: Φ(zₐ), Φ(zᵦ)\n3. Subtract: P(a<X<b) = Φ(zᵦ) − Φ(zₐ)\n\nFor a single tail:\nP(X > b) = 1 − Φ(zᵦ)\nP(X < a) = Φ(zₐ)",
        points: [
          "μ=40.5, σ=5.5: P(X>48.75) → z=1.5 → P(Z>1.5)=1−0.9332=0.0668.",
          "μ=40.5, σ=5.5: P(X<35) → z=−1.0 → by symmetry P(Z<−1.0)=P(Z>1.0)=1−0.8413=0.1587.",
          "Working BACKWARD (given a probability, find x) just reverses the steps: look up the z-value for the target probability first, then convert back with x = μ + zσ.",
        ],
      },
    ],
  },
  {
    id: "normal-approx-binomial",
    title: "The Normal Approximation to the Binomial distribution",
    entries: [
      {
        id: "why-approximate",
        title: "Why approximate the Binomial with the Normal?",
        summary: "When n is large, computing exact binomial probabilities term-by-term becomes impractical — the normal curve gives an accurate shortcut.",
        eli5:
          "Calculating P(X=75) directly from the binomial formula with n=150 would mean computing 150C75 — an enormous, unwieldy number. But when n is large enough, a binomial distribution's histogram starts looking almost exactly like a smooth bell curve — so instead of the exact (but painful) binomial formula, you can use the normal distribution as a very close, much easier approximation.",
        code: "Conditions to use the approximation:\n  np > 5   AND   nq > 5     (q = 1−p)\n\nMatching normal parameters:\n  μ = np\n  σ = √(npq)",
        points: [
          "Both conditions (np>5 AND nq>5) must hold — they ensure the binomial distribution is symmetric enough for a bell curve to be a good match.",
          "n=150, p=0.5: np=75>5 and nq=75>5 ✓ — comfortably satisfies both conditions.",
          "The more extreme p is (very close to 0 or 1) or the smaller n is, the worse the normal approximation becomes — always check the conditions before trusting it.",
        ],
      },
      {
        id: "continuity-correction",
        title: "The continuity correction: bridging discrete and continuous",
        summary: "Since Binomial is discrete but Normal is continuous, extend each whole-number boundary by 0.5 in the appropriate direction before converting to Z.",
        eli5:
          "A discrete variable can only be exactly 75 — there's no 'area' at a single point to measure the way a continuous curve needs. The continuity correction papers over this mismatch by treating the whole number 75 as if it occupies the little continuous interval from 74.5 to 75.5, so the normal curve has an actual region to measure area over.",
        code: "For P(X = k):    use P(k−0.5 < X < k+0.5)\nFor P(X ≤ k):    use P(X < k+0.5)\nFor P(X ≥ k):    use P(X > k−0.5)\nFor P(X < k):    use P(X < k−0.5)\nFor P(X > k):    use P(X > k+0.5)",
        points: [
          "Forgetting the continuity correction is the single most common mistake when approximating a Binomial with a Normal — always widen (for ≤, ≥, =) or shift (for <, >) by exactly 0.5 first.",
          "A useful memory trick: '≤ and ≥ include the boundary, so push OUTWARD past it by 0.5; < and > exclude the boundary, so push INWARD past it by 0.5' — matching which side of k you actually want counted.",
          "150 coin tosses, P(X=75): continuity-corrected to P(74.5<X<75.5), giving z-scores of ±0.08 and a final probability ≈0.0638 — try this exact example in the Normal Approximation calculator above.",
        ],
      },
    ],
  },
];
