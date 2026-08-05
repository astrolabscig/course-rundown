import type { BasicsGroup } from "@/lib/basics";

export const countingFundamentalsGroups: BasicsGroup[] = [
  {
    id: "counting-foundations",
    title: "The multiplication principle and factorials",
    entries: [
      {
        id: "multiplication-principle",
        title: "The multiplication principle: the engine behind all counting",
        summary: "If a first choice can be made m ways and a second n ways, the two together can be made m×n ways.",
        eli5:
          "Picture a journey from town A to town C through town B: 3 roads from A to B, then 2 roads from B to C. For every single road you pick first, you still have all 2 choices for the second leg — so the total is 3×2 = 6 full routes, not 3+2 = 5. Counting problems almost always come down to spotting the sequence of independent choices and multiplying the number of options at each step.",
        code: "Multiplication principle:\nchoice 1 (m ways) AND choice 2 (n ways) AND choice 3 (p ways)\n  → total = m × n × p",
        points: [
          "A man has 4 shirts and 3 pairs of trousers → 4×3 = 12 possible outfits.",
          "The key word is AND, not OR — every combination of the first choice with every combination of the second choice counts separately.",
          "This single idea underlies both permutations and combinations — they're just the multiplication principle applied to specific 'select and arrange' situations.",
        ],
      },
      {
        id: "factorial-notation",
        title: "Factorial notation: shorthand for 'multiply this many descending choices'",
        summary: "n! = n×(n−1)×(n−2)×...×2×1, and by definition 0! = 1.",
        eli5:
          "Factorial is just a compact way to write 'multiply every whole number from n down to 1' — exactly the kind of product the multiplication principle keeps producing once you start arranging things. 5! = 5×4×3×2×1 = 120. The one rule that trips people up: 0! is defined to be 1, not 0 — this keeps the permutation and combination formulas working cleanly even in edge cases.",
        code: "n! = n × (n−1) × (n−2) × ... × 2 × 1\n0! = 1\n\n5! = 5×4×3×2×1 = 120\n7!/3! = (7×6×5×4×3!)/3! = 7×6×5×4 = 840",
        points: [
          "A fraction like 7!/3! doesn't need full expansion — the smaller factorial cancels, leaving only 7×6×5×4.",
          "3!2! means (3!)×(2!) = 6×2 = 12 — two separate factorials multiplied, not one big factorial of a sum.",
          "Factorials grow explosively: 10! is already 3,628,800 — this is exactly why permutation/combination formulas always simplify by cancellation rather than computing the full factorials.",
        ],
      },
    ],
  },
  {
    id: "counting-permutations-combinations",
    title: "Permutations vs. combinations: does order matter?",
    entries: [
      {
        id: "permutations",
        title: "Permutations: ordered arrangements",
        summary: "The number of ways to arrange r objects chosen from n distinct objects, where order matters, is nPr = n!/(n−r)!.",
        eli5:
          "A permutation is an ordered arrangement — ab and ba count as two DIFFERENT permutations of the letters a and b, because who comes first matters (like a President vs. Vice President election, or a race's 1st/2nd/3rd place). The formula nPr = n!/(n−r)! is really just 'multiply n choices, then (n−1), then (n−2), ... for r steps, then stop' — the (n−r)! in the denominator is exactly what's left over and gets cancelled away.",
        code: "nPr = n! / (n−r)!\n\nExample: 4 letters a,b,c,d taken 2 at a time\n4P2 = 4!/(4−2)! = 4!/2! = 4×3 = 12\n→ ab, ba, ac, ca, ad, da, bc, cb, bd, db, cd, dc",
        points: [
          "Order matters: choosing a President then a Vice President from 50 students is a permutation — swapping the two people changes the outcome.",
          "50P3 = 50×49×48 = 117,600 ways to elect a President, Vice President, and Treasurer from 50 students, no repeats allowed.",
          "When r = n (arranging ALL n objects), nPn = n!/(n−n)! = n!/0! = n! — exactly the number of ways to line up n distinct objects in a row.",
        ],
      },
      {
        id: "permutations-with-repetition",
        title: "Permutations with repeated objects",
        summary: "When some objects repeat, divide n! by the factorial of each repeated group's count to remove the arrangements that look identical.",
        eli5:
          "If every letter were distinct, arranging them would just be n!. But when a letter repeats — like the two M's in MAMMAL — swapping those two identical M's with each other produces an arrangement that LOOKS exactly the same, even though n! counted it as a separate arrangement. Dividing by each repeated letter's own factorial removes exactly those duplicate look-alikes.",
        code: "Distinct permutations of n objects with repeated groups of\nsize n₁, n₂, ..., nₖ:\n\n   n! / (n₁! × n₂! × ... × nₖ!)\n\nMAMMAL: M×3, A×2, L×1, n=6\n6! / (3!×2!×1!) = 720/12 = 60 distinct arrangements",
        points: [
          "PEPPER has P×3, E×2, R×1 (6 letters total): 6!/(3!2!1!) = 720/12 = 60 distinct permutations.",
          "TAT has T×2, A×1 (3 letters): 3!/2! = 3 distinct arrangements (TAT, TTA, ATT) — far fewer than 3! = 6, because swapping the two T's changes nothing visible.",
          "If every object is actually distinct (no repeats), every ni = 1, and the formula collapses back to plain n! — repetition-adjustment is a strict generalization, not a different idea.",
        ],
      },
      {
        id: "combinations",
        title: "Combinations: unordered selections",
        summary: "The number of ways to select r objects from n distinct objects, where order does NOT matter, is nCr = n! / [r!(n−r)!].",
        eli5:
          "A combination is just a permutation with the order thrown away afterward. Since ab and ba are the same SELECTION (just two different orderings of it), every combination corresponds to r! different permutations — so nCr = nPr / r!. Picking a 3-person committee from 5 managers is a combination: 'Alice, Bob, Carol' is the exact same committee no matter which order you name them in.",
        code: "nCr = n! / [r!(n−r)!] = nPr / r!\n\nExample: 2 letters from {a,b,c,d}\n4C2 = 4!/(2!2!) = 6\n→ ab, ac, ad, bc, bd, cd  (ab and ba are now the SAME selection)",
        points: [
          "5C3 = 5!/(3!2!) = 10 ways to select 3 friends from a group of 5 for a camping trip — order of selection doesn't matter, it's the same trip either way.",
          "When a problem involves choosing SEPARATE groups (e.g. 2 women from 5 AND 3 men from 7), multiply the individual combinations together: 5C2 × 7C3 = 10 × 35 = 350 possible committees.",
          "The giveaway word for combinations is usually 'select', 'choose', or 'committee' — no ranking, ordering, or distinct role is implied. The giveaway for permutations is 'arrange', 'rank', or distinct positions like President/Vice-President.",
        ],
      },
    ],
  },
];
