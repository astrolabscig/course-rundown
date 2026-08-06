export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

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

  // ---------- Computer Science Foundations (C++ as a lens on CS) ----------
  {
    id: "mcq-cs-1",
    question: "Which container gives O(1) random access to its nth element: std::vector or std::list?",
    options: ["std::vector", "std::list", "Both, equally", "Neither"],
    correctIndex: 0,
    explanation: "std::vector stores elements contiguously, so index arithmetic (base + n*sizeof(T)) is O(1). std::list is a doubly linked list, so reaching the nth element requires O(n) traversal.",
  },
  {
    id: "mcq-cs-2",
    question: "What is the amortized time complexity of std::vector::push_back?",
    options: ["O(1) amortized", "O(n) every call, no exceptions", "O(log n)", "O(n²)"],
    correctIndex: 0,
    explanation: "A single push_back can be O(n) when the underlying array must grow and copy, but because capacity grows geometrically (typically doubling), the average cost per push_back across many calls works out to O(1) — amortized constant time.",
  },
  {
    id: "mcq-cs-3",
    question: "std::sort in the C++ standard library guarantees a worst-case time complexity of:",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctIndex: 0,
    explanation: "Since C++11, std::sort is required to run in O(n log n) worst case. Implementations typically use introsort — quicksort that falls back to heapsort if recursion gets too deep — precisely to avoid plain quicksort's O(n²) worst case.",
  },
  {
    id: "mcq-cs-4",
    question: "Average-case lookup time in std::unordered_map vs std::map:",
    options: ["O(1) vs O(log n)", "O(log n) vs O(1)", "O(n) vs O(log n)", "O(1) vs O(1)"],
    correctIndex: 0,
    explanation: "std::unordered_map is a hash table: average-case O(1) lookup (worst case O(n) with many collisions). std::map is a balanced red-black tree: guaranteed O(log n) lookup, insert, and erase.",
  },
  {
    id: "mcq-cs-5",
    question: "Binary search on a sorted array of n elements has time complexity:",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
    correctIndex: 0,
    explanation: "Binary search halves the search space on each comparison, so the number of steps needed to shrink n elements down to 1 is log₂(n) — O(log n).",
  },
  {
    id: "mcq-cs-6",
    question: "Why is allocating a local variable on the stack typically much faster than allocating with new on the heap?",
    options: [
      "Stack allocation is just moving a pointer up/down a pre-reserved region; heap allocation must search for a free block and update bookkeeping structures",
      "Stack memory physically lives on the GPU",
      "Heap allocation always requires a network round trip",
      "There is no real performance difference between the two",
    ],
    correctIndex: 0,
    explanation: "The stack is a simple, pre-reserved region where allocation/deallocation is just adjusting a stack pointer — O(1) with almost no overhead. The heap allocator has to find a suitably sized free block and update internal metadata, which costs more.",
  },
  {
    id: "mcq-cs-7",
    question: "RAII (Resource Acquisition Is Initialization) ties a resource's lifetime to:",
    options: [
      "An object's scope — its destructor releases the resource deterministically when the object goes out of scope",
      "The garbage collector's next sweep",
      "The operating system shutting down",
      "A periodic timer interrupt",
    ],
    correctIndex: 0,
    explanation: "RAII is C++'s core resource-management idiom: acquire a resource in a constructor, release it in the destructor, so it's automatically and deterministically cleaned up whenever the object's scope ends — no separate garbage collector needed.",
  },
  {
    id: "mcq-cs-8",
    question: "Writing past the end of a raw C-style array is a classic source of security vulnerabilities mainly because:",
    options: [
      "C++ performs no automatic bounds checking on raw arrays, so an out-of-bounds write silently corrupts adjacent memory",
      "The compiler always catches it and refuses to build",
      "It only ever affects performance, never correctness",
      "Arrays automatically resize themselves to fit whatever is written",
    ],
    correctIndex: 0,
    explanation: "Unlike higher-level languages that bounds-check every access, C++ raw arrays trust the programmer completely. An out-of-bounds write just overwrites whatever memory happens to be there — the root cause behind classic buffer-overflow exploits.",
  },
  {
    id: "mcq-cs-9",
    question: "Modern computers represent negative integers in binary using:",
    options: ["Two's complement", "Sign-magnitude only", "Excess-3 code", "ASCII encoding"],
    correctIndex: 0,
    explanation: "Two's complement is the near-universal representation because it lets addition/subtraction hardware treat positive and negative numbers uniformly, with no separate circuitry needed.",
  },
  {
    id: "mcq-cs-10",
    question: "Endianness describes:",
    options: [
      "The order in which the bytes of a multi-byte value are laid out in memory",
      "The order in which operators are evaluated in an expression",
      "The order source files are compiled in",
      "The order threads are scheduled to run",
    ],
    correctIndex: 0,
    explanation: "Endianness (big- vs little-endian) is purely about byte ordering in memory for multi-byte types like int — it matters when reading raw memory/network bytes directly, e.g. when parsing binary file formats or network packets.",
  },
  {
    id: "mcq-cs-11",
    question: "Unbounded recursion with no base case eventually crashes a program because:",
    options: [
      "Each call pushes a new stack frame, and the call stack has a fixed size — exhausting it causes a \"stack overflow\"",
      "The CPU runs out of available registers",
      "The heap becomes too fragmented to continue",
      "It always triggers an integer overflow first",
    ],
    correctIndex: 0,
    explanation: "Every function call reserves space on the call stack for its local variables and return address. The stack has a fixed size (often around 1MB by default); recursion with no terminating base case keeps pushing frames until that space runs out.",
  },
  {
    id: "mcq-cs-12",
    question: "C++ templates achieve generic programming primarily by:",
    options: [
      "Generating separate compiled code for each concrete type used, at compile time (template instantiation)",
      "Sharing one runtime dispatch table across every type, resolved at runtime",
      "Automatically converting arguments to a common type at runtime",
      "Using reflection to inspect types while the program is running",
    ],
    correctIndex: 0,
    explanation: "Unlike Java's type-erased generics (one compiled version shared across all types), C++ templates are instantiated per type at compile time — the compiler literally generates a distinct version of the function/class for each type it's used with.",
  },
  {
    id: "mcq-cs-13",
    question: "Calling a virtual function typically costs a little more than a non-virtual call because:",
    options: [
      "It needs an extra indirection through the object's vtable pointer to find the correct override at runtime",
      "Virtual functions are always force-inlined, which is slower",
      "It triggers a garbage-collection cycle",
      "It requires a system call to the OS",
    ],
    correctIndex: 0,
    explanation: "Dynamic dispatch works by looking up the right function through a per-class virtual table (vtable) pointer stored in the object — one extra memory indirection compared to a direct, statically-resolved call.",
  },
  {
    id: "mcq-cs-14",
    question: "std::shared_ptr manages an object's lifetime using:",
    options: [
      "A reference count, decremented as each shared_ptr goes out of scope; the object is freed once the count hits zero",
      "A garbage collector that periodically scans memory",
      "Manual delete calls the programmer must remember to write",
      "The operating system's virtual memory manager",
    ],
    correctIndex: 0,
    explanation: "shared_ptr implements reference counting: every copy increments a shared counter, every destruction decrements it, and the managed object is deleted automatically the moment the count reaches zero.",
  },
  {
    id: "mcq-cs-15",
    question: "Move semantics (std::move, move constructors) primarily exist in C++ to:",
    options: [
      "Avoid unnecessary deep copies by transferring ownership of a resource instead of duplicating it",
      "Make source code shorter to type",
      "Provide automatic garbage collection",
      "Let multiple threads safely share one object",
    ],
    correctIndex: 0,
    explanation: "Move semantics let a resource (e.g., a heap buffer inside a std::vector) be handed off from a temporary/rvalue to a new object by just copying a pointer, instead of doing an expensive full deep copy of the underlying data.",
  },
  {
    id: "mcq-cs-16",
    question: "C++ being a statically typed language means:",
    options: [
      "Variable types are checked and fixed at compile time, not discovered while the program is running",
      "Every variable must be declared with the static keyword",
      "Variables can never change value after initialization",
      "Types are only checked if the program crashes",
    ],
    correctIndex: 0,
    explanation: "Static typing means the compiler determines and checks every variable's and expression's type before the program ever runs, catching type errors (like passing a string where an int is expected) at compile time rather than at runtime.",
  },
  {
    id: "mcq-cs-17",
    question: "Put these C++ build stages in the correct order:",
    options: [
      "Preprocessing → Compilation → Assembly → Linking",
      "Linking → Compilation → Preprocessing → Assembly",
      "Compilation → Linking → Preprocessing → Assembly",
      "Assembly → Preprocessing → Linking → Compilation",
    ],
    correctIndex: 0,
    explanation: "The preprocessor expands #include/#define first, the compiler translates the resulting source into assembly, the assembler turns that into machine-code object files, and the linker finally combines object files (and libraries) into one executable.",
  },
  {
    id: "mcq-cs-18",
    question: "Splitting a C++ program into multiple .cpp files compiled separately and combined by the linker exists mainly to:",
    options: [
      "Let large codebases be built incrementally and in parallel, recompiling only what changed",
      "Make the finished program run faster at runtime",
      "Reduce the total number of variables the program needs",
      "Avoid needing a main function anywhere",
    ],
    correctIndex: 0,
    explanation: "Separate compilation is a software-engineering necessity at scale: a codebase with thousands of files would be unbuildable if every change forced a full from-scratch rebuild. Compiling per translation unit lets build systems recompile only the files that actually changed.",
  },
  {
    id: "mcq-cs-19",
    question: "When a C++ exception propagates up through several function calls, what happens to the local objects in each function it passes through?",
    options: [
      "Their destructors run, in reverse order of construction — \"stack unwinding\"",
      "Nothing; their memory just leaks until the whole program exits",
      "They are silently moved onto the heap",
      "The program terminates immediately with no cleanup at all",
    ],
    correctIndex: 0,
    explanation: "C++ guarantees stack unwinding: as an exception propagates, every local object already fully constructed in each stack frame it passes through has its destructor called, in reverse construction order — which is exactly why RAII and exceptions work well together.",
  },
  {
    id: "mcq-cs-20",
    question: "Even though both offer O(n) full traversal, iterating a std::vector is usually much faster in practice than iterating a std::list of the same size, mainly because:",
    options: [
      "Vector elements sit contiguously in memory, so the CPU cache prefetches them efficiently; list nodes are scattered, causing cache misses",
      "Vectors always use less total memory than lists in every case",
      "std::list is required to copy itself before any iteration",
      "std::vector secretly runs on multiple threads",
    ],
    correctIndex: 0,
    explanation: "Big-O counts operations, not real-world speed. A vector's contiguous layout means sequential access matches how CPU caches fetch memory in blocks (cache lines), while a linked list's scattered nodes cause frequent, costly cache misses — same asymptotic complexity, very different real performance.",
  },
  {
    id: "mcq-cs-21",
    question: "In a hash table like std::unordered_map, a \"collision\" happens when:",
    options: [
      "Two different keys hash to the same bucket index",
      "The table physically runs out of memory",
      "Two threads try to write to it at the same instant",
      "A key is inserted twice with the same value",
    ],
    correctIndex: 0,
    explanation: "A collision is when the hash function maps two distinct keys to the same bucket. Hash tables handle this with strategies like chaining (a linked list per bucket) or open addressing — which is also why worst-case lookup can degrade to O(n) if collisions pile up.",
  },
  {
    id: "mcq-cs-22",
    question: "Passing a large std::vector by const reference (const std::vector<int>&) instead of by value into a function primarily avoids:",
    options: [
      "An expensive full copy of the vector's contents on every single call",
      "Any possibility of the function reading the vector's contents",
      "The need for the function to have a return statement",
      "Compilation entirely",
    ],
    correctIndex: 0,
    explanation: "Passing by value would copy every element in the vector each time the function is called. A const reference gives read-only access to the original data with no copy at all — critical for performance when the container is large.",
  },
  {
    id: "mcq-cs-23",
    question: "Marking a member function const (e.g., int size() const;) tells the compiler to:",
    options: [
      "Reject any code inside that function which tries to modify the object's member variables",
      "Make the function execute faster",
      "Automatically cache and reuse the function's return value",
      "Prevent the function from ever being called",
    ],
    correctIndex: 0,
    explanation: "const-correctness is a compile-time guarantee: a const member function promises (and the compiler enforces) that calling it will never modify the object's observable state — letting the compiler catch accidental mutations as errors instead of runtime bugs.",
  },
  {
    id: "mcq-cs-24",
    question: "Using bitwise AND with a mask (e.g., flags & 0b0100) is a common low-level technique for:",
    options: [
      "Checking whether one specific bit/flag is set, without needing a separate boolean variable for it",
      "Dividing a number by 4",
      "Converting an integer to a string",
      "Safely comparing two floating-point numbers for equality",
    ],
    correctIndex: 0,
    explanation: "Bitmasking packs many independent true/false flags into the bits of a single integer; ANDing with a mask that has only the bit of interest set isolates that one flag — a technique used throughout systems programming (permission flags, hardware registers, protocol headers).",
  },
  {
    id: "mcq-cs-25",
    question: "A \"race condition\" occurs when:",
    options: [
      "Two or more threads access shared data concurrently and the outcome depends on unpredictable timing",
      "A program simply runs slower than expected",
      "A loop executes one iteration too many",
      "A function calls itself recursively",
    ],
    correctIndex: 0,
    explanation: "A race condition is a concurrency bug: when multiple threads read/write shared state without coordination, the final result depends on the unpredictable order their operations happen to interleave in — the same code can behave differently from run to run.",
  },
  {
    id: "mcq-cs-26",
    question: "A std::mutex is used to:",
    options: [
      "Ensure only one thread executes a critical section of code at a time, preventing race conditions",
      "Speed up code that only ever runs on a single thread",
      "Automatically parallelize a loop across CPU cores",
      "Allocate memory on the heap",
    ],
    correctIndex: 0,
    explanation: "A mutex (\"mutual exclusion\") is a lock: a thread must acquire it before entering a critical section and release it after, guaranteeing only one thread at a time can touch the shared data the mutex protects.",
  },
  {
    id: "mcq-cs-27",
    question: "A function with two nested loops, each independently running n times, has time complexity:",
    options: ["O(n²)", "O(n)", "O(2n)", "O(log n)"],
    correctIndex: 0,
    explanation: "The inner loop runs n times for every one of the n outer-loop iterations, giving n × n = n² total operations — O(n²), the classic signature of nested loops over the same input size.",
  },
  {
    id: "mcq-cs-28",
    question: "Memoization (caching a function's results so repeated calls with the same input are instant) is a classic example of trading:",
    options: [
      "Extra memory (space) for faster repeated computation (time)",
      "Correctness for speed",
      "Time for correctness",
      "Nothing — it comes with no real cost",
    ],
    correctIndex: 0,
    explanation: "Memoization stores previously computed results in memory so they don't have to be recomputed — a textbook space-time tradeoff: you spend memory to hold the cache in exchange for skipping repeated work.",
  },
  {
    id: "mcq-cs-29",
    question: "In large-scale software engineering, the main benefit of encapsulation (hiding an object's internal state behind a public interface) is:",
    options: [
      "The internal implementation can change freely without breaking any code that only depends on the public interface",
      "It makes the compiled program run faster",
      "It removes the need for any testing",
      "It automatically parallelizes the program across cores",
    ],
    correctIndex: 0,
    explanation: "Encapsulation draws a hard boundary between \"what a class promises to do\" (its public interface) and \"how it does it\" (private internals). As long as the interface stays stable, the implementation can be rewritten freely — essential for maintaining large codebases over time.",
  },
  {
    id: "mcq-cs-30",
    question: "If int* p points to the first element of an int array (and sizeof(int) == 4 on this system), what address does p + 1 refer to?",
    options: [
      "The address 4 bytes after p — i.e., the next int element",
      "The address exactly 1 byte after p",
      "The exact same address as p",
      "An address chosen at random by the operating system",
    ],
    correctIndex: 0,
    explanation: "Pointer arithmetic is scaled by the pointee's size: p + 1 advances by sizeof(*p) bytes, not by 1 byte, so it correctly lands on the next element of the array rather than partway into the current one.",
  },
];
