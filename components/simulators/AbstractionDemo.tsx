"use client";

import { useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import { trackInteract } from "@/lib/track";

const interfaceCode = `class ATM {
public:
    void checkBalance();        // the public interface — what the user sees
    void withdraw(double amount);
    void deposit(double amount);
};`;

const implementationCode = `class ATM {
private:
    double balance = 500;

    bool validatePin(int pin) {        // hidden security check
        return pin == 1234;
    }
    void logTransaction(std::string type) {   // hidden audit trail
        // write to a transaction log
    }

public:
    void checkBalance() {
        logTransaction("check");
        std::cout << "Balance: " << balance << "\\n";
    }
    void withdraw(double amount) {
        logTransaction("withdraw");
        if (amount <= balance) balance -= amount;   // hidden validation
    }
    void deposit(double amount) {
        logTransaction("deposit");
        balance += amount;
    }
};`;

export default function AbstractionDemo() {
  const [showImpl, setShowImpl] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function press(action: string) {
    setOutput(action);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => press("Balance: 500")}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Check Balance
        </button>
        <button
          type="button"
          onClick={() => press("Withdrew 50. New balance: 450")}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Withdraw 50
        </button>
        <button
          type="button"
          onClick={() => press("Deposited 100. New balance: 600")}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          Deposit 100
        </button>
      </div>

      {output && <OutputPanel output={output} />}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setShowImpl((v) => !v);
            markInteracted();
          }}
          aria-pressed={showImpl}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            showImpl
              ? "bg-heading text-white border-heading"
              : "bg-white text-body border-card-border hover:border-accent"
          }`}
        >
          {showImpl ? "Hide implementation" : "Show implementation"}
        </button>
        <span className="text-sm text-secondary">
          {showImpl
            ? "This is everything hidden behind the interface."
            : "This is all the user (or calling code) ever sees."}
        </span>
      </div>

      <CodeBlock code={showImpl ? implementationCode : interfaceCode} />

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm font-medium text-heading">
          Abstraction hides complexity; encapsulation hides data.
        </p>
        <p className="text-sm text-body mt-1">
          Abstraction is about the public interface — what an object lets you do.
          Encapsulation is the access-control mechanism (private/protected) that makes hiding the
          data possible in the first place.
        </p>
      </div>
    </div>
  );
}
