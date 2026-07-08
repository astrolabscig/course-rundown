"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import ProofWalkthrough from "./ProofWalkthrough";
import { trackInteract } from "@/lib/track";

interface Argument {
  id: string;
  label: string;
  given: string;
  goal: string;
  steps: { statement: string; reason: string }[];
  conclusion: string;
}

const arguments_: Argument[] = [
  {
    id: "sunset",
    label: "The sunset argument (Rosen 1.6, Example 6)",
    given:
      "1. ¬s ∧ c  (\"It is not sunny and it is colder than yesterday\")\n2. s ∨ ¬w  (\"We will swim only if it is sunny\", i.e. w → s)\n3. ¬w → t  (\"If we don't swim, we'll take a canoe trip\")\n4. t → h   (\"If we take a canoe trip, we'll be home by sunset\")",
    goal: "Show h (\"We will be home by sunset\") follows from premises 1–4.",
    steps: [
      { statement: "¬s ∧ c", reason: "Premise 1" },
      { statement: "¬s", reason: "Simplification from step 1" },
      { statement: "w → s", reason: "Premise 2, rewritten" },
      { statement: "¬w", reason: "Modus tollens on steps 2 and 3 (¬s and w→s means w must be false)" },
      { statement: "¬w → t", reason: "Premise 3" },
      { statement: "t", reason: "Modus ponens on steps 4 and 5" },
      { statement: "t → h", reason: "Premise 4" },
      { statement: "h", reason: "Modus ponens on steps 6 and 7" },
    ],
    conclusion: "So h — \"we will be home by sunset\" — is a valid conclusion from the four premises.",
  },
  {
    id: "socrates",
    label: "The Socrates syllogism (Rosen 1.6, Example 1)",
    given: "1. All men are mortal: ∀x (Man(x) → Mortal(x))\n2. Socrates is a man: Man(Socrates)",
    goal: "Show Mortal(Socrates).",
    steps: [
      { statement: "∀x (Man(x) → Mortal(x))", reason: "Premise 1" },
      { statement: "Man(Socrates) → Mortal(Socrates)", reason: "Universal instantiation on step 1 (plug in x = Socrates)" },
      { statement: "Man(Socrates)", reason: "Premise 2" },
      { statement: "Mortal(Socrates)", reason: "Modus ponens on steps 2 and 3" },
    ],
    conclusion: "So Mortal(Socrates) follows — the classic syllogism, formalized with quantifier rules plus modus ponens.",
  },
  {
    id: "randy",
    label: "Randy works hard (Rosen 1.6, Example 5)",
    given:
      "1. p → q  (\"If Randy works hard, he'll pass the course\")\n2. p        (\"Randy works hard\")",
    goal: "Show q (\"Randy will pass the course\").",
    steps: [
      { statement: "p → q", reason: "Premise 1" },
      { statement: "p", reason: "Premise 2" },
      { statement: "q", reason: "Modus ponens: from p→q and p, conclude q directly" },
    ],
    conclusion: "So q — \"Randy will pass the course\" — follows immediately by modus ponens, the simplest and most-used inference rule.",
  },
];

export default function InferenceBuilder() {
  const [id, setId] = useState(arguments_[0].id);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const arg = arguments_.find((a) => a.id === id)!;

  return (
    <div className="space-y-4">
      <ExplainerBox title="Building an argument is like chaining function calls">
        <p>
          Each rule of inference (modus ponens, modus tollens, hypothetical syllogism, ...) is a
          tiny, always-valid pattern — like a trusted library function. A real argument just
          chains several of these together: the output of one step becomes the input to the
          next, until you reach the conclusion. Pick an argument below and reveal it one
          inference at a time.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {arguments_.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => {
              setId(a.id);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              id === a.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <ProofWalkthrough
        key={arg.id}
        title={arg.label}
        given={arg.given}
        goal={arg.goal}
        steps={arg.steps}
        conclusion={arg.conclusion}
      />
    </div>
  );
}
