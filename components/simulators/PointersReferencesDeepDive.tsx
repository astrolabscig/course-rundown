"use client";

import { useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ExplainerBox from "../ExplainerBox";
import CodeWalkthrough, { WalkthroughStep } from "./CodeWalkthrough";
import { trackInteract } from "@/lib/track";

const pointerLines = [
  "int score = 42;",
  "int *p = &score;",
  "std::cout << *p;",
  "*p = 100;",
  "std::cout << score;",
];

const pointerSteps: WalkthroughStep[] = [
  {
    highlightLine: 0,
    narration:
      "We create an ordinary box named score and put 42 inside it. Nothing unusual yet.",
    state: [{ label: "score", value: "42" }],
  },
  {
    highlightLine: 1,
    narration:
      "We create a NEW box named p. But instead of a number, we write score's address inside it — directions to where score lives, not the value 42 itself.",
    state: [
      { label: "score", value: "42" },
      { label: "p", value: "→ address of score" },
    ],
  },
  {
    highlightLine: 2,
    narration:
      "*p means \"follow the directions written in p, and read what's sitting there.\" It walks to score's box and reads 42.",
    state: [
      { label: "score", value: "42" },
      { label: "p", value: "→ address of score" },
    ],
    output: "42",
  },
  {
    highlightLine: 3,
    narration:
      "*p = 100 means the same walk, except this time we WRITE 100 instead of reading. We never typed the word \"score\" on this line, but we just changed it.",
    state: [
      { label: "score", value: "100" },
      { label: "p", value: "→ address of score" },
    ],
  },
  {
    highlightLine: 4,
    narration:
      "Proof: printing score directly now shows 100 — because p was never a separate value, it was directions to score's own box the whole time.",
    state: [
      { label: "score", value: "100" },
      { label: "p", value: "→ address of score" },
    ],
    output: "100",
  },
];

const referenceLines = ["int score = 42;", "int &ref = score;", "ref = 100;", "std::cout << score;"];

const referenceSteps: WalkthroughStep[] = [
  {
    highlightLine: 0,
    narration: "We create a box named score, holding 42.",
    state: [{ label: "score", value: "42" }],
  },
  {
    highlightLine: 1,
    narration:
      "ref is not a new box at all — it's a second nametag glued onto the SAME box as score. There is still only one box, now wearing two name tags.",
    state: [{ label: "score  (a.k.a. ref)", value: "42" }],
  },
  {
    highlightLine: 2,
    narration:
      "Writing to ref writes straight into that one shared box — there's nothing else it could possibly mean, since ref IS score.",
    state: [{ label: "score  (a.k.a. ref)", value: "100" }],
  },
  {
    highlightLine: 3,
    narration: "Printing score shows 100 — of course it does, there was only ever one box.",
    state: [{ label: "score  (a.k.a. ref)", value: "100" }],
    output: "100",
  },
];

const oopCode = `class Wallet {
public:
    double balance = 0;

    void deposit(double amount) {
        this->balance += amount;   // "this" = a pointer to the object
        // balance += amount;      // would do exactly the same thing
    }
};

void addByValue(Wallet w)      { w.balance += 50; }   // works on a COPY
void addByReference(Wallet &w) { w.balance += 50; }   // works on the REAL wallet
void addByPointer(Wallet *w)   { w->balance += 50; }  // works on the REAL wallet, via an address

int main() {
    Wallet myWallet;

    addByValue(myWallet);
    std::cout << myWallet.balance << "\\n";   // ?

    addByReference(myWallet);
    std::cout << myWallet.balance << "\\n";   // ?

    addByPointer(&myWallet);
    std::cout << myWallet.balance << "\\n";   // ?
}`;

export default function PointersReferencesDeepDive() {
  const [ranOop, setRanOop] = useState(false);
  const interactedRef = useRef(false);

  function runOop() {
    setRanOop(true);
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  return (
    <div className="space-y-8">
      <ExplainerBox title="What even is a pointer or a reference — and why bother?">
        <p>
          Every variable lives somewhere in memory, at an address — think of it as a numbered
          mailbox. Most of the time you don&rsquo;t care about the number, you just use the
          variable&rsquo;s name and C++ finds the right mailbox for you.
        </p>
        <p>
          A <strong>pointer</strong> is a box that holds a mailbox NUMBER (an address) instead of
          an ordinary value — a sticky note with directions on it, not the thing itself. A{" "}
          <strong>reference</strong> is a second NAME TAG stuck onto an existing mailbox — not a
          new box, just another way to say the same box&rsquo;s name.
        </p>
        <p>
          Why does this matter? Because normally, handing a variable to a function hands over a{" "}
          <em>copy</em> — like a photocopy of a form. If you want a function to actually change
          your original variable (not a copy of it), you have to hand over either the address
          (a pointer) or a second name for the same box (a reference) — not the value.
        </p>
      </ExplainerBox>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Walk through it: a pointer, step by step
        </h4>
        <CodeWalkthrough lines={pointerLines} steps={pointerSteps} />
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Walk through it: a reference, step by step
        </h4>
        <CodeWalkthrough lines={referenceLines} steps={referenceSteps} />
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm font-medium text-heading mb-2">Pointer vs reference, side by side</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Pointer</th>
                <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-card-border">
                <td className="p-2 text-body align-top">Can be declared without pointing anywhere yet (nullptr).</td>
                <td className="p-2 text-body align-top">Must be bound to something the moment it's declared.</td>
              </tr>
              <tr className="border-b border-card-border">
                <td className="p-2 text-body align-top">Can be reassigned to point somewhere else later.</td>
                <td className="p-2 text-body align-top">Can never be re-bound to a different variable.</td>
              </tr>
              <tr>
                <td className="p-2 text-body align-top">Needs * to read/write the pointed-to value (dereferencing).</td>
                <td className="p-2 text-body align-top">Used exactly like the original variable — no extra symbol needed.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">
          Why this matters in OOP: passing objects, and the hidden &ldquo;this&rdquo;
        </h4>
        <p className="text-sm text-body">
          The exact same value/reference/pointer choice applies to whole objects, not just
          numbers — and inside every method, a hidden pointer called <span className="font-mono">this</span>{" "}
          silently points at &ldquo;whichever object called this method,&rdquo; which is how a method
          knows whose data to change when many objects share the same class.
        </p>
        <CodeBlock code={oopCode} />
        <button
          type="button"
          onClick={runOop}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Run all three calls
        </button>
        {ranOop && (
          <>
            <OutputPanel output={"0\n50\n100"} />
            <ul className="space-y-1.5">
              <li className="text-sm text-body flex gap-2">
                <span className="text-accent shrink-0">•</span>
                <span>
                  addByValue got a photocopy of myWallet — the +50 happened to the copy, so the real
                  wallet is still 0.
                </span>
              </li>
              <li className="text-sm text-body flex gap-2">
                <span className="text-accent shrink-0">•</span>
                <span>
                  addByReference got the real wallet under a second name — the +50 really landed, so
                  it's now 50.
                </span>
              </li>
              <li className="text-sm text-body flex gap-2">
                <span className="text-accent shrink-0">•</span>
                <span>
                  addByPointer got the real wallet&rsquo;s address — w-&gt;balance follows that
                  address first, so the +50 landed again, making it 100.{" "}
                  <span className="font-mono">w-&gt;balance</span> is just shorthand for{" "}
                  <span className="font-mono">(*w).balance</span>: follow the pointer, then reach
                  into the object.
                </span>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
