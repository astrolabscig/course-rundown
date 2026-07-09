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
import { statisticsCurriculum } from "@/lib/statistics/curriculum";
import { statisticsFundamentalsGroups } from "@/lib/statistics/fundamentals";
import { part1WorkedProblems, part2WorkedProblems } from "@/lib/statistics/workedProblems";

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

          <section id="feedback" className="scroll-mt-24 max-w-2xl">
            <FeedbackForm />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
