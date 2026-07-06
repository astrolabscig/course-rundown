"use client";

import { useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const overloadCode = `void f(int x)    { std::cout << "f(int)\\n"; }
void f(double x) { std::cout << "f(double)\\n"; }

f(5);      // ?
f(5.5);    // ?`;

const operatorCode = `struct Point {
    int x, y;
    Point operator+(const Point& other) const {   // teach + to Point
        return { x + other.x, y + other.y };
    }
};

Point a{1, 2}, b{3, 4};
Point c = a + b;   // calls Point::operator+`;

const nonOverloadable = ["::", ".", "?:", "sizeof"];

export default function OverloadingOverridingDemo() {
  const [overloadResult, setOverloadResult] = useState<"int" | "double" | null>(null);
  const [operatorResult, setOperatorResult] = useState(false);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function call(kind: "int" | "double") {
    setOverloadResult(kind);
    markInteracted();
  }

  function computeSum() {
    setOperatorResult(true);
    markInteracted();
  }

  return (
    <div className="space-y-8">
      <ExplainerBox>
        <p>
          <strong>Overloading</strong> and <strong>overriding</strong> sound alike but mean very
          different things. Overloading is having several recipes with the same name but different
          ingredients (e.g. one f() for whole numbers, another f() for decimals) — the compiler
          picks one just by looking at what you handed it, before the program even runs.{" "}
          <strong>Overriding</strong> is a child class swapping out a specific recipe it inherited
          with its own version, but keeping the exact same name and ingredient list — this
          decision happens later, while the program is actually running, based on what the object
          really is.
        </p>
      </ExplainerBox>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Overload resolution</h4>
        <CodeBlock code={overloadCode} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => call("int")}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Call f(5)
          </button>
          <button
            type="button"
            onClick={() => call("double")}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Call f(5.5)
          </button>
        </div>
        {overloadResult && (
          <>
            <OutputPanel output={overloadResult === "int" ? "f(int)" : "f(double)"} />
            <p className="text-sm text-body">
              The compiler matches <span className="font-mono">{overloadResult === "int" ? "5" : "5.5"}</span>{" "}
              against the parameter types at compile time and picks{" "}
              <span className="font-mono">f({overloadResult})</span> — no run-time decision involved.
            </p>
          </>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Operator overloading</h4>
        <CodeBlock code={operatorCode} />
        <button
          type="button"
          onClick={computeSum}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Compute a + b
        </button>
        {operatorResult && <OutputPanel output="Point(4, 6)" />}
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm font-medium text-heading">Operators you cannot overload:</p>
          <p className="text-sm text-body font-mono mt-1">{nonOverloadable.join("   ")}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-heading">Overriding — the requirements</h4>
        <ul className="space-y-1.5">
          {[
            "Same function signature as the base class version (name, parameters, const-ness).",
            "The base class method must be declared virtual — overriding a non-virtual method just hides it instead.",
            "Requires an inheritance relationship between the classes.",
            "Add override on the derived method — the compiler then errors if it doesn't actually match a virtual base method, catching typos and signature drift.",
          ].map((point, i) => (
            <li key={i} className="text-sm text-body flex gap-2">
              <span className="text-accent shrink-0">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-body">
            A class with any virtual functions should also give its destructor{" "}
            <span className="font-mono">virtual</span>. Otherwise, deleting a derived object through
            a base pointer (<span className="font-mono">Animal *p = new Dog(); delete p;</span>) only
            runs <span className="font-mono">~Animal()</span> — <span className="font-mono">~Dog()</span>{" "}
            is skipped, silently leaking any resources Dog owns.
          </p>
        </div>
      </div>
    </div>
  );
}
