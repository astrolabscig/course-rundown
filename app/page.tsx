import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";

const rooms = [
  {
    href: "/cpp",
    tag: "10 parts · Basics → OOP",
    tagColor: "text-blue-600 bg-blue-500/10 dark:text-blue-300",
    title: "C++ & OOP",
    description:
      "Foundations through polymorphism — real interactive simulations for pointers, memory, inheritance, and vtables. Correct code, the real compiler error, and a plain-language why.",
    stat: "165 exam questions · 113 Passco questions",
    icon: "cpp",
  },
  {
    href: "/networking",
    tag: "IPv4 & Subnetting",
    tagColor: "text-teal-600 bg-teal-500/10 dark:text-teal-300",
    title: "IT — Networking Fundamentals",
    description:
      "Network basics, IPv4 addressing, and subnetting calculations built for the exam — with live calculators, not just formulas to memorise.",
    stat: "Live subnetting & DHCP/DNS/ARP simulators",
    icon: "network",
  },
  {
    href: "/econs",
    tag: "Macroeconomics",
    tagColor: "text-accent-warm bg-accent-warm-bg",
    title: "Economics II",
    description:
      "The circular flow, national income, unemployment, inflation, the Phillips curve, balance of payments, and exchange rates — with real calculators and simulations for every concept.",
    stat: "100 exam questions · 80+ Passco questions",
    icon: "econs",
  },
  {
    href: "/discrete-maths",
    tag: "Logic → Trees & Graphs",
    tagColor: "text-indigo-600 bg-indigo-500/10 dark:text-indigo-300",
    title: "Discrete Mathematics",
    description:
      "Logic, proofs, sets, algorithms, induction, counting, relations, graphs, and trees — real textbook problems solved step by step, with simulations for every algorithm and data structure.",
    stat: "87 quiz questions · 138 Passco questions",
    icon: "graph",
  },
  {
    href: "/statistics",
    tag: "Descriptive Statistics + Probability",
    tagColor: "text-pink-600 bg-pink-500/10 dark:text-pink-300",
    title: "Statistics",
    description:
      "Frequency distributions, central tendency, dispersion, position, shape, and probability — real calculators for every formula, not just definitions to memorise.",
    stat: "100 exam questions · full formula cheatsheet",
    icon: "stats",
  },
];

const features = [
  {
    icon: "calculator",
    title: "Real, live calculators",
    description:
      "Every formula in every room is an actual calculator you can run on your own numbers — not a static definition to memorise and hope you applied correctly.",
  },
  {
    icon: "book",
    title: "Verified against real lectures",
    description:
      "Worked problems are pulled from the actual course slides and past questions, then independently checked so the numbers you're studying are correct.",
  },
  {
    icon: "clock",
    title: "Timed practice, real pressure",
    description:
      "Configurable, topic-filtered exams with a real timer and a full review mode afterward — so exam day isn't the first time you're under the clock.",
  },
];

const faqs = [
  {
    q: "Is this actually free?",
    a: "Yes. It's a student side-project, not a product — no accounts, no paywalls, no ads. Pick a room and start.",
  },
  {
    q: "How accurate are the calculators and answers?",
    a: "Every calculator's default output and every worked-problem answer is checked against the source lecture material or hand-verified before it ships. If something looks off, the feedback form in every room goes straight to me.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. Open a room and go — your progress through each syllabus is saved locally in your own browser.",
  },
];

