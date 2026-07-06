"use client";

import { useState } from "react";
import Card from "../Card";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ErrorPanel from "../ErrorPanel";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `#include <iostream>

class BankAccount {
private:
    double balance = 0;          // hidden from outside

public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;   // controlled access
    }
    double getBalance() const { return balance; }
};

int main() {
    BankAccount acc;
    acc.deposit(100);
    // acc.balance = 1000000;    // uncommenting breaks compilation
    std::cout << "Balance: " << acc.getBalance() << "\\n";
}`;

const directAccessError = `error: 'double BankAccount::balance' is private within this context
    acc.balance = 1000000;
        ^~~~~~~`;

export default function EncapsulationDemo() {
  const [balance, setBalance] = useState(0);
  const [mode, setMode] = useState<"method" | "direct" | null>(null);

  function depositViaMethod() {
    setBalance((b) => b + 100);
    setMode("method");
    trackInteract();
  }

  function attemptDirectSet() {
    setMode("direct");
    trackInteract();
  }

  return (
    <Card
      id="concept-2"
      title="Concept 2 — Encapsulation & Access Specifiers"
      situation="private hides an object's data; public methods are the only controlled way in."
      why="private protects the data; public methods are the controlled gateway."
      examTip="Making everything public defeats encapsulation and loses marks."
    >
      <ExplainerBox>
        <p>
          Think of your bank balance like cash in a safe. You can&rsquo;t just reach in and grab
          it directly — you have to go through the teller (a method like{" "}
          <span className="font-mono">deposit()</span>), who checks the amount makes sense before
          touching the money. Marking <span className="font-mono">balance</span> as{" "}
          <span className="font-mono">private</span> is what makes the direct reach-in impossible
          in the first place — the compiler simply refuses to compile it.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={depositViaMethod}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Deposit via method
        </button>
        <button
          onClick={attemptDirectSet}
          className="px-4 py-1.5 rounded-full border border-error text-error text-sm font-medium hover:bg-error-bg transition-colors"
        >
          Set balance directly
        </button>
      </div>

      {mode === "method" && <OutputPanel output={`Balance: ${balance}`} />}
      {mode === "direct" && <ErrorPanel error={directAccessError} />}
    </Card>
  );
}
