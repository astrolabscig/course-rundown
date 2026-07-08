import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";

const rooms = [
  {
    href: "/cpp",
    tag: "10 parts · Basics → OOP",
    title: "C++ & OOP",
    description:
      "Foundations through polymorphism — real interactive simulations for pointers, memory, inheritance, and vtables. Correct code, the real compiler error, and a plain-language why.",
  },
  {
    href: "/networking",
    tag: "IPv4 & Subnetting",
    title: "IT — Networking Fundamentals",
    description:
      "Network basics, IPv4 addressing, and subnetting calculations built for the exam — with live calculators, not just formulas to memorise.",
  },
  {
    href: "/econs",
    tag: "Macroeconomics",
    title: "Economics II",
    description:
      "The circular flow, national income, unemployment, inflation, the Phillips curve, balance of payments, and exchange rates — with real calculators and simulations for every concept.",
  },
  {
    href: "/discrete-maths",
    tag: "Logic → Trees & Graphs",
    title: "Discrete Mathematics",
    description:
      "Logic, proofs, sets, algorithms, induction, counting, relations, graphs, and trees — real textbook problems solved step by step, with simulations for every algorithm and data structure.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar />
      <main className="flex-1 mx-auto w-full max-w-[1040px] px-4 sm:px-8 py-12">
        <section className="space-y-2 mb-10">
          <h1 className="text-3xl font-semibold text-heading">Pick a room</h1>
          <p className="text-body max-w-2xl">
            Same approach across every course: the correct thing, a broken version with the real
            error, and a plain-language explanation of why — plus real interactive simulations,
            not just static notes.
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          {rooms.map((room) => (
            <Link
              key={room.href}
              href={room.href}
              className="group rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:border-accent transition-all"
            >
              <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold text-accent mb-3">
                {room.tag}
              </span>
              <h2 className="text-xl font-semibold text-heading mb-2 group-hover:text-accent transition-colors">
                {room.title}
              </h2>
              <p className="text-body text-sm">{room.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
