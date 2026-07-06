export interface BasicsEntry {
  id: string;
  title: string;
  summary: string;
  eli5: string;
  code?: string;
  output?: string;
  points: string[];
}

export interface BasicsGroup {
  id: string;
  title: string;
  entries: BasicsEntry[];
}

export const basicsGroups: BasicsGroup[] = [
  {
    id: "program-structure",
    title: "Program structure",
    entries: [
      {
        id: "include-main",
        title: "#include, main(), namespaces",
        summary: "Every program needs the right headers and exactly one main().",
        eli5:
          "Think of your computer as a kitchen. #include is like grabbing a recipe book off the shelf so you can use tools someone else already wrote — like the ability to print text. main() is the front door of your program: no matter how many other rooms (functions) your program has, the computer always walks in through main() first, and the moment main() finishes, the whole program is over.",
        code: `#include <iostream>       // preprocessor directive: pulls in the iostream library
using namespace std;      // brings names like cout/cin into scope without std::

int main() {              // program execution always starts here
    cout << "Hello\\n";
    return 0;              // 0 = success
}`,
        output: "Hello",
        points: [
          "#include lines are handled by the preprocessor, before compilation.",
          "using namespace std; avoids writing std:: everywhere; std::cout is still safer in headers/large projects.",
          "main() must return int; return 0 signals success to the operating system.",
        ],
      },
    ],
  },
  {
    id: "variables-types",
    title: "Variables & data types",
    entries: [
      {
        id: "types-literals",
        title: "Types, literals, const, constexpr",
        summary: "The built-in types, how their literals are written, and how to make a value unchangeable.",
        eli5:
          "A variable is a labelled box that holds one value. The type (int, double, char...) tells the computer what KIND of thing fits in the box and how much shelf space to reserve for it — like labelling a box 'shoes' versus 'socks' so you grab the right size box before you even see what's inside.",
        code: `int age = 20;              // whole numbers
double gpa = 3.75;         // decimal, ~15 digits precision
float price = 9.99f;       // decimal, less precision than double
char grade = 'A';          // single character, single quotes
bool passed = true;        // true or false
std::string name = "Ama";  // text, needs <string>

const int MAX_SCORE = 100;   // fixed value, can be set from a runtime expression
constexpr int SIZE = 10;     // fixed value, must be known at compile time`,
        points: [
          "char uses single quotes 'A'; std::string/C-strings use double quotes \"A\".",
          "const can be initialised from a runtime value; constexpr must be known at compile time.",
          "Literal suffixes: 10 (int), 10.0 (double), 10.0f (float), 'A' (char), \"A\" (string).",
        ],
      },
    ],
  },
  {
    id: "operators",
    title: "Operators",
    entries: [
      {
        id: "operator-tour",
        title: "Arithmetic, relational, logical, assignment, ternary",
        summary: "The operator families you'll use in almost every line of C++.",
        eli5:
          "Operators are the same math and comparison symbols from school (+, -, >), just doing jobs in code. The one everyone trips over: a single = means \"put this value into the box,\" while a double == means \"are these two things the same?\" — a question, not an instruction.",
        code: `int a = 7, b = 2;
a + b;   // 9   arithmetic
a % b;   // 1   modulus (remainder)
a > b;   // true   relational
a == b;  // false  equality (not the same as =)
a && b;  // logical AND
a || b;  // logical OR
!true;   // logical NOT -> false
a += 3;  // shorthand for a = a + 3
a++;     // post-increment: use current value, then increment
++a;     // pre-increment: increment, then use new value
int max = (a > b) ? a : b;  // ternary: condition ? if-true : if-false`,
        points: [
          "= is assignment, == is comparison — a very common exam trap.",
          "a++ evaluates to the old value; ++a evaluates to the new value.",
          "The ternary ?: is a compact if/else that produces a value.",
        ],
      },
    ],
  },
  {
    id: "casting",
    title: "Type conversion & casting",
    entries: [
      {
        id: "implicit-explicit",
        title: "Implicit vs explicit conversion",
        summary: "C++ sometimes converts types for you; other times you must say so explicitly.",
        eli5:
          "Casting is like pouring a big jug (a double, with a decimal part) into a small cup (an int). Some of it — the decimal part — spills out and is gone for good. Writing static_cast<int>(...) is you saying \"yes, I meant to do that\" instead of it happening to you by accident.",
        code: `double d = 9.7;
int i = d;                            // implicit conversion: truncates to 9
int x = static_cast<int>(d);          // explicit cast: same result, intent is clear
double back = static_cast<double>(i); // explicit widening back to double`,
        points: [
          "Implicit conversion happens automatically (e.g. int → double) and can silently lose data (double → int truncates).",
          "Explicit conversion uses static_cast<Type>(value) — it states your intent and is safer than relying on an implicit narrowing assignment.",
          "Converting double to int truncates toward zero; it does not round.",
        ],
      },
    ],
  },
  {
    id: "io",
    title: "Input / output",
    entries: [
      {
        id: "cin-cout-getline",
        title: "cin, cout, getline",
        summary: "Reading a single token is different from reading a whole line.",
        eli5:
          "cout is the computer talking to you (it prints to the screen). cin is you talking to the computer (typing something in). getline is like cin but with better hearing — it listens for a whole sentence including spaces, instead of stopping at the very first gap between words.",
        code: `int age;
std::string name;

std::cout << "Enter your age: ";
std::cin >> age;                // reads one whitespace-separated token

std::cin.ignore();               // clear the leftover newline
std::cout << "Enter your name: ";
std::getline(std::cin, name);    // reads a full line, including spaces

std::cout << name << " is " << age << "\\n";`,
        points: [
          "cin >> stops at whitespace, so it can't read multi-word input in one go.",
          "getline(cin, str) reads the whole line, including spaces.",
          "Mixing cin >> and getline needs cin.ignore() to skip the leftover newline character.",
        ],
      },
    ],
  },
  {
    id: "control-flow",
    title: "Control flow",
    entries: [
      {
        id: "if-switch",
        title: "if / else if / else, switch",
        summary: "Branching on a condition, or on one value against a set of constants.",
        eli5:
          "if/else is the program asking a yes/no question and picking a path — like \"if it's raining, take an umbrella, else wear sunglasses.\" switch is for picking one exact option out of a list, like a vending machine matching the exact button you pressed.",
        code: `int score = 72;

if (score >= 70) {
    std::cout << "First Class\\n";
} else if (score >= 60) {
    std::cout << "Second Class\\n";
} else {
    std::cout << "Pass\\n";
}

char grade = 'B';
switch (grade) {
    case 'A': std::cout << "Excellent\\n"; break;
    case 'B': std::cout << "Good\\n"; break;
    default:  std::cout << "Keep trying\\n";
}`,
        output: "First Class\nGood",
        points: [
          "else if chains are checked top to bottom; only the first true branch runs.",
          "switch compares one value against constant cases; forgetting break causes fall-through into the next case.",
          "default in switch is optional but catches anything not matched.",
        ],
      },
    ],
  },
  {
    id: "loops",
    title: "Loops",
    entries: [
      {
        id: "for-while-dowhile",
        title: "for, while, do-while, break, continue",
        summary: "Three ways to repeat, and two ways to interrupt a loop early.",
        eli5:
          "A loop is how the computer repeats a chore without you writing it out over and over — like saying \"wash 10 dishes\" instead of writing \"wash a dish\" ten separate times. for suits jobs where you know the count up front; while keeps going until something changes; do-while is like while but always does the chore at least once before it even checks.",
        code: `for (int i = 0; i < 5; i++) {   // init; condition; update
    if (i == 3) continue;        // skip this iteration
    std::cout << i << " ";
}

int n = 0;
while (n < 3) {                  // condition checked before each run
    std::cout << n << " ";
    n++;
}

int m = 0;
do {                              // body runs at least once
    std::cout << m << " ";
    m++;
} while (m < 3);`,
        output: "0 1 2 4 0 1 2 0 1 2",
        points: [
          "for is best when you know the number of iterations up front.",
          "while checks the condition first — it may run zero times.",
          "do-while checks after the body — it always runs at least once.",
          "break exits the loop entirely; continue skips straight to the next iteration.",
        ],
      },
    ],
  },
  {
    id: "arrays-strings",
    title: "Arrays & strings",
    entries: [
      {
        id: "arrays-cstrings",
        title: "1D/2D arrays, C-strings vs std::string",
        summary: "Fixed-size collections, and the two ways C++ represents text.",
        eli5:
          "An array is a row of same-sized boxes lined up next to each other, each labelled with a number instead of a name — like lockers in a hallway, numbered from 0. A string is just an array of characters lined up to spell a word, with a hidden \"stop here\" marker at the end so the computer knows where the word finishes.",
        code: `int scores[5] = {10, 20, 30, 40, 50};   // 1D array, fixed size
scores[0] = 15;                          // indices start at 0

int grid[2][3] = {{1, 2, 3}, {4, 5, 6}}; // 2D array (rows x cols)
int cell = grid[1][2];                    // 6

char cname[] = "Ama";        // C-string: char array + hidden '\\0' terminator
std::string name = "Ama";    // std::string: manages its own memory`,
        points: [
          "Array indices start at 0; scores[5] on a size-5 array is out of bounds (undefined behaviour, not a compile error).",
          "A C-string always ends with a hidden null terminator '\\0'.",
          "std::string is safer and easier than C-strings: it supports +, ==, .length(), and resizes itself.",
        ],
      },
      {
        id: "cstring-mistakes",
        title: "Common C-string exam mistakes",
        summary: "The three C-string traps that show up again and again on exams.",
        eli5:
          "A C-string is like a sentence written on a strip of paper with a period at the very end — the period IS the null terminator. Forget to leave room for it, copy a longer sentence onto a shorter strip, or try to compare two strips by just checking if they're the same PIECE OF PAPER instead of reading the words on them, and you get exactly the three classic mistakes below.",
        code: `char small[4] = "Ama";       // 'A','m','a','\\0' — exactly fits, no room to spare
char oops[3] = "Ama";        // ERROR/UB: no room left for the '\\0' terminator

char dest[4];
strcpy(dest, "Kwame");       // UB: "Kwame" + '\\0' needs 6 bytes, dest only has 4 — buffer overflow

char a[] = "hi";
char b[] = "hi";
if (a == b) { /* ... */ }    // WRONG: compares the two array addresses, not the text
if (strcmp(a, b) == 0) { /* ... */ }  // correct: compares the actual characters`,
        points: [
          "A char array holding a C-string needs room for the text PLUS one extra byte for the hidden '\\0' — a 3-letter word needs a 4-byte array, not 3.",
          "strcpy doesn't check the destination's size — copying a longer string into a smaller buffer silently corrupts memory (a classic buffer overflow).",
          "== on two C-strings (char arrays/pointers) compares their addresses, not their contents — even if the text is identical, it's usually false. Use strcmp(a, b) == 0 instead.",
          "std::string sidesteps all three: it manages its own size automatically and == compares actual characters.",
        ],
      },
    ],
  },
  {
    id: "functions",
    title: "Functions",
    entries: [
      {
        id: "declare-define-call",
        title: "Declaration vs definition vs call; parameters vs arguments",
        summary: "The compiler needs to know a function exists before it's used — and default arguments have a strict rule.",
        eli5:
          "A function is a mini-recipe you can reuse by name instead of rewriting its steps every time. Declaring it is putting its name and ingredient list on the menu so the kitchen knows it exists; defining it is writing out the actual steps; calling it is placing the order.",
        code: `int add(int a, int b);              // prototype/declaration

int add(int a, int b) {             // definition (the actual body)
    return a + b;
}

void greet() {                      // void: returns nothing
    std::cout << "Hi\\n";
}

int addWithDefault(int a, int b = 10) {  // default argument
    return a + b;
}

int main() {
    int sum = add(2, 3);      // call: 2 and 3 are the arguments
    greet();
    addWithDefault(5);        // uses b = 10
}`,
        points: [
          "Parameters are the names in the function's own definition; arguments are the actual values passed at the call site.",
          "A function with no return value must be declared void; a value-returning function needs a matching return type.",
          "Default arguments must be rightmost: void f(int a, int b = 5) is fine; void f(int a = 5, int b) is not.",
        ],
      },
      {
        id: "overloading-basics",
        title: "Overloading",
        summary: "Same function name, different parameter lists — but return type alone isn't enough.",
        eli5:
          "Overloading is having several recipes that share a name but use different ingredients — \"make juice\" with oranges versus \"make juice\" with apples. The compiler looks at what you actually handed it and automatically picks the matching recipe.",
        code: `int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }   // overload: different parameter types

// double add(int a, int b);   // ERROR if this existed alongside int add(int,int):
                                // differs only by return type, not allowed`,
        points: [
          "Overloading means same name, different parameter list (type and/or number of parameters).",
          "The compiler picks the best match by argument types at compile time.",
          "Return type alone cannot distinguish two overloads — that produces a redeclaration/ambiguity error.",
        ],
      },
      {
        id: "value-vs-reference",
        title: "Call by value vs call by reference",
        summary: "Whether the function gets a copy, or a direct alias to the caller's variable.",
        eli5:
          "Passing by value is like handing someone a photocopy of your document — they can scribble all over it, but your original stays untouched. Passing by reference is like handing them the real, original document — anything they write on it is really there when you get it back. See the full walkthrough with a live diagram in Part 1 — Functions.",
        code: `void byValue(int x) { x = 100; }        // x is a COPY; caller's variable is unchanged
void byReference(int &x) { x = 100; }   // x is an ALIAS; caller's variable changes

int main() {
    int a = 5;
    byValue(a);
    std::cout << a << "\\n";   // 5 - unchanged

    int b = 5;
    byReference(b);
    std::cout << b << "\\n";   // 100 - changed
}`,
        output: "5\n100",
        points: [
          "Call by value copies the argument — changes inside the function do not escape it.",
          "Call by reference (int &x) binds directly to the caller's variable — changes are visible after the call.",
          "Try this live in the Memory & Pointer Simulator in Part 1 — Functions.",
        ],
      },
    ],
  },
  {
    id: "pointers",
    title: "Pointers",
    entries: [
      {
        id: "pointer-basics",
        title: "&, *, null pointers, pointer arithmetic",
        summary: "A pointer is a variable that stores a memory address.",
        eli5:
          "Imagine every variable in your program lives in its own numbered mailbox. A normal variable (int score = 42;) is a mailbox with 42 sitting inside it. A pointer is a completely different kind of box: instead of holding 42, it holds a sticky note with another mailbox's NUMBER written on it — directions to where the real value lives, not the value itself. \"Dereferencing\" a pointer (writing *p) means \"walk to the mailbox number written on this sticky note, and open THAT one.\" That's why pointers feel confusing at first: p and *p are two totally different questions — \"what does the sticky note say?\" versus \"what's inside the mailbox the sticky note points to?\" See the full step-by-step walkthrough with a live diagram in Part 1 — Functions.",
        code: `int score = 42;
int *p = &score;      // & = address-of; p stores score's address
std::cout << *p;      // * = dereference; reads the value at that address -> 42
*p = 100;             // modifies score through the pointer -> score is now 100

int *empty = nullptr; // null pointer: points to nothing`,
        output: "42",
        points: [
          "& takes an address; * declares a pointer OR dereferences one, depending on context.",
          "A null pointer (nullptr) points to nothing — dereferencing it crashes the program.",
          "Pointer arithmetic (p + 1) moves by sizeof(the pointed-to type), not by 1 byte.",
          "Try this live in the Memory & Pointer Simulator in Part 1 — Functions.",
        ],
      },
    ],
  },
  {
    id: "references",
    title: "References",
    entries: [
      {
        id: "reference-basics",
        title: "References as aliases",
        summary: "A reference is another name for an existing variable — not a new one.",
        eli5:
          "If a pointer is a sticky note with a mailbox number on it, a reference is a second NAME TAG glued directly onto an existing mailbox. int &ref = score; does not create a new mailbox at all — it just means \"score\" and \"ref\" are now two labels stuck on the exact same box. There's no address to follow, no sticky note, no separate step of \"opening\" anything — writing to ref IS writing to score, because they were never two different things. That's also why a reference can't be reseated later: you can't peel a nametag off one mailbox and glue it onto a different one once it's stuck. See the full step-by-step walkthrough with a live diagram in Part 1 — Functions.",
        code: `int score = 42;
int &ref = score;    // ref is another name for score, not a new variable
ref = 50;            // score is now 50

// int &bad;         // ERROR: a reference must be initialised when declared`,
        points: [
          "A reference must be initialised at declaration and can never be reseated to refer to something else.",
          "A pointer can be reassigned and can be null; a reference cannot.",
          "References are the usual way to implement call-by-reference function parameters.",
        ],
      },
    ],
  },
  {
    id: "dynamic-memory",
    title: "Dynamic memory",
    entries: [
      {
        id: "new-delete",
        title: "new / delete, new[] / delete[], leaks, dangling pointers",
        summary: "Memory you allocate yourself on the heap — and must free yourself.",
        eli5:
          "The stack is like a small desk drawer: whatever you put in it (ordinary variables) disappears automatically the instant you're done — the moment the function that created them ends. Fast and tidy, but limited in size, and everything in it vanishes on its own. The heap is like renting a storage unit across town: you can put things there whenever you decide (new), and they stay exactly as long as you want — but nobody empties it for you. If you forget to go get your stuff out (delete), you keep \"renting\" that space forever even though you're not using it — that's a memory leak.",
        code: `int *p = new int(42);   // allocate one int on the heap, initialised to 42
std::cout << *p;
delete p;                // free it
p = nullptr;              // avoid a dangling pointer

int *arr = new int[5];   // allocate an array on the heap
delete[] arr;             // must use delete[] for arrays, not delete

// Forgetting delete   -> memory leak (block is unreachable but never freed)
// Using p after delete without reassigning -> dangling pointer / use-after-free`,
        output: "42",
        points: [
          "new allocates on the heap and returns a pointer to it; the memory lives until you delete it (or the program ends).",
          "Use delete for a single new, delete[] for a new[] array — mismatching them is undefined behaviour.",
          "Forgetting delete → memory leak. Using a pointer after delete → dangling pointer (undefined behaviour).",
          "Try this live in the Memory & Pointer Simulator in Part 1 — Functions.",
        ],
      },
    ],
  },
  {
    id: "struct-enum",
    title: "struct vs class, enum",
    entries: [
      {
        id: "struct-class-enum",
        title: "Default access, and plain vs scoped enums",
        summary: "struct and class differ only in their default access level.",
        eli5:
          "struct and class are the exact same toolbox, just with a different default lock setting: a struct's contents are left unlocked (public) for anyone to grab by default, a class's are locked (private) unless you say otherwise. An enum is just giving friendly names to a fixed set of choices, like calling them \"Monday\" through \"Sunday\" instead of remembering the numbers 1 through 7.",
        code: `struct Point {     // members are public by default
    int x;
    int y;
};

class Point2 {      // members are private by default
    int x;
    int y;
};

enum Color { RED, GREEN, BLUE };        // plain enum: RED == 0, names leak into scope
enum class Direction { North, South };  // scoped enum: must write Direction::North`,
        points: [
          "struct and class are identical except for default access: public for struct, private for class.",
          "Plain enum values are just ints and can clash with other names in scope.",
          "enum class scopes its values (Direction::North) and doesn't implicitly convert to int.",
        ],
      },
    ],
  },
];
