Build Spec — C++ Course Helper (Foundations → OOP) with Admin Analytics
For Claude Code. Save this file as `SPEC.md` in an empty folder, open Claude Code in that folder, and give it this task: "Build the app described in SPEC.md. Work in logical steps, commit as you go, and run `npm run build` at the end to confirm it compiles."
PROJECT OVERVIEW
A polished, production-quality Next.js app, deployable on Vercel, that helps university students pass their C++ course. It teaches C++ fundamentals — syntax, implementation, and the reasoning behind them — first, then branches into OOP. For every idea the student sees the correct code and its output, a broken version with the real compiler/linker error, the fix, and a plain-language "why." It also has a feedback feature and a secret admin dashboard (password-protected) showing feedback and usage analytics.
TECH STACK (required)

* Next.js 14+ (App Router) + TypeScript
* Tailwind CSS
* @vercel/postgres (Neon-backed) for storage
* react-syntax-highlighter (Prism build, C++ language, a light theme such as `oneLight`)
* Node's built-in `crypto` for admin session signing (no auth library needed)
* No other heavy dependencies.
ENVIRONMENT VARIABLES (document in README; never hardcode secrets)

* `POSTGRES_URL` — database connection (auto-injected by Vercel Postgres)
* `ADMIN_PASSWORD` — the admin login password
* `ADMIN_SESSION_SECRET` — a long random string used to sign the admin session cookie
BUILD ORDER (follow in sequence)

