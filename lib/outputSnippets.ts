export interface OutputSnippet {
  id: string;
  code: string;
  expectedOutput: string;
  explanation: string;
  seeAlso?: string;
}

// Starter set — the full 8-snippet set from OOP_Rapid_Revision.pdf will
// replace this once that reference document is added to the project.
export const outputSnippets: OutputSnippet[] = [
  {
    id: "snippet-construction-order",
    code: `#include <iostream>
class A {
public:
    A() { std::cout << "A"; }
    ~A() { std::cout << "~A"; }
};
class B : public A {
public:
    B() { std::cout << "B"; }
    ~B() { std::cout << "~B"; }
};
int main() {
    B b;
}`,
    expectedOutput: "AB~B~A",
    explanation:
      "Construction runs base → derived (A then B). When b goes out of scope, destruction runs the exact reverse (derived → base): ~B then ~A.",
    seeAlso: "Part 5 — Inheritance: construction/destruction order animation",
  },
  {
    id: "snippet-call-by-value",
    code: `void addTen(int x) { x += 10; }
int main() {
    int n = 10;
    addTen(n);
    std::cout << n;
}`,
    expectedOutput: "10",
    explanation:
      "addTen receives a copy of n. Adding to the copy never reaches the caller's variable, so n is still 10.",
    seeAlso: "Part 1 — Functions: call by value vs call by reference",
  },
  {
    id: "snippet-call-by-reference",
    code: `void doubleIt(int &x) { x *= 2; }
int main() {
    int n = 22;
    doubleIt(n);
    std::cout << n;
}`,
    expectedOutput: "44",
    explanation:
      "x is a reference (an alias) to n, so multiplying x also multiplies n directly. 22 doubled is 44.",
    seeAlso: "Part 1 — Functions: call by value vs call by reference",
  },
  {
    id: "snippet-declaration-order",
    code: `#include <iostream>
class C { public: C() { std::cout << "C"; } };
class D { public: D() { std::cout << "D"; } };
int main() {
    C c1, c2;
    D d1, d2;
}`,
    expectedOutput: "CCDD",
    explanation:
      "Local variables construct in the order they're declared: c1, c2 first (\"CC\"), then d1, d2 (\"DD\").",
  },
  {
    id: "snippet-default-argument",
    code: `int add(int a, int b = 10) {
    return a + b;
}
int main() {
    std::cout << add(5);
}`,
    expectedOutput: "15",
    explanation: "b isn't supplied, so it falls back to its default value of 10. 5 + 10 = 15.",
    seeAlso: "Part 0 — Basics Cheatsheet: Functions",
  },
  {
    id: "snippet-non-virtual-dispatch",
    code: `class Animal {
public:
    void speak() { std::cout << "..."; }   // not virtual
};
class Dog : public Animal {
public:
    void speak() { std::cout << "Woof"; }
};
int main() {
    Animal *p = new Dog();
    p->speak();
}`,
    expectedOutput: "...",
    explanation:
      "Without virtual, the call is resolved at compile time using p's static type (Animal*) — it always calls Animal::speak, no matter what p actually points to. Add virtual and it would print \"Woof\" instead.",
    seeAlso: "Part 6 — Polymorphism: the vptr/vtable simulator",
  },
  {
    id: "snippet-overload-resolution",
    code: `void f(int x) { std::cout << "int"; }
void f(double x) { std::cout << "double"; }
int main() {
    f(3.0);
}`,
    expectedOutput: "double",
    explanation: "3.0 is a double literal, so the compiler matches it to f(double) at compile time.",
    seeAlso: "Part 6 — Polymorphism: overload resolution demo",
  },
  {
    id: "snippet-increment-operators",
    code: `int i = 5;
int a = i++;   // a = 5, i becomes 6
int b = ++i;   // i becomes 7, b = 7
std::cout << a << " " << b;`,
    expectedOutput: "5 7",
    explanation:
      "i++ (post-increment) evaluates to the old value (5) and then increments i to 6. ++i (pre-increment) increments i to 7 first and evaluates to that new value.",
    seeAlso: "Part 0 — Basics Cheatsheet: Operators",
  },
];
