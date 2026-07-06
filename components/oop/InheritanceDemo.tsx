"use client";

import { useState } from "react";
import Card from "../Card";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import { trackInteract } from "@/lib/track";

const code = `#include <iostream>
#include <string>

class Animal {
protected:
    std::string name;                 // reachable by subclasses, hidden outside
public:
    Animal(std::string n) : name(n) {}
    void eat() { std::cout << name << " is eating\\n"; }
};

class Dog : public Animal {           // Dog "is-a" Animal
public:
    Dog(std::string n) : Animal(n) {} // must call the base constructor
    void bark() { std::cout << name << " says Woof\\n"; }
};

int main() {
    Dog d("Rex");
    d.eat();     // inherited
    d.bark();    // Dog's own
}`;

export default function InheritanceDemo() {
  const [created, setCreated] = useState(false);

  function createDog() {
    setCreated(true);
    trackInteract();
  }

  return (
    <Card
      id="concept-3"
      title="Concept 3 — Inheritance"
      situation={
        'A Dog "is-a" Animal: it receives Animal’s members, then adds its own.'
      }
      why="Dog inherits eat() and name, then adds bark(); protected lets the subclass use name; Animal has no default constructor so Dog must call : Animal(n)."
      examTip="Forgetting the base-constructor call is a very common compile error; protected is reachable in a subclass, private is not."
    >
      <CodeBlock code={code} />

      <button
        onClick={createDog}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        Create a Dog that inherits from Animal
      </button>

      {created && (
        <>
          <p className="text-sm text-body">
            <span className="font-mono">Dog d(&quot;Rex&quot;)</span> now has everything{" "}
            <span className="font-mono">Animal</span> has, plus <span className="font-mono">bark()</span>.
          </p>
          <OutputPanel output={"Rex is eating\nRex says Woof"} />
        </>
      )}
    </Card>
  );
}
