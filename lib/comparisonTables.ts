export interface ComparisonTableData {
  id: string;
  title: string;
  columns: [string, string];
  rows: [string, string][];
}

// Standard, accurate comparisons — will be reconciled against the exact wording
// in OOP_Rapid_Revision.pdf once that reference document is added to the project.
export const comparisonTables: ComparisonTableData[] = [
  {
    id: "class-vs-object",
    title: "Class vs Object",
    columns: ["Class", "Object"],
    rows: [
      ["A blueprint/template that defines data members and methods.", "An instance created from that blueprint."],
      ["Declared once in code.", "Can be created many times from the same class."],
      ["Doesn't occupy memory for data members by itself.", "Occupies its own memory for each data member."],
      ["Defines behaviour (methods) shared by all instances.", "Holds its own values for the class's data members."],
    ],
  },
  {
    id: "abstraction-vs-encapsulation",
    title: "Abstraction vs Encapsulation",
    columns: ["Abstraction", "Encapsulation"],
    rows: [
      ["Hides complexity — shows only what an object does.", "Hides data — controls how it's accessed."],
      ["Achieved via public interfaces and abstract classes.", "Achieved via access specifiers (private/protected)."],
      ["Focuses on design and behaviour — the “what.”", "Focuses on implementation and data protection — the “how.”"],
    ],
  },
  {
    id: "overloading-vs-overriding",
    title: "Overloading vs Overriding",
    columns: ["Overloading", "Overriding"],
    rows: [
      ["Same name, different parameter list, in the same scope.", "Same name and same parameter list, in a base and derived class."],
      ["Resolved at compile time.", "Resolved at runtime (when the base method is virtual)."],
      ["Does not require inheritance.", "Requires an inheritance relationship."],
      ["Return type alone cannot distinguish two overloads.", "Signature must match exactly; override lets the compiler check this."],
    ],
  },
  {
    id: "constructor-vs-destructor",
    title: "Constructor vs Destructor",
    columns: ["Constructor", "Destructor"],
    rows: [
      ["Runs when an object is created.", "Runs when an object is destroyed."],
      ["Same name as the class, no return type.", "Same name as the class prefixed with ~, no return type."],
      ["Can be overloaded — a class can have several.", "Cannot be overloaded — a class has exactly one."],
      ["Can take parameters.", "Never takes parameters."],
      ["In inheritance, runs base → derived.", "In inheritance, runs derived → base (the exact reverse)."],
    ],
  },
  {
    id: "access-modifiers",
    title: "Access modifiers",
    columns: ["Modifier", "Accessible from"],
    rows: [
      ["public", "Inside the class, in derived classes, and from outside via an object."],
      ["protected", "Inside the class and in derived classes — not from outside."],
      ["private", "Only inside the class that declares it — not derived classes, not outside."],
    ],
  },
  {
    id: "procedural-vs-oop",
    title: "Procedural vs Object-Oriented Programming",
    columns: ["Procedural", "Object-Oriented"],
    rows: [
      ["Organised around functions that operate on data.", "Organised around objects that bundle data and behaviour together."],
      ["Data and functions are kept separate.", "Data (attributes) and functions (methods) are encapsulated together."],
      ["Harder to model complex, real-world relationships.", "Models real-world entities naturally via classes and objects."],
      ["Little built-in support for reuse beyond functions.", "Supports reuse via inheritance and polymorphism."],
    ],
  },
  {
    id: "compile-time-vs-runtime",
    title: "Compile-time vs Runtime",
    columns: ["Compile-time", "Runtime"],
    rows: [
      ["Happens while the compiler translates source to machine code.", "Happens while the program is executing."],
      ["Function overloading is resolved here.", "Virtual function calls (polymorphism) are resolved here."],
      ["Errors here (syntax, type mismatches) stop compilation.", "Errors here (e.g. a null-pointer dereference) misbehave at execution."],
      ["Example: choosing between f(int) and f(double).", "Example: p->speak() dispatching through vptr/vtable."],
    ],
  },
];
