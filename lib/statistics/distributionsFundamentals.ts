import type { BasicsGroup } from "@/lib/basics";

export const distributionsFundamentalsGroups: BasicsGroup[] = [
  {
    id: "dist-bernoulli-binomial",
    title: "Bernoulli & Binomial: counting successes in fixed trials",
    entries: [
      {
        id: "bernoulli",
        title: "The Bernoulli trial and Bernoulli distribution",
        summary: "A single trial with exactly two outcomes — success (probability p) or failure (probability q = 1−p).",
        eli5:
          "A Bernoulli trial is the simplest possible random experiment: one flip of a coin, one yes/no vote, one pass/fail test. A sequence of these — each independent, each with the SAME success probability p — is a Bernoulli process. Every other distribution in this room (Binomial, Geometric) is really just 'what happens when you repeat Bernoulli trials in a particular way' — Binomial counts successes in a FIXED number of trials, Geometric counts trials UNTIL the first success.",
        code: "p(x) = pˣ(1−p)¹⁻ˣ,  x = 0 or 1\n\nE(X) = p\nVar(X) = p(1−p)\nSD(X) = √[p(1−p)]",
        points: [
          "The four requirements for a Bernoulli process: (1) exactly two outcomes per trial, (2) constant success probability p across trials, (3) independent trials, (4) the random variable is binary (0 or 1).",
          "A fair die's 'did a 2 occur?' is a Bernoulli trial with p=1/6 — E(W)=1/6, Var(W)=(1/6)(5/6)=5/36, even though the underlying die has 6 faces.",
          "Bernoulli is the n=1 special case of the Binomial distribution — everything about Binomial can be derived by summing n independent Bernoulli trials.",
        ],
      },
      {
        id: "binomial",
        title: "The Binomial distribution: counting successes in n fixed trials",
        summary: "Models the number of successes in n independent, identical Bernoulli trials, each with success probability p.",
        eli5:
          "Binomial answers 'out of n independent yes/no trials, how many came up yes?' — tossing a coin 4 times and counting heads, testing 100 bolts and counting defectives, surveying 10 customers and counting how many use a certain card. The formula P(X=x) = nCx · pˣ(1−p)ⁿ⁻ˣ is really the multiplication principle in disguise: nCx counts WHICH x of the n trials succeeded (the arrangement), and pˣ(1−p)ⁿ⁻ˣ is the probability of any ONE specific arrangement with exactly that many successes.",
        code: "P(X = x) = nCx · pˣ(1−p)ⁿ⁻ˣ,  x = 0, 1, 2, ..., n\n\nE(X) = np\nVar(X) = np(1−p)\nSD(X) = √[np(1−p)]",
        points: [
          "All five conditions must hold: fixed number of trials n, independent trials, identical trials, exactly two outcomes per trial, and constant success probability p.",
          "4 fair coins, P(exactly 2 heads) = 4C2·(0.5)²·(0.5)² = 6×0.25×0.25 = 0.375 = 3/8 — with mean np=2 and variance np(1−p)=1.",
          "For 'at least' or 'at most' questions, it's almost always faster to use the complement: P(X≥1) = 1 − P(X=0), rather than summing many individual terms.",
        ],
      },
    ],
  },
  {
    id: "dist-poisson-geometric-uniform",
    title: "Poisson, Geometric & Discrete Uniform",
    entries: [
      {
        id: "poisson",
        title: "The Poisson distribution: counting rare events over an interval",
        summary: "Models the number of times an event occurs in a fixed interval of time, space, or volume, given a known average rate μ.",
        eli5:
          "Poisson answers a different kind of question than Binomial: not 'how many successes out of n fixed trials' but 'how many times does this event happen in a stretch of time or space, given it happens at some average rate?' Insurance claims per month, road accidents per week, typos per page — these don't have a fixed 'n' the way coin flips do, but they do have a known average rate μ, and that's all Poisson needs.",
        code: "P(X = x) = (μˣ·e⁻ᵘ) / x!,  x = 0, 1, 2, ...\n\nE(X) = μ\nVar(X) = μ         (mean and variance are EQUAL for Poisson — a distinctive signature)",
        points: [
          "μ must be rescaled to match the interval in the question: 'one power surge every 12 hours' becomes μ=2 for a 24-hour period, not μ=1.",
          "Poisson's mean and variance are always identical (both equal μ) — this is a quick sanity check and a distinctive fingerprint of the distribution.",
          "The Poisson distribution is often used as a convenient APPROXIMATION to the Binomial when n is large and p is small (many trials, rare individual success) — the same 'rare event over many opportunities' intuition applies to both.",
        ],
      },
      {
        id: "geometric",
        title: "The Geometric distribution: waiting for the first success",
        summary: "Models the number of trials needed to get the FIRST success in a sequence of independent Bernoulli trials.",
        eli5:
          "Geometric answers 'how many attempts until the first success?' — how many pregnancies until the first boy, how many wells drilled until the first successful strike, how many items inspected until the first defective one is found. There are two equally common versions: counting the trial ON WHICH the first success happens (starts at x=1), or counting the number of FAILURES before it (starts at x=0) — always check which one a problem is asking for.",
        code: "Version 1 — trials until first success (x = 1,2,3,...):\n  P(X = x) = p(1−p)ˣ⁻¹\n  E(X) = 1/p          Var(X) = (1−p)/p²\n\nVersion 2 — failures before first success (x = 0,1,2,...):\n  P(X = x) = p(1−p)ˣ\n  E(X) = (1−p)/p       Var(X) = (1−p)/p²\n\nLack-of-memory property: P(X > s+t | X > s) = P(X > t)",
        points: [
          "10% of items are defective, draw until you find one — P(X<4) = P(1)+P(2)+P(3) = 0.1(0.9⁰+0.9¹+0.9²) = 0.271, using version 1 (trials until success).",
          "The lack-of-memory property is unique to the Geometric distribution among the ones in this room: knowing you've already failed s times tells you NOTHING about how many more trials remain — the 'clock resets' after every failure.",
          "P(X > x) = qˣ (where q=1−p) is a useful shortcut for 'more than x trials needed' questions — no need to sum the PMF term by term.",
        ],
      },
      {
        id: "discrete-uniform",
        title: "The Discrete Uniform distribution: every outcome equally likely",
        summary: "A finite set of values where every outcome has the exact same probability, f(x) = 1/n.",
        eli5:
          "This is the simplest distribution of all — no shape, no skew, every single possible outcome is exactly as likely as every other one. A fair die roll, a coin toss, drawing one card's suit from a deck — anywhere 'equally likely' is stated outright, this is the distribution at work.",
        code: "f(xᵢ) = 1/n,  for each of the n values x₁, x₂, ..., xₙ\n\nFor consecutive integers a, a+1, ..., b:\n  E(X) = (a+b)/2\n  Var(X) = [(b−a+1)² − 1] / 12",
        points: [
          "X uniform on integers 0 through 9: E(X) = (0+9)/2 = 4.5, Var(X) = (10²−1)/12 = 8.25.",
          "For a linear transformation Y = 5X, use the same linearity rules as any other random variable: E(Y) = 5E(X) = 22.5, Var(Y) = 5²Var(X) = 25×8.25 = 206.25, SD(Y) ≈ 14.36.",
          "Discrete Uniform is the 'null model' of fairness — whenever a problem says a die, coin, or card draw is FAIR, that's shorthand for 'discrete uniform on the possible outcomes'.",
        ],
      },
    ],
  },
];
