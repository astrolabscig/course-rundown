import TopBar from "@/components/TopBar";
import SyllabusRail from "@/components/SyllabusRail";
import ComingSoon from "@/components/ComingSoon";
import FoundationCard from "@/components/FoundationCard";
import BasicsCheatsheet from "@/components/basics/BasicsCheatsheet";
import MemorySimulator from "@/components/simulators/MemorySimulator";
import PointersReferencesDeepDive from "@/components/simulators/PointersReferencesDeepDive";
import CallByValueReferenceDemo from "@/components/simulators/CallByValueReferenceDemo";
import AccessControlGrid from "@/components/simulators/AccessControlGrid";
import AbstractionDemo from "@/components/simulators/AbstractionDemo";
import InheritanceBuilder from "@/components/simulators/InheritanceBuilder";
import VTableSimulator from "@/components/simulators/VTableSimulator";
import OverloadingOverridingDemo from "@/components/simulators/OverloadingOverridingDemo";
import MCQDrill from "@/components/drills/MCQDrill";
import OutputPredictionDrill from "@/components/drills/OutputPredictionDrill";
import ComparisonTable from "@/components/reference/ComparisonTable";
import ClassesObjectsDemo from "@/components/oop/ClassesObjectsDemo";
import EncapsulationDemo from "@/components/oop/EncapsulationDemo";
import InheritanceDemo from "@/components/oop/InheritanceDemo";
import FeedbackForm from "@/components/FeedbackForm";
import Tracker from "@/components/Tracker";
import { foundations } from "@/lib/foundations";
import { comparisonTables } from "@/lib/comparisonTables";

function PartHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="flex items-center gap-3 border-b border-card-border pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-sm font-bold text-accent border border-card-border">
        {number}
      </span>
      <span className="text-2xl font-semibold text-heading">{title}</span>
    </h2>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar />
      <div className="flex flex-1 mx-auto w-full max-w-[1280px]">
        <SyllabusRail />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 space-y-12">
          <section className="space-y-2">
            <h1 className="text-3xl font-semibold text-heading">
              Pass your C++ course: Basics → OOP
            </h1>
            <p className="text-body max-w-2xl">
              For every idea, see the correct code and its output, a broken version with the
              real compiler or linker error, the fix, and a plain-language explanation of why.
            </p>
          </section>

          <section id="part-0" className="space-y-6 scroll-mt-24">
            <PartHeading number="0" title="C++ Basics Cheatsheet" />
            <p className="text-sm text-secondary">
              Click a topic to expand it. Start here, then use the deep-dive lessons below for
              the interactive simulations.
            </p>
            <BasicsCheatsheet />
            <div className="space-y-6">
              {foundations.map((data) => (
                <FoundationCard key={data.id} data={data} />
              ))}
            </div>
          </section>

          <section id="part-1" className="space-y-6 scroll-mt-24">
            <PartHeading number="1" title="Functions" />

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">Pointers & references, explained properly</h3>
              <p className="text-body text-sm mb-4">
                Start here if pointers and references still feel confusing — this walks through
                what they actually are, one line at a time, before you try the free-form
                playground below.
              </p>
              <PointersReferencesDeepDive />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-heading mb-1">
                  Memory & Pointers Playground
                </h3>
                <p className="text-body text-sm">
                  Now try it yourself. Try this: create a variable, add a pointer, then click
                  &ldquo;point to&hellip;&rdquo; and click the variable to link them — watch the
                  arrow appear. Allocate on the heap with <span className="font-mono">new</span>,
                  then try <span className="font-mono">delete</span> followed by dereferencing the
                  same pointer, or remove its owning variable without deleting first.
                </p>
              </div>
              <MemorySimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-heading mb-1">
                  Quick recap: call by value vs call by reference
                </h3>
                <p className="text-body text-sm">
                  Predict the two outputs, then run the calls to check yourself.
                </p>
              </div>
              <CallByValueReferenceDemo />
            </div>
          </section>

          <section id="part-2" className="space-y-6 scroll-mt-24">
            <PartHeading number="2" title="Classes & Objects" />
            <ClassesObjectsDemo />
          </section>

          <section id="part-3" className="space-y-6 scroll-mt-24">
            <PartHeading number="3" title="Encapsulation" />
            <EncapsulationDemo />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-heading mb-1">Access-control grid</h3>
                <p className="text-body text-sm">
                  Click any cell to see whether that access level is allowed in that context, and why.
                </p>
              </div>
              <AccessControlGrid />
            </div>
          </section>

          <section id="part-4" className="space-y-6 scroll-mt-24">
            <PartHeading number="4" title="Abstraction" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-heading mb-1">
                  An ATM&rsquo;s interface vs its implementation
                </h3>
                <p className="text-body text-sm">
                  Try this: press a button to use the interface, then toggle &ldquo;Show
                  implementation&rdquo; to reveal what&rsquo;s hidden behind it.
                </p>
              </div>
              <AbstractionDemo />
            </div>
          </section>

          <section id="part-5" className="space-y-6 scroll-mt-24">
            <PartHeading number="5" title="Inheritance" />
            <InheritanceDemo />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                Hierarchy builder, access, and construction order
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: connect Dog to Animal, then Puppy to Dog, then spawn and destroy a
                Puppy object to watch the construction/destruction order.
              </p>
              <InheritanceBuilder />
            </div>
          </section>

          <section id="part-6" className="space-y-6 scroll-mt-24">
            <PartHeading number="6" title="Polymorphism" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-heading mb-1">
                  The vptr / vtable dispatch simulator
                </h3>
                <p className="text-body text-sm">
                  Try this: toggle <span className="font-mono">virtual</span> off, call{" "}
                  <span className="font-mono">p-&gt;speak()</span>, then toggle it on and call it
                  again — watch both the diagram and the output change.
                </p>
              </div>
              <VTableSimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <OverloadingOverridingDemo />
            </div>
          </section>

          <section id="part-7" className="space-y-6 scroll-mt-24">
            <PartHeading number="7" title="Speed Tables" />
            <div className="space-y-4">
              {comparisonTables.map((table) => (
                <ComparisonTable key={table.id} data={table} />
              ))}
            </div>
            <ComingSoon note="The 8 golden-sentence recognition cards will appear here once the course reference material is added." />
          </section>

          <section id="part-8" className="space-y-6 scroll-mt-24">
            <PartHeading number="8" title="MCQ Drill Bank" />
            <p className="text-sm text-secondary">
              A starter set of questions — the full 40-question bank will replace these once the
              course reference material is added.
            </p>
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <MCQDrill />
            </div>
          </section>

          <section id="part-9" className="space-y-6 scroll-mt-24">
            <PartHeading number="9" title="Output-Prediction Drill" />
            <p className="text-sm text-secondary">
              A starter set of snippets — the full 8-snippet set will replace these once the
              course reference material is added.
            </p>
            <OutputPredictionDrill />
          </section>

          <section id="feedback" className="scroll-mt-24 max-w-2xl">
            <FeedbackForm />
          </section>
        </main>
      </div>
    </div>
  );
}
