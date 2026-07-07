import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SyllabusRail from "@/components/SyllabusRail";
import FeedbackForm from "@/components/FeedbackForm";
import Tracker from "@/components/Tracker";
import BasicsCheatsheet from "@/components/basics/BasicsCheatsheet";
import MCQDrill from "@/components/drills/MCQDrill";
import ComparisonTable from "@/components/reference/ComparisonTable";
import CircularFlowSimulator from "@/components/econs/CircularFlowSimulator";
import NationalIncomeCalculator from "@/components/econs/NationalIncomeCalculator";
import BusinessCycleSimulator from "@/components/econs/BusinessCycleSimulator";
import LabourMarketSimulator from "@/components/econs/LabourMarketSimulator";
import CPICalculator from "@/components/econs/CPICalculator";
import ADASInflationSimulator from "@/components/econs/ADASInflationSimulator";
import PhillipsCurveSimulator from "@/components/econs/PhillipsCurveSimulator";
import BalanceOfPaymentsBreakdown from "@/components/econs/BalanceOfPaymentsBreakdown";
import ExchangeRateSimulator from "@/components/econs/ExchangeRateSimulator";
import { econsCurriculum } from "@/lib/econs/curriculum";
import { econsFundamentalsGroups } from "@/lib/econs/fundamentals";
import { econsComparisonTables } from "@/lib/econs/comparisonTables";
import { econsMcqBank } from "@/lib/econs/mcqBank";
import { econsExamBank } from "@/lib/econs/examBank";

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

function findTable(id: string) {
  const table = econsComparisonTables.find((t) => t.id === id);
  if (!table) throw new Error(`Missing comparison table: ${id}`);
  return table;
}

export default function EconsRoom() {
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar showCredit />
      <div className="flex flex-col md:flex-row flex-1 mx-auto w-full max-w-[1280px]">
        <SyllabusRail parts={econsCurriculum} storageKey="econs_visited_parts" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 space-y-12">
          <section className="space-y-2">
            <h1 className="text-3xl font-semibold text-heading">
              Economics II: Macroeconomics — understand the whole economy, not just the terms
            </h1>
            <p className="text-body max-w-2xl">
              The circular flow, national income, unemployment, inflation, the Phillips curve,
              the balance of payments, and exchange rates — each with a real calculator or
              simulation, not just a definition to memorise.
            </p>
          </section>

          <a
            href="/econs/exam"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-[#EAF2FF] px-5 py-4 hover:border-accent transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-accent">{econsExamBank.length}-question exam room →</p>
              <p className="text-sm text-body mt-0.5">
                Timed, configurable MCQ practice covering the whole syllabus, with per-topic
                scoring and a full review mode.
              </p>
            </div>
            <span className="shrink-0 px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium">
              Start exam
            </span>
          </a>

          <section id="e-part-0" className="space-y-6 scroll-mt-24">
            <PartHeading number="0" title="Macroeconomics Cheatsheet" />
            <p className="text-sm text-secondary">
              Click a topic to expand it. Start here, then use the calculators and simulations
              below for the hands-on practice.
            </p>
            <BasicsCheatsheet groups={econsFundamentalsGroups} />
          </section>

          <section id="e-part-1" className="space-y-6 scroll-mt-24">
            <PartHeading number="1" title="Circular Flow of Income" />
            <p className="text-sm text-secondary">
              Drag the withdrawals and injections and watch whether the economy expands,
              contracts, or sits in equilibrium.
            </p>
            <CircularFlowSimulator />
          </section>

          <section id="e-part-2" className="space-y-6 scroll-mt-24">
            <PartHeading number="2" title="Measuring National Income" />
            <p className="text-sm text-secondary">
              Two real calculators: Nominal vs Real GDP, and the full GDP → GNP → NNP adjustment
              chain.
            </p>
            <NationalIncomeCalculator />
          </section>

          <section id="e-part-3" className="space-y-6 scroll-mt-24">
            <PartHeading number="3" title="Business Cycle & Economic Growth" />
            <p className="text-sm text-secondary">
              Watch national output wobble through the four phases of the business cycle.
            </p>
            <BusinessCycleSimulator />
            <ComparisonTable data={findTable("actual-vs-potential-growth")} />
          </section>

          <section id="e-part-4" className="space-y-6 scroll-mt-24">
            <PartHeading number="4" title="Unemployment" />
            <p className="text-sm text-secondary">
              Toggle between the labour-market scenarios to see exactly where each type of
              unemployment comes from.
            </p>
            <LabourMarketSimulator />
            <ComparisonTable data={findTable("disequilibrium-vs-equilibrium-unemployment")} />
          </section>

          <section id="e-part-5" className="space-y-6 scroll-mt-24">
            <PartHeading number="5" title="Inflation" />
            <p className="text-sm text-secondary">
              Calculate a real Consumer Price Index and inflation rate, then see the two ways
              inflation can be caused.
            </p>
            <CPICalculator />
            <ADASInflationSimulator />
            <ComparisonTable data={findTable("demand-pull-vs-cost-push")} />
          </section>

          <section id="e-part-6" className="space-y-6 scroll-mt-24">
            <PartHeading number="6" title="The Phillips Curve" />
            <p className="text-sm text-secondary">
              The classic inflation-unemployment trade-off — and how stagflation broke it.
            </p>
            <PhillipsCurveSimulator />
          </section>

          <section id="e-part-7" className="space-y-6 scroll-mt-24">
            <PartHeading number="7" title="Balance of Payments" />
            <p className="text-sm text-secondary">
              A country's transactions with the rest of the world, broken into three accounts.
            </p>
            <BalanceOfPaymentsBreakdown />
            <ComparisonTable data={findTable("current-vs-capital-financial-account")} />
          </section>

          <section id="e-part-8" className="space-y-6 scroll-mt-24">
            <PartHeading number="8" title="Exchange Rates" />
            <p className="text-sm text-secondary">
              See exactly why and how the cedi appreciates or depreciates against the dollar.
            </p>
            <ExchangeRateSimulator />
            <ComparisonTable data={findTable("fixed-vs-floating-exchange-rate")} />
          </section>

          <section id="e-part-9" className="space-y-6 scroll-mt-24">
            <PartHeading number="9" title="The Four Objectives" />
            <p className="text-sm text-secondary">
              How growth, unemployment, inflation, and the balance of payments all move together
              through the business cycle.
            </p>
            <BasicsCheatsheet
              groups={econsFundamentalsGroups.filter((g) => g.id === "four-objectives-relationship")}
            />
          </section>

          <section id="e-part-10" className="space-y-6 scroll-mt-24">
            <PartHeading number="10" title="MCQ Drill Bank" />
            <p className="text-sm text-secondary">
              A quick starter set — for full timed practice, use the {econsExamBank.length}-question
              exam room above.
            </p>
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <MCQDrill questions={econsMcqBank} />
            </div>
          </section>

          <section id="feedback" className="scroll-mt-24 max-w-2xl">
            <FeedbackForm />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
