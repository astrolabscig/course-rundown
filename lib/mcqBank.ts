export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Starter bank — the full 40-question set from OOP_Rapid_Revision.pdf will
// replace this once that reference document is added to the project.
export const mcqBank: MCQ[] = [
  {
    id: "mcq-1",
    question: "What does the linker error \"undefined reference to `main'\" actually mean?",
    options: [
      "There is a syntax error inside main()",
      "The linker could not find a function named main to use as the entry point",
      "main() returned the wrong type",
      "A semicolon is missing somewhere in the file",
    ],
    correctIndex: 1,
    explanation:
      "This is a linker error, not a compiler error — the code compiled fine, but no function named main exists to serve as the program's entry point.",
  },
  {
    id: "mcq-2",
    question: "Which access specifier is reachable inside a derived class but hidden from code outside the class hierarchy?",
    options: ["public", "protected", "private", "static"],
    correctIndex: 1,
    explanation:
      "protected members are accessible in derived classes but not from outside code — that's exactly the gap between public and private.",
  },
  {
    id: "mcq-3",
    question: "What does this print?\nvoid f(int x) { x = 100; }\nint main() { int a = 5; f(a); std::cout << a; }",
    options: ["5", "100", "Undefined behaviour", "Compile error"],
    correctIndex: 0,
    explanation:
      "f takes x by value, so it modifies a copy. The caller's a is untouched and still prints 5.",
  },
  {
    id: "mcq-4",
    question: "Which statement correctly frees memory allocated with new int[10]?",
    options: ["delete p;", "delete[] p;", "free(p);", "p.delete();"],
    correctIndex: 1,
    explanation:
      "Array allocations (new[]) must be freed with delete[]; mismatching new[]/delete is undefined behaviour.",
  },
  {
    id: "mcq-5",
    question: "For a call through a base class pointer to resolve to the derived class's override at runtime, the base method must be declared:",
    options: ["static", "const", "virtual", "inline"],
    correctIndex: 2,
    explanation:
      "virtual is what makes dispatch happen at runtime via the vtable, based on the object's actual type rather than the pointer's static type.",
  },
  {
    id: "mcq-6",
    question: "Animal *p = new Dog(); delete p; — if Animal's destructor is NOT virtual, what happens?",
    options: [
      "Compile error",
      "Only ~Animal() runs; ~Dog() is skipped",
      "Both destructors run, in undefined order",
      "The program crashes immediately",
    ],
    correctIndex: 1,
    explanation:
      "Without a virtual destructor, delete through a base pointer only calls the base class's destructor — any resources Dog owns are leaked.",
  },
  {
    id: "mcq-7",
    question: "Two overloads exist: void f(int) and void f(double). What does f(3.0) call?",
    options: ["f(int) — 3.0 is truncated first", "f(double) — matched by argument type", "Ambiguous, compile error", "Whichever was declared first"],
    correctIndex: 1,
    explanation:
      "The compiler matches overloads by argument type at compile time; 3.0 is a double literal, so f(double) is the best match.",
  },
  {
    id: "mcq-8",
    question: "Which of these can a class NOT overload?",
    options: ["+", "==", "::", "[]"],
    correctIndex: 2,
    explanation: ":: (scope resolution) is one of the few operators that cannot be overloaded — along with ., ?:, and sizeof.",
  },
];
