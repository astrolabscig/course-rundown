import type { BasicsGroup } from "@/lib/basics";

export const discreteMathsFundamentalsGroups: BasicsGroup[] = [
  {
    id: "what-is-discrete-math",
    title: "What discrete math actually is",
    entries: [
      {
        id: "discrete-vs-continuous",
        title: "Discrete vs. continuous",
        summary: "Discrete math studies things you count in whole steps — not things that flow smoothly.",
        eli5:
          "Think of a light switch versus a dimmer knob. A dimmer knob is continuous — it can be at any position between off and full brightness. A light switch is discrete — it's either off or on, nothing in between. Computers are built entirely out of switches (bits: 0 or 1), so almost everything a computer science course teaches you — logic, algorithms, graphs, counting — lives in this 'switch' world of distinct, separate values rather than smooth continuous ones. That's why discrete math is often called the true mathematical foundation of computer science.",
        points: [
          "\"Discrete\" means made of distinct, separate, countable pieces — not continuously varying.",
          "Calculus studies continuous change (smooth curves); discrete math studies structures built from separate, whole-number-like objects.",
          "Because computers store and process information as discrete bits, nearly every core CS topic (algorithms, data structures, cryptography, databases, AI logic) rests on discrete math foundations.",
        ],
      },
      {
        id: "why-this-course-matters",
        title: "Why this specific course matters for CS",
        summary: "Logic → correct programs. Induction/recursion → algorithms that provably work. Graphs/trees → the shape of almost every real data structure.",
        eli5:
          "Every one of these topics quietly powers something you'll use as a programmer: propositional logic is what a compiler uses to simplify your if-conditions and what a database uses to run a WHERE clause; induction is literally why a loop or a recursive function is guaranteed to terminate with the right answer; graphs are the literal shape of a road network, a social network, or a webpage link structure; trees are the literal shape of a file system, a binary search, or how your browser parses HTML.",
        points: [
          "Logic and proofs: the backbone of writing (and proving) correct code.",
          "Induction and recursion: why recursive functions and loop-based algorithms are guaranteed correct.",
          "Counting: the basis of estimating how many cases an algorithm or a password space has to handle.",
          "Graphs and trees: the actual shape of networks, file systems, search trees, and dependency chains.",
        ],
      },
      {
        id: "notation-primer",
        title: "Notation you'll see constantly",
        summary: "A quick glossary of symbols used across every part of this room.",
        eli5:
          "Think of these symbols as short-hand abbreviations, exactly like how 'w/' means 'with' in a text message. Once you know the shorthand, dense-looking formulas turn into plain sentences.",
        code: "¬p        NOT p\np ∧ q     p AND q\np ∨ q     p OR q (inclusive: true if either or both are true)\np → q     IF p THEN q\np ↔ q     p IF AND ONLY IF q\n∀x P(x)   FOR ALL x, P(x) is true\n∃x P(x)   THERE EXISTS an x such that P(x) is true\n∈         \"is a member of\" (a set)\n⊆         \"is a subset of\"\n∅         the empty set (contains nothing)\nΣ         summation (\"add up all of these\")",
        points: [
          "∀ (\"for all\") and ∃ (\"there exists\") are called quantifiers — they turn a statement about one thing into a statement about a whole domain.",
          "∧/∨/¬/→/↔ are the five logical connectives used to build compound statements out of simple ones.",
          "∈, ⊆, ∅ are the three most common set symbols you'll see before you've even defined what a set formally is.",
        ],
      },
    ],
  },
];
