import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SyllabusRail from "@/components/SyllabusRail";
import FeedbackForm from "@/components/FeedbackForm";
import Tracker from "@/components/Tracker";
import BasicsCheatsheet from "@/components/basics/BasicsCheatsheet";
import VariableClassifierGame from "@/components/statistics/VariableClassifierGame";
import FrequencyDistributionBuilder from "@/components/statistics/FrequencyDistributionBuilder";
import ChartTypeExplorer from "@/components/statistics/ChartTypeExplorer";
import WorkedProblemsList from "@/components/statistics/WorkedProblemsList";
import CentralTendencyCalculator from "@/components/statistics/CentralTendencyCalculator";
import DispersionCalculator from "@/components/statistics/DispersionCalculator";
import QuartilePercentileFinder from "@/components/statistics/QuartilePercentileFinder";
import SkewnessCalculator from "@/components/statistics/SkewnessCalculator";
import BoxplotBuilder from "@/components/statistics/BoxplotBuilder";
import EmpiricalRuleExplorer from "@/components/statistics/EmpiricalRuleExplorer";
import MCQDrill from "@/components/drills/MCQDrill";
import FormulaCheatsheet from "@/components/statistics/FormulaCheatsheet";
import { statisticsCurriculum } from "@/lib/statistics/curriculum";
import { statisticsFundamentalsGroups } from "@/lib/statistics/fundamentals";
import { statisticsMcqBank } from "@/lib/statistics/mcqBank";
import { statisticsExamBank } from "@/lib/statistics/examBank";
import { statisticsFormulaSheet } from "@/lib/statistics/formulaSheet";
import {
  part1WorkedProblems,
  part2WorkedProblems,
  part3WorkedProblems,
  part4WorkedProblems,
  part5WorkedProblems,
  part6WorkedProblems,
  part7WorkedProblems,
} from "@/lib/statistics/workedProblems";

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

export default function StatisticsRoom() {
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar showCredit />
      <div className="flex flex-col md:flex-row flex-1 mx-auto w-full max-w-[1280px]">
        <SyllabusRail parts={statisticsCurriculum} storageKey="stats_visited_parts" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 space-y-12">
          <section className="space-y-2">
            <h1 className="text-3xl font-semibold text-heading">
              Statistics: turn a wall of numbers into real understanding
            </h1>
            <p className="text-body max-w-2xl">
              From what statistics even is, through organizing raw data, to measuring its center,
              spread, position, and shape — every concept gets a plain-language why, a real
              calculator you can try on your own numbers, and worked problems straight from the
              course material.
            </p>
          </section>

          <a
            href="/statistics/exam"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent\30 bg-[#EAF2FF] px-5 py-4 hover:border-accent transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-accent">{statisticsExamBank.length}-question exam room →</p>
              <p className="text-sm text-body mt-0.5">
                Timed, configurable MCQ practice covering the whole syllabus, with per-topic
                scoring and a full review mode.
              </p>
            </div>
            <span className="shrink-0 px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium">
              Start exam
            </span>
          </a>

          <section id="stats-part-0" className="space-y-6 scroll-mt-24">
            <PartHeading number="0" title="Statistics Orientation" />
            <p className="text-sm text-secondary">
              Click a topic to expand it. Start here for the big picture.
            </p>
            <BasicsCheatsheet groups={statisticsFundamentalsGroups} />
          </section>

          <section id="stats-part-1" className="space-y-6 scroll-mt-24">
            <PartHeading number="1" title="Variables & Data Collection" />
            <p className="text-sm text-secondary">
              Sort real variables into their correct type, then see the four scales of
              measurement worked through.
            </p>
            <VariableClassifierGame />
            <WorkedProblemsList problems={part1WorkedProblems} />
          </section>

          <section id="stats-part-2" className="space-y-6 scroll-mt-24">
            <PartHeading number="2" title="Frequency Distributions & Graphs" />
            <p className="text-sm text-secondary">
              Build a grouped frequency table from raw data, then see the same table drawn three
              different ways.
            </p>
            <FrequencyDistributionBuilder />
            <ChartTypeExplorer />
            <WorkedProblemsList problems={part2WorkedProblems} />
          </section>

          <section id="stats-part-3" className="space-y-6 scroll-mt-24">
            <PartHeading number="3" title="Measures of Central Tendency" />
            <p className="text-sm text-secondary">
              Mean, trimmed mean, geometric mean, median, and mode — all computed live from the
              same dataset so you can see exactly how they differ.
            </p>
            <CentralTendencyCalculator />
            <WorkedProblemsList problems={part3WorkedProblems} />
          </section>

          <section id="stats-part-4" className="space-y-6 scroll-mt-24">
            <PartHeading number="4" title="Measures of Dispersion" />
            <p className="text-sm text-secondary">
              Range, mean deviation, variance, standard deviation, and coefficient of variation —
              try the same three quiz-score groups the course itself uses.
            </p>
            <DispersionCalculator />
            <WorkedProblemsList problems={part4WorkedProblems} />
          </section>

          <section id="stats-part-5" className="space-y-6 scroll-mt-24">
            <PartHeading number="5" title="Measures of Position" />
            <p className="text-sm text-secondary">
              Quartiles, percentiles, and deciles — for both raw data and grouped frequency
              tables.
            </p>
            <QuartilePercentileFinder />
            <WorkedProblemsList problems={part5WorkedProblems} />
          </section>

          <section id="stats-part-6" className="space-y-6 scroll-mt-24">
            <PartHeading number="6" title="Measures of Shape & EDA" />
            <p className="text-sm text-secondary">
              Skewness, kurtosis, the five-number summary, and boxplots — see the shape of a
              distribution, don't just calculate it.
            </p>
            <SkewnessCalculator />
            <BoxplotBuilder />
            <WorkedProblemsList problems={part6WorkedProblems} />
          </section>

          <section id="stats-part-7" className="space-y-6 scroll-mt-24">
            <PartHeading number="7" title="The Empirical Rule" />
            <p className="text-sm text-secondary">
              For a bell-shaped distribution, roughly 68/95/99.7% of the data falls within
              1/2/3 standard deviations of the mean.
            </p>
            <EmpiricalRuleExplorer />
            <WorkedProblemsList problems={part7WorkedProblems} />
          </section>

          <section id="stats-part-8" className="space-y-6 scroll-mt-24">
            <PartHeading number="8" title="MCQ Drill Bank" />
            <p className="text-sm text-secondary">
              A quick spot-check spanning every part of this room.
            </p>
            <MCQDrill questions={statisticsMcqBank} />
          </section>

          <section id="stats-part-9" className="space-y-6 scroll-mt-24">
            <PartHeading number="9" title="Formula Cheatsheet" />
            <p className="text-sm text-secondary">
              Every formula used in this room, in one place — grouped by topic for quick lookup
              before an exam.
            </p>
            <FormulaCheatsheet sections={statisticsFormulaSheet} />
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