1. Scaffold with `create-next-app` (TypeScript, App Router, Tailwind, `src/` optional).
2. Install `@vercel/postgres` and `react-syntax-highlighter` (+ its types).
3. Set up Tailwind theme tokens for the light, Coursera-style design system.
4. Create a DB helper that runs `CREATE TABLE IF NOT EXISTS` for both tables on first use.
5. Build the public page: Part 1 (Foundations) then Part 2 (OOP), using the card pattern.
6. Add access tracking (open vs. used).
7. Add the feedback feature.
8. Add the admin auth + dashboard (login, middleware, protected page, logout).
9. Write the README and run `npm run build` to verify.
DATA MODEL

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id         SERIAL PRIMARY KEY,
  useful     TEXT NOT NULL,           -- 'yes' | 'no'
  comment    TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_access (
  id         SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,    -- random id kept in the browser
  interacted BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

ROUTES

* `/` — the public learning app
* `/admin/login` — password form (not linked from anywhere)
* `/admin` — protected dashboard
* `POST /api/feedback` — save feedback
* `POST /api/track` — record an app open or an interaction
* `POST /api/admin/login` — verify password, set session cookie
* `POST /api/admin/logout` — clear session cookie
PART 1 — C++ FOUNDATIONS
Card pattern for every card: 1. situation (one sentence) → 2. interaction (a Correct / Break it toggle) → 3. code (syntax-highlighted) → 4. result (console output for correct; the real error for broken, styled red) → 5. why (2–4 sentences) → 6. exam tip. Every "broken" example must produce the exact real error.
Foundation 1 — `main()` is where everything starts
Correct:

```cpp
#include <iostream>   // brings in std::cout

int main() {          // execution starts here
    std::cout << "Hello, C++\n";
    return 0;         // 0 tells the system the program succeeded
}

```

Output: `Hello, C++` Break it (no `main`):

```cpp
#include <iostream>

void run() {
    std::cout << "Hello, C++\n";
}

```

Real linker error:

```
/usr/bin/ld: undefined reference to `main'
collect2: error: ld returned 1 exit status

```

Fix: rename `run` to `main`. Why: the compiler produces the code, but the system needs one known entry point — `main` — to start. Exam tip: "undefined reference to `main`" means you forgot `int main()`, not that your logic is wrong.
Foundation 2 — Where functions go, and why order matters
Correct:

```cpp
#include <iostream>

void greet() {                 // defined at file scope, above main
    std::cout << "Welcome to C++\n";
}

int main() {
    greet();                   // called from inside main
    return 0;
}

```

Output: `Welcome to C++` Break it A (defined below `main`, no prototype):

```cpp
#include <iostream>

int main() {
    greet();                   // used before the compiler has seen it
    return 0;
}

void greet() {
    std::cout << "Welcome to C++\n";
}

```

Real error: `error: 'greet' was not declared in this scope` Fix: move `greet()` above `main`, or add prototype `void greet();` above `main`. Break it B (function defined inside `main`):

```cpp
int main() {
    void greet() {             // illegal: cannot define a function inside another
        std::cout << "Welcome to C++\n";
    }
    greet();
    return 0;
}

```

Real error: `error: a function-definition is not allowed here before '{' token` Why: the compiler reads top to bottom, so it must know a function exists before you call it; and functions belong at file scope — `main` just calls them. Exam tip: "was not declared in this scope" usually means a missing prototype or wrong order.
Foundation 3 — Statements and the small rules that fail loudly (keep concise)
Correct:

```cpp
#include <iostream>

int main() {
    int age = 20;
    std::cout << "Age: " << age << "\n";
    return 0;
}

```

Output: `Age: 20` Break it (missing semicolon):

```cpp
    int age = 20            // no semicolon
    std::cout << age;

```

Real error: `error: expected ';' before 'std'` Why: the compiler treats a statement as unfinished until `;`, so it reports the error on the next line. Exam tip: when an error points at a line that looks fine, check the line above for a missing semicolon.
PART 2 — OOP CONCEPTS
Concept 1 — Classes & Objects
Interaction: type a name and age, click Add object; each click spawns an independent object card holding its own data.

```cpp
#include <iostream>
#include <string>

class Student {              // the blueprint (class)
public:
    std::string name;
    int age;

    void introduce() {
        std::cout << "Hi, I'm " << name << ", age " << age << "\n";
    }
};

int main() {
    Student a;               // an object (instance)
    a.name = "Ama"; a.age = 20;
    a.introduce();

    Student b;               // an independent object
    b.name = "Kofi"; b.age = 22;
    b.introduce();
}

```

Output:

```
Hi, I'm Ama, age 20
Hi, I'm Kofi, age 22

```

Why: a class is a blueprint; objects are instances that each hold their own data. Exam tip: the class doesn't store data — the objects do.
Concept 2 — Encapsulation & Access Specifiers
Interaction: a `BankAccount` with two buttons — Deposit via method (works) and Set balance directly (fails, showing the real error in red).

```cpp
#include <iostream>

class BankAccount {
private:
    double balance = 0;          // hidden from outside

public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;   // controlled access
    }
    double getBalance() const { return balance; }
};

int main() {
    BankAccount acc;
    acc.deposit(100);
    // acc.balance = 1000000;    // uncommenting breaks compilation
    std::cout << "Balance: " << acc.getBalance() << "\n";
}

```

Output (method path): `Balance: 100` Real error (direct access):

```
error: 'double BankAccount::balance' is private within this context
    acc.balance = 1000000;
        ^~~~~~~

```

Why: `private` protects the data; public methods are the controlled gateway. Exam tip: making everything `public` defeats encapsulation and loses marks.
Concept 3 — Inheritance
Interaction: click Create a Dog that inherits from Animal; watch `Dog` receive `Animal`'s members then add `bark()`; call both.

```cpp
#include <iostream>
#include <string>

class Animal {
protected:
    std::string name;                 // reachable by subclasses, hidden outside
public:
    Animal(std::string n) : name(n) {}
    void eat() { std::cout << name << " is eating\n"; }
};

class Dog : public Animal {           // Dog "is-a" Animal
public:
    Dog(std::string n) : Animal(n) {} // must call the base constructor
    void bark() { std::cout << name << " says Woof\n"; }
};

