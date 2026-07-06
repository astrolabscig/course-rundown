"use client";

import { useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ErrorPanel from "../ErrorPanel";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `class Shape {
public:
    virtual double area() const = 0;   // pure virtual — this makes Shape abstract
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
};

class Square : public Shape {
    double side;
public:
    Square(double s) : side(s) {}
    double area() const override { return side * side; }
};`;

const instantiateError = `error: cannot declare variable 's' to be of abstract type 'Shape'
note:   because the following virtual functions are pure within 'Shape':
note:     virtual double Shape::area() const`;

export default function AbstractClassDemo() {
  const [showError, setShowError] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="What does '= 0' actually mean, and why can't Shape be created directly?">
        <p>
          A pure virtual function (<span className="font-mono">virtual ... = 0;</span>) is a
          promise with no implementation attached — like a job posting that says &ldquo;whoever
          takes this role MUST know how to compute an area,&rdquo; without saying how. A class
          holding even one such unfilled promise is <strong>abstract</strong>: it&rsquo;s a
          category, not a real thing you can build — you can&rsquo;t create &ldquo;a shape&rdquo;
          in the abstract, only a specific circle or square. But you CAN still point at one
          through a <span className="font-mono">Shape*</span>, since every real object underneath
          is guaranteed to have filled in that promise.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setShowError(true);
            markInteracted();
          }}
          className="px-4 py-1.5 rounded-full border border-error text-error text-sm font-medium hover:bg-error-bg transition-colors"
        >
          Try: Shape s;
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOutput(true);
            markInteracted();
          }}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Try: Shape *shapes[] = {"{"} new Circle(3), new Square(4) {"}"};
        </button>
      </div>

      {showError && <ErrorPanel error={instantiateError} />}
      {showOutput && (
        <>
          <OutputPanel output={"28.2743\n16"} />
          <p className="text-sm text-body">
            Neither call site mentions Circle or Square by name — each{" "}
            <span className="font-mono">s-&gt;area()</span> is dispatched through the vtable to
            whichever override actually matches the real object it points to. That&rsquo;s the
            whole point of an abstract base class: it defines a common interface every derived
            class is forced to implement, then polymorphism picks the right one at runtime.
          </p>
        </>
      )}
    </div>
  );
}
