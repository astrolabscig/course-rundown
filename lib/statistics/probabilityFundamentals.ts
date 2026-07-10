import type { BasicsGroup } from "@/lib/basics";

export const probabilityFundamentalsGroups: BasicsGroup[] = [
  {
    id: "probability-foundations",
    title: "Experiments, sample spaces, and events",
    entries: [
      {
        id: "experiment-trial-outcome",
        title: "Experiment, trial, and outcome",
        summary: "A random experiment can come out differently even when repeated the same way; a trial is one run of it.",
        eli5:
          "Nothing in life is certain — probability is the tool for putting a number on 'how likely.' An experiment is just any process that produces a result (tossing a coin, rolling a die, checking if a product is defective). A random experiment is one where you genuinely don't know the result in advance, even though you repeat it exactly the same way every time. A trial is just one single run of that experiment.",
        code: "Experiment  = any process that generates well-defined outcomes\nRandom exp. = an experiment whose result varies even under identical conditions\nTrial       = a single performance (repetition) of an experiment\nOutcome     = the possible result of one trial",
        points: [
          "Tossing a coin is a random experiment — the SAME action (flip), but you can't predict heads or tails in advance.",
          "Outcomes are 'equally likely' when each has the same chance of occurring — e.g. a fair coin's H and T, or a fair die's 1 through 6.",
          "A football match's outcome set is {win (W), loss (L), draw (D)} — not equally likely in practice, just well-defined.",
        ],
      },
      {
        id: "sample-space-events",
        title: "Sample space and events",
        summary: "The sample space S is every possible outcome; an event is any subset of it.",
        eli5:
          "The sample space is the complete guest list for an experiment — every single outcome that could possibly happen, no exceptions. An event is just a smaller group picked out of that guest list — 'everyone whose name starts with K' is an event; the individual named guests are sample points.",
        code: "S (sample space)  = the set of ALL possible outcomes of an experiment\nsample point       = a single element/outcome within S\nEvent               = any subset of S (a collection of one or more outcomes)",
        points: [
          "Two coin tosses: S = {HH, HT, TH, TT}. Three coin tosses: S has 2³ = 8 outcomes.",
          "Event A = 'exactly two heads in three tosses' = {HHT, HTH, THH} — a subset of the 8-outcome sample space.",
          "Event B = 'a total of 8 on two dice' = {(2,6),(3,5),(4,4),(5,3),(6,2)} — 5 outcomes out of the 36 possible pairs.",
        ],
      },
      {
        id: "event-operations",
        title: "Combining events: union, intersection, complement",
        summary: "∪ means 'either happens', ∩ means 'both happen', and A′ means 'A does NOT happen.'",
        eli5:
          "Once you have events, you can combine them exactly like you'd combine two groups of people: ∪ (union) throws both groups' members into one bigger pool — 'in A or B or both.' ∩ (intersection) keeps only the people who were in BOTH groups at once. The complement A′ is simply everyone who is NOT in A.",
        code: "A ∪ B   occurs if EITHER A or B (or both) occur\nA ∩ B   occurs if BOTH A and B occur\nA′ (Aᶜ or Ā)   occurs if and only if A does NOT occur",
        points: [
          "De Morgan's Law: (A ∪ B)′ = A′ ∩ B′, and (A ∩ B)′ = A′ ∪ B′ — 'not (either)' equals 'neither'; 'not (both)' equals 'at least one is missing.'",
          "This extends to three events: (A ∪ B ∪ C)′ = A′ ∩ B′ ∩ C′, and (A ∩ B ∩ C)′ = A′ ∪ B′ ∪ C′.",
          "These are exactly the same laws from set theory — probability just adds a number on top of the sets.",
        ],
      },
      {
        id: "mutually-exclusive-independent",
        title: "Mutually exclusive vs. independent events",
        summary: "Mutually exclusive means they CAN'T both happen; independent means one doesn't AFFECT the other — very different ideas.",
        eli5:
          "These two terms get mixed up constantly, but they answer different questions. Mutually exclusive asks 'can these two things happen at the same time?' — rolling a 2 and rolling a 5 on the SAME roll can't both happen, so they're mutually exclusive. Independent asks 'does one affect the other?' — rolling a 2 on your first throw has zero effect on what you roll next, so consecutive rolls are independent. Mutually exclusive events are actually the OPPOSITE of independent in a sense: if you know A happened, you know FOR SURE that B didn't — that's about as dependent as two events can get.",
        code: "Mutually exclusive:  P(A ∩ B) = 0   ⟹   P(A ∪ B) = P(A) + P(B)\nIndependent:          P(A ∩ B) = P(A) × P(B)",
        points: [
          "Mutually exclusive: rolling a 2 precludes rolling a 1, 3, 4, 5, or 6 on that same roll.",
          "Independent: rolling a 2 on the first throw doesn't change the 1-in-6 chance of rolling a 3 on the next throw.",
          "Two events with nonzero probability that are mutually exclusive can NEVER be independent (and vice versa) — knowing one happened tells you everything about whether the other could.",
        ],
      },
    ],
  },
  {
    id: "probability-rules",
    title: "Computing and updating probabilities",
    entries: [
      {
        id: "probability-definitions",
        title: "Classical vs. axiomatic probability",
        summary: "Classical probability counts outcomes; the axiomatic definition is the formal rulebook every probability must obey.",
        eli5:
          "When every outcome is equally likely, probability is just counting: 'how many of the outcomes I care about, out of all the outcomes there are?' That's the classical definition. The axiomatic definition is the stricter rulebook underneath it all — three non-negotiable rules that ANY valid probability (even ones not based on equally-likely counting) must satisfy.",
        code: "Classical:   P(E) = n(E) / n(S)\n             where n(E) = number of outcomes in E, n(S) = number of outcomes in S\n\nAxioms:      1) 0 ≤ P(E) ≤ 1  for any event E\n             2) P(S) = 1        (the sure event)\n             3) If A, B mutually exclusive: P(A ∪ B) = P(A) + P(B)",
        points: [
          "A probability can never be negative or exceed 1 — that's axiom 1, and it's the fastest sanity check on any answer.",
          "The whole sample space always has probability exactly 1 — SOME outcome must happen.",
          "Everything else in probability (addition rule, complement rule, conditional probability) can be derived from these three axioms.",
        ],
      },
      {
        id: "conditional-probability",
        title: "Conditional probability",
        summary: "P(B|A) asks: given that A already happened, what's the new probability of B?",
        eli5:
          "Conditional probability is what happens to your odds once you learn a piece of information. Before you know anything, a die roll has a 1-in-6 chance of being a 6. But if someone tells you 'it landed on an even number,' your sample space just shrank from {1,2,3,4,5,6} down to {2,4,6} — now it's a 1-in-3 chance. P(B|A) is exactly that: recompute B's probability, but only within the smaller world where A is already true.",
        code: "P(B | A) = P(A ∩ B) / P(A),   provided P(A) > 0",
        points: [
          "The vertical bar reads as 'given': P(B|A) = 'probability of B, given A.'",
          "Conditioning shrinks the sample space from all of S down to just A — then re-measures B's share of THAT smaller space.",
          "Rearranged, this also gives the multiplication rule: P(A ∩ B) = P(B|A) × P(A).",
        ],
      },
      {
        id: "total-probability-rule",
        title: "The Total Probability Rule",
        summary: "If A₁...Aₙ partition the sample space, any event B's probability is a weighted sum across those pieces.",
        eli5:
          "Imagine a factory floor split into a few numbered zones (A₁, A₂, A₃...) that together cover the WHOLE floor with no overlaps — that's a 'partition.' If you want to know the overall defect rate (event B) across the whole factory, you can't just guess — you add up each zone's own defect rate, weighted by how much of the total output that zone actually makes. That's the Total Probability Rule: break B apart by which zone it happened in, then recombine.",
        code: "If A₁, A₂, ..., Aₙ partition S (mutually exclusive, cover all of S):\n\n  P(B) = P(B|A₁)P(A₁) + P(B|A₂)P(A₂) + ... + P(B|Aₙ)P(Aₙ)",
        points: [
          "Each term P(B|Ai)·P(Ai) is 'how much of B's probability comes from zone Ai' — add them all up to get P(B) overall.",
          "This only works when the Ai's truly partition S: mutually exclusive AND covering every possibility (their union is all of S).",
          "This is the exact rule used to answer 'what fraction of ALL products are defective, across three different machines' — see the worked example below.",
        ],
      },
      {
        id: "bayes-theorem",
        title: "Bayes' Theorem",
        summary: "Bayes' Theorem flips a conditional probability around: from P(B|A) to P(A|B).",
        eli5:
          "Total Probability answers 'given which zone it came from, what's the overall defect rate?' Bayes' Theorem answers the REVERSE question, which is usually the more useful one in practice: 'I found a defective item — what's the probability it came from zone A₁?' You already know how defects happen WITHIN each zone (P(B|Ai)); Bayes' Theorem uses that to work backward to how likely each zone is, GIVEN that you observed the defect.",
        code: "P(Aj | B) = [ P(B|Aj) × P(Aj) ] / P(B)\n\nwhere   P(B) = Σ P(B|Ai) × P(Ai)   (the Total Probability Rule, used as the denominator)",
        points: [
          "The denominator is just the Total Probability Rule — Bayes' Theorem is really 'one specific slice of B, divided by all of B.'",
          "P(Aj) is called the PRIOR (belief before seeing B); P(Aj|B) is the POSTERIOR (updated belief after seeing B).",
          "The posteriors across all j must add up to 1 — they're a full re-distribution of 100% probability across the same partition, just updated by new evidence.",
        ],
      },
    ],
  },
];