int main() {
    Dog d("Rex");
    d.eat();     // inherited
    d.bark();    // Dog's own
}

```

Output:

```
Rex is eating
Rex says Woof

```

Why: `Dog` inherits `eat()` and `name`, then adds `bark()`; `protected` lets the subclass use `name`; `Animal` has no default constructor so `Dog` must call `: Animal(n)`. Exam tip: forgetting the base-constructor call is a very common compile error; `protected` is reachable in a subclass, `private` is not.
ACCESS TRACKING (open vs. used)

* On first load, the client generates a random `session_id` (UUID) and stores it in `localStorage`. It then POSTs `{ sessionId, event: "open" }` to `/api/track` once per session (guard with a flag so refreshes don't double count).
* On the student's first interaction with any card (spawning an object, toggling a foundation, etc.), the client POSTs `{ sessionId, event: "interact" }` once.
* `/api/track`:
   * `event: "open"` → `INSERT INTO app_access (session_id, user_agent) VALUES (...) ON CONFLICT (session_id) DO NOTHING`.
   * `event: "interact"` → `UPDATE app_access SET interacted = TRUE WHERE session_id = $1`.
   * Capture `user_agent` from the request header. Validate `event`.
* This gives two headline numbers for the admin: opens (rows) and used (rows where `interacted = true`).
FEEDBACK FEATURE

* Section at the bottom of `/`. Heading: "Before you go — was this useful?"
* Question: "If a full version of this existed, would it help you study for your C++ course?" with Yes / No buttons (single-select, chosen one highlighted).
* Labelled multiline input: "What would make this genuinely useful to you? Tell me what confused you, what's missing, or what you'd add. Be honest — it shapes the next version." Placeholder: "Your honest thoughts…"
* Send feedback → on success show "Thank you. This directly shapes the next version." and disable the form.
* `POST /api/feedback` validates `useful` is `yes`/`no`, inserts `{ useful, comment, user_agent }`, returns `{ ok: true }` or clean error JSON. Client handles loading/success/error states; never a raw error dump.
* If `POSTGRES_URL` is unset, `/api/feedback` and `/api/track` log a warning and return success so preview builds don't break.
ADMIN AREA (secret, password-protected)
This page must not be linked from the public app and must be excluded from search engines (add `noindex` on `/admin` and `/admin/login`).
Auth approach (stateless, no auth library):

* `/admin/login` renders a single password field → POST to `/api/admin/login`.
* `/api/admin/login`: compare the submitted password to `ADMIN_PASSWORD` using `crypto.timingSafeEqual`. On match, build a signed token: a small JSON payload `{ iat, exp }` (e.g. 12-hour expiry), base64url-encoded, followed by an HMAC-SHA256 signature computed with `ADMIN_SESSION_SECRET`. Set it as an httpOnly, Secure, SameSite=Lax cookie named `admin_session`. On mismatch, return 401.
* `/api/admin/logout`: clear the cookie.
* A helper `verifyAdminSession(cookieValue)` recomputes the HMAC, checks it matches, and checks `exp` hasn't passed.
* `middleware.ts` protects `/admin` (but not `/admin/login`): if the cookie is missing or invalid, redirect to `/admin/login`.
* The `/admin` page is a server component that also verifies the cookie server-side before querying (don't rely on middleware alone), then queries the DB directly and renders. If invalid, redirect to `/admin/login`.
Dashboard contents (`/admin`):

* Headline stats: Total opens, Total used (interacted), and Usage rate (used ÷ opens).
* Feedback summary: count of Yes vs No.
* Feedback table: comment, yes/no, timestamp, user agent — most recent first.
* A Log out button.
* Clean, readable, same light Coursera-style design. Empty states handled gracefully ("No feedback yet").
VISUAL DESIGN SYSTEM
Feel: a clean, white, course-platform UI in the style of Coursera — bright, academic, trustworthy, and uncluttered. Card-based lessons, generous whitespace, a calm blue accent. Not a dark developer tool. Implement as Tailwind theme tokens.
Colours

* Page background white `#FFFFFF`; alternating section / muted background `#F5F7FA`.
* Cards: white with a 1px border `#E3E8EF` and a subtle shadow (e.g. `0 1px 3px rgba(0,0,0,0.06)`).
* Text: headings near-black `#1F1F1F`; body `#3D4249`; secondary/muted `#6B7280`.
* Accent: Coursera blue `#0056D2` for primary buttons, active states, links, and progress; hover/darker `#00419E`.
* Success `#137333`; Error `#D93025` (reserved for compiler/linker errors and failures).
Typography