function FeatureIcon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "calculator") {
    return (
      <svg {...common}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="11" x2="8" y2="11.01" />
        <line x1="12" y1="11" x2="12" y2="11.01" />
        <line x1="16" y1="11" x2="16" y2="11.01" />
        <line x1="8" y1="15" x2="8" y2="15.01" />
        <line x1="12" y1="15" x2="12" y2="15.01" />
        <line x1="16" y1="15" x2="16" y2="17" />
        <line x1="8" y1="18" x2="12" y2="18" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
}

function RoomIcon({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "cpp":
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <path d="M12 7v5M12 12 6.5 17M12 12l5.5 5" />
        </svg>
      );
    case "econs":
      return (
        <svg {...common}>
          <polyline points="3 17 9 11 13 15 21 7" />
          <polyline points="14 7 21 7 21 14" />
        </svg>
      );
    case "graph":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.4" />
          <circle cx="18" cy="6" r="2.4" />
          <circle cx="12" cy="18" r="2.4" />
          <path d="M8 7.3 10.5 16M16 7.3 13.5 16M8.3 6h7.4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <line x1="5" y1="21" x2="5" y2="10" />
          <line x1="12" y1="21" x2="12" y2="4" />
          <line x1="19" y1="21" x2="19" y2="14" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 pt-14 sm:pt-20 pb-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-block rounded-full border border-card-border bg-muted px-4 py-1.5 text-xs font-semibold text-secondary">
                Built during my own mid-sem exams
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-heading leading-[1.1] tracking-tight">
                Stop re-reading notes.
                <br />
                Start solving problems.
              </h1>
              <p className="text-lg text-body max-w-xl leading-relaxed">
                Course Rundown turns lecture slides into something you can actually practice on:
                live calculators for every formula, past-exam questions with a real score tracker,
                and timed exam simulators — built room by room to get me and my coursemates
                through our own exams.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#rooms"
                  className="px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
                >
                  Explore the rooms
                </a>
                <a
                  href="#how-it-works"
                  className="text-accent font-medium hover:underline underline-offset-4"
                >
                  See how it works →
                </a>
              </div>
            </div>

            {/* Decorative preview panel — mirrors the app's own quiz UI, not a stock photo */}
            <div className="relative">
              <div className="rounded-3xl border border-card-border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-card-border bg-muted">
                  <span className="h-2.5 w-2.5 rounded-full bg-error/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-warm/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  <span className="ml-3 text-xs font-mono text-secondary">course-rundown/statistics</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
                      Question 7 of 20
                    </span>
                    <span className="text-xs font-mono text-accent">⏱ 12:48</span>
                  </div>
                  <p className="text-sm font-medium text-heading leading-relaxed">
                    Sample variance divides the sum of squared deviations by:
                  </p>
                  <div className="space-y-2">
                    <div className="rounded-xl border-2 border-success bg-success/10 px-4 py-2.5 text-sm text-heading font-medium">
                      n − 1 ✓
                    </div>
                    <div className="rounded-xl border border-card-border px-4 py-2.5 text-sm text-body">n</div>
                    <div className="rounded-xl border border-card-border px-4 py-2.5 text-sm text-body">n + 1</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-card-border">
                    <span className="text-xs text-secondary">Score</span>
                    <span className="text-sm font-bold text-heading">6 / 6 correct</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="how-it-works" className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 py-6 scroll-mt-20">
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="space-y-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="text-base font-semibold text-heading">{f.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats strip */}
        <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 py-14">
          <div className="grid gap-4 sm:grid-cols-4">
            <Link
              href="/statistics"
              className="sm:col-span-2 rounded-2xl bg-heading text-page p-6 flex flex-col justify-between hover:opacity-90 transition-opacity"
            >
              <div>
                <span className="inline-block rounded-full bg-page/15 px-3 py-1 text-xs font-semibold mb-3">
                  Newest room
                </span>
                <h3 className="text-xl font-semibold mb-1.5">Statistics + Probability</h3>
                <p className="text-sm opacity-80 max-w-xs">
                  From frequency tables to Bayes&apos; Theorem, with a calculator for every formula.
                </p>
              </div>
              <span className="text-sm font-medium mt-4 inline-flex items-center gap-1">
                Open the room →
              </span>
            </Link>

            <div className="rounded-2xl border border-card-border bg-card p-6 flex flex-col justify-center">
              <p className="text-4xl font-bold text-heading">800+</p>
              <p className="text-sm text-secondary mt-1">original practice questions across every room</p>
            </div>

            <div className="rounded-2xl border border-card-border bg-card p-6 flex flex-col justify-center">
              <p className="text-4xl font-bold text-heading">5</p>
              <p className="text-sm text-secondary mt-1">full courses — and growing by request</p>
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section id="rooms" className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 py-8 scroll-mt-20 space-y-2 mb-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-heading">Pick a room</h2>
          <p className="text-body max-w-2xl">
            Same approach in every course: the correct thing, a broken version with the real
            error, and a plain-language explanation of why.
          </p>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 pb-16">
          <div className="grid gap-6 sm:grid-cols-2">
            {rooms.map((room) => (
              <Link
                key={room.href}
                href={room.href}
                className="group rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:border-accent transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <RoomIcon name={room.icon} />
                  </span>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${room.tagColor}`}>
                    {room.tag}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2 group-hover:text-accent transition-colors">
                  {room.title}
                </h3>
                <p className="text-body text-sm mb-3">{room.description}</p>
                <p className="text-xs font-mono text-secondary">{room.stat}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-heading mb-6">Questions</h2>
          <div className="max-w-2xl space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-card-border bg-card overflow-hidden"
              >
                <summary className="cursor-pointer select-none px-5 py-4 text-sm font-semibold text-heading hover:text-accent transition-colors">
                  {item.q}
                </summary>
                <p className="px-5 pb-4 text-sm text-body leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 pb-20">
          <div className="rounded-3xl border border-card-border bg-muted px-8 py-12 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-heading">
              Your exam doesn&apos;t care that you&apos;re tired. Neither does this.
            </h2>
            <p className="text-body max-w-lg mx-auto">
              Pick a room, run a calculator on your own numbers, and see where you actually stand.
            </p>
            <a
              href="#rooms"
              className="inline-block px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
            >
              Start practicing
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
