import type { BasicsGroup } from "@/lib/basics";

export const randomVariablesFundamentalsGroups: BasicsGroup[] = [
  {
    id: "rv-discrete",
    title: "Discrete random variables & the probability mass function",
    entries: [
      {
        id: "random-variable-definition",
        title: "A random variable turns outcomes into numbers",
        summary: "A random variable is a function that assigns a real number to every outcome in a sample space.",
        eli5:
          "A sample space is full of messy, non-numeric outcomes — like {HHH, HHT, HTH, ...} for three coin tosses. A random variable is a rule that converts each of those outcomes into a plain number you can actually do arithmetic on. Define X = 'number of heads' for three coin tosses, and suddenly instead of juggling 8 raw outcomes you're just working with X ∈ {0,1,2,3} — with clean probabilities P(X=0)=1/8, P(X=1)=3/8, P(X=2)=3/8, P(X=3)=1/8.",
        code: "X = number of heads in 3 coin tosses\nP(X=0) = P{TTT} = 1/8\nP(X=1) = P{TTH,THT,HTT} = 3/8\nP(X=2) = P{THH,HTH,HHT} = 3/8\nP(X=3) = P{HHH} = 1/8",
        points: [
          "Uppercase X denotes the random variable itself (the rule); lowercase x denotes one specific possible value it can take.",
          "The same experiment can have many different random variables defined on it — X = 'number of heads' and Y = 'longest run of heads' are both valid, different random variables on the same 3-coin-toss sample space.",
          "Every probability question about X ultimately traces back to a probability question about the underlying sample space outcomes it was built from.",
        ],
      },
      {
        id: "pmf",
        title: "The probability mass function (PMF): the rulebook for a discrete random variable",
        summary: "A function f(x) is a valid PMF if f(x) ≥ 0 for every x, and the probabilities over all possible x sum to exactly 1.",
        eli5:
          "A PMF is just a lookup table (or formula) giving the probability of every single value the random variable can take. For it to be a LEGITIMATE probability rule, two things must hold: no negative probabilities (you can't have a −20% chance of anything), and everything must add up to exactly 100% — because SOME value must occur.",
        code: "Valid PMF requires:\n  f(x) ≥ 0  for every x\n  Σ f(x) = 1  (summed over all possible x)\n\nAlso written p(x) or P(X = x) — same idea, different notation.",
        points: [
          "To check whether a candidate function is a valid PMF, plug in every possible x, confirm each value is ≥ 0, then add them all up and confirm the total is exactly 1.",
          "If a PMF has an unknown constant (like f(x)=k, 2k, k for x=1,2,3), solve for it by setting the sum of all probabilities equal to 1 — this is almost always the very first step.",
          "Once the PMF is known, P(X ≤ a) is found by simply adding up f(x) for every x that satisfies x ≤ a — no separate formula needed, just careful bookkeeping.",
        ],
      },
      {
        id: "discrete-expectation-variance",
        title: "Expected value and variance of a discrete random variable",
        summary: "E(X) = Σ x·f(x) is the long-run average; Var(X) = E(X²) − [E(X)]² measures spread around that average.",
        eli5:
          "E(X) — the expected value — is a weighted average where each possible value of X is weighted by how likely it is. It's not necessarily a value X can even take (the expected number on a fair die is 3.5, even though you can never actually roll a 3.5) — it's the long-run average if you repeated the experiment forever. Variance measures how spread out X's actual outcomes tend to be around that average; the 'shortcut' formula E(X²) − [E(X)]² is almost always faster than working directly with squared deviations.",
        code: "E(X) = Σ x·f(x)                    (the mean)\nE(X²) = Σ x²·f(x)\nVar(X) = E(X²) − [E(X)]²            (the shortcut formula)\nSD(X) = √Var(X)\n\nLinearity rules (a = constant):\n  E(aX) = a·E(X)         E(X+a) = E(X)+a\n  Var(aX) = a²·Var(X)     Var(X+a) = Var(X)   (adding a constant never changes spread)",
        points: [
          "Var(X+a) = Var(X) makes intuitive sense: shifting every outcome by the same constant a doesn't change how SPREAD OUT they are relative to each other.",
          "Var(aX) = a²Var(X) — scaling squares the effect on variance, because variance itself is built from SQUARED deviations.",
          "Var(a) = 0 for any constant a: a constant has zero variability by definition — it's the same value every single time.",
        ],
      },
    ],
  },
  {
    id: "rv-continuous",
    title: "Continuous random variables: probability as area",
    entries: [
      {
        id: "pdf",
        title: "The probability density function (PDF): area under the curve is probability",
        summary: "For a continuous random variable, probabilities come from the AREA under f(x), not the height of f(x) at a single point.",
        eli5:
          "A discrete PMF gives you probability directly: f(x) IS P(X=x). A continuous PDF does NOT work that way — f(x) is a density, and you only get an actual probability by finding the AREA under the curve between two bounds, P(a<X<b) = ∫ₐᵇ f(x)dx. This is exactly why P(X = any single exact point) is always 0 for a continuous variable: the 'area' of a single point (zero width) is always zero, no matter how tall the curve is there.",
        code: "Requirements for a valid PDF:\n  f(x) ≥ 0 for all real x\n  ∫₋∞^∞ f(x) dx = 1        (total area under the curve = 1)\n  P(a < X < b) = ∫ₐᵇ f(x) dx\n\nNote: P(X = a) = 0 for every single point a — probability only\nlives in AREAS, never in isolated points.",
        points: [
          "Because P(X=a)=0 always, it makes no difference whether you write P(a<X<b), P(a≤X<b), P(a<X≤b), or P(a≤X≤b) for a continuous random variable — they're all exactly equal.",
          "If a PDF has an unknown constant c, solve for it the same way as a discrete PMF: set the total area (the integral over the whole domain) equal to 1, then solve.",
          "A PDF value f(x) can be greater than 1 — it's a DENSITY, not a probability itself, so there's no upper bound of 1 the way there is for f(x) in a PMF.",
        ],
      },
      {
        id: "cdf",
        title: "The cumulative distribution function (CDF): running total of probability",
        summary: "F(x) = P(X ≤ x) is the probability accumulated from −∞ up to x; its derivative gives back the PDF.",
        eli5:
          "If the PDF is a hill of probability density, the CDF is the running tally of how much area you've swept up as you walk from left to right under that hill. F(x) always starts at 0 (nothing accumulated yet, far to the left) and ends at 1 (everything accumulated, far to the right) — and because you can only ever ADD more area moving right, F(x) can never decrease.",
        code: "F(x) = P(X ≤ x) = ∫₋∞ˣ f(t) dt\n\nP(a < X < b) = F(b) − F(a)\n\nd/dx F(x) = f(x)      (the CDF's slope gives back the PDF)",
        points: [
          "F(b) − F(a) is often the fastest way to compute P(a<X<b) once you already have a formula for F(x) — no need to re-integrate the PDF each time.",
          "The CDF is always non-decreasing: F(x₁) ≤ F(x₂) whenever x₁ ≤ x₂, since probability only accumulates as x grows.",
          "Differentiating the CDF recovers the original PDF — CDF and PDF are two views of exactly the same information, related by integration and differentiation.",
        ],
      },
      {
        id: "continuous-expectation-variance",
        title: "Expected value and variance of a continuous random variable",
        summary: "Sums become integrals: E(X) = ∫x·f(x)dx and Var(X) = E(X²) − [E(X)]², exactly mirroring the discrete formulas.",
        eli5:
          "Nothing conceptually changes moving from discrete to continuous — E(X) is still 'every possible value, weighted by how likely it is' — the only difference is that a continuous variable has infinitely many possible values packed into intervals, so the weighted sum (Σ) naturally becomes a weighted integral (∫).",
        code: "E(X) = ∫₋∞^∞ x·f(x) dx\nE(X²) = ∫₋∞^∞ x²·f(x) dx\nVar(X) = E(X²) − [E(X)]²",
        points: [
          "The exact same shortcut formula Var(X) = E(X²) − [E(X)]² applies to continuous random variables — only the method of computing E(X) and E(X²) changes (integration instead of summation).",
          "The same linearity rules (E(aX+b) = aE(X)+b, Var(aX+b) = a²Var(X)) hold for continuous random variables too — these properties don't depend on discreteness at all.",
        ],
      },
    ],
  },
];