* Clean humanist sans for UI: Source Sans 3 (closest free stand-in for Coursera's type) or Inter, with `system-ui` fallback.
* Monospace (JetBrains Mono or ui-monospace) for all code and console output.
* Clear hierarchy: large friendly section titles, comfortable body size (~16px), readable line length.
Code, console & error panels (in a light UI)

* Code blocks sit in a light panel (`#F6F8FA`) with a 1px border and a light syntax theme — not a dark editor.
* Console/output: a light panel with monospace text and a small "Output" label.
* Compiler/linker errors: a light red panel (`#FCE8E6` background, `#D93025` text, red left border) so the failure is unmistakable while staying on-theme.
Layout (Coursera-like)

* Optional but encouraged: a course-style layout — a slim left "syllabus" rail listing Part 1 — Foundations and Part 2 — OOP with their cards as lessons, and a main content column (rail collapses to a top menu on mobile). If a rail is too much, use a single centered content column with clear module headers.
* A simple white top bar with the app name and a subtle bottom border.
* Content max width ~960–1040px; generous padding; modest rounded corners (8px); subtle shadows over heavy borders.
Do NOT

* Use a dark background, gradients, colours beyond this palette, emoji as decoration, centered long paragraphs, or crowded layouts. Restraint and whitespace read as professional.
QUALITY & ACCESSIBILITY

* Every line of C++ correct and compilable; every error message the real one.
* Fully responsive; readable on a phone.
* Accessible: real `<label>`s, keyboard-operable controls, sufficient contrast, visible focus states.
* Console output looks like a terminal (dark, mono); errors look distinctly like errors (red).
* Clean, commented code so more cards can be added later.
ACCEPTANCE CHECKLIST

* [ ] Foundations render before OOP; each foundation card has a working Correct/Break-it toggle showing the real error.
* [ ] All three OOP concepts interactive and correct.
* [ ] Feedback saves to `feedback`; success and error states handled.
* [ ] `/api/track` records opens and interactions; refresh doesn't double-count.
* [ ] `/admin/login` authenticates against `ADMIN_PASSWORD`; wrong password rejected.
* [ ] `/admin` is unreachable without a valid signed cookie (verified in middleware and server-side); logout works.
* [ ] `/admin` shows opens, used, usage rate, yes/no split, and the feedback table.
* [ ] `/admin` and `/admin/login` are `noindex` and unlinked from the public app.
* [ ] Navy/amber design, no slop; responsive; keyboard-accessible.
* [ ] `npm run build` succeeds; deploys on Vercel with only env vars set.
README (include in the project)
Document: local setup (`npm install`, `.env.local` with the three env vars, `npm run dev`), the Vercel deploy steps, and how to reach `/admin/login`.
Setup note (for you, not for Claude Code)

1. Push the project to GitHub and import into Vercel (auto-detects Next.js).
2. Add Storage → Postgres and connect it (injects `POSTGRES_URL`).
3. Add env vars `ADMIN_PASSWORD` (your choice) and `ADMIN_SESSION_SECRET` (a long random string — generate with `openssl rand -hex 32`).
4. Redeploy, then visit `/admin/login` to see feedback and usage. Keep the URL and password to yourself — it's the only way in.
