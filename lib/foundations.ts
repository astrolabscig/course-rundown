export interface CodeVariant {
  label: string;
  code: string;
  kind: "output" | "error";
  result: string;
  fixNote?: string;
}

export interface FoundationCardData {
  id: string;
  title: string;
  situation: string;
  variants: CodeVariant[];
  why: string;
  examTip: string;
}

export const foundations: FoundationCardData[] = [
  {
    id: "foundation-1",
    title: "Foundation 1 — main() is where everything starts",
    situation:
      "Every C++ program needs exactly one place where execution begins.",
    variants: [
      {
        label: "Correct",
        kind: "output",
        code: `#include <iostream>   // brings in std::cout

int main() {          // execution starts here
    std::cout << "Hello, C++\\n";
    return 0;         // 0 tells the system the program succeeded
}`,
        result: "Hello, C++",
      },
      {
        label: "Break it",
        kind: "error",
        code: `#include <iostream>

void run() {
    std::cout << "Hello, C++\\n";
}`,
        result: `/usr/bin/ld: undefined reference to \`main'
collect2: error: ld returned 1 exit status`,
        fixNote: "Fix: rename run to main.",
      },
    ],
    why: "The compiler produces the code, but the system needs one known entry point — main — to start.",
    examTip:
      "\"undefined reference to `main`\" means you forgot int main(), not that your logic is wrong.",
  },
  {
    id: "foundation-2",
    title: "Foundation 2 — Where functions go, and why order matters",
    situation:
      "The compiler reads your file top to bottom, so it must already know about a function before you call it.",
    variants: [
      {
        label: "Correct",
        kind: "output",
        code: `#include <iostream>

void greet() {                 // defined at file scope, above main
    std::cout << "Welcome to C++\\n";
}

int main() {
    greet();                   // called from inside main
    return 0;
}`,
        result: "Welcome to C++",
      },
      {
        label: "Break it A",
        kind: "error",
        code: `#include <iostream>

int main() {
    greet();                   // used before the compiler has seen it
    return 0;
}

void greet() {
    std::cout << "Welcome to C++\\n";
}`,
        result: "error: 'greet' was not declared in this scope",
        fixNote:
          "Fix: move greet() above main, or add prototype void greet(); above main.",
      },
      {
        label: "Break it B",
        kind: "error",
        code: `int main() {
    void greet() {             // illegal: cannot define a function inside another
        std::cout << "Welcome to C++\\n";
    }
    greet();
    return 0;
}`,
        result: "error: a function-definition is not allowed here before '{' token",
        fixNote: "Fix: move greet() to file scope, outside of main.",
      },
    ],
    why: "The compiler reads top to bottom, so it must know a function exists before you call it; and functions belong at file scope — main just calls them.",
    examTip:
      "\"was not declared in this scope\" usually means a missing prototype or wrong order.",
  },
  {
    id: "foundation-3",
    title: "Foundation 3 — Statements and the small rules that fail loudly",
    situation:
      "Every statement ends with a semicolon — the compiler treats the statement as unfinished until it sees one.",
    variants: [
      {
        label: "Correct",
        kind: "output",
        code: `#include <iostream>

int main() {
    int age = 20;
    std::cout << "Age: " << age << "\\n";
    return 0;
}`,
        result: "Age: 20",
      },
      {
        label: "Break it",
        kind: "error",
        code: `    int age = 20            // no semicolon
    std::cout << age;`,
        result: "error: expected ';' before 'std'",
        fixNote: "Fix: add a semicolon after int age = 20.",
      },
    ],
    why: "The compiler treats a statement as unfinished until ';', so it reports the error on the next line.",
    examTip:
      "When an error points at a line that looks fine, check the line above for a missing semicolon.",
  },
];
