import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ExamRoom from "@/components/exam/ExamRoom";
import { statisticsExamBank, STATISTICS_EXAM_TOPICS } from "@/lib/statistics/examBank";

export default function StatisticsExamPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/statistics" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <h1 className="text-3xl font-semibold text-heading">Statistics Exam Room</h1>
          <p className="text-body max-w-2xl">
            {statisticsExamBank.length} original questions spanning variables and data collection,
            frequency distributions, central tendency, dispersion, position, shape, and the
            empirical rule. Configure a topic-focused or comprehensive exam, work through it under
            a real timer, then review every answer with a full explanation and a link back to the
            lesson it came from.
          </p>
        </div>
        <ExamRoom
          bank={statisticsExamBank}
          topics={STATISTICS_EXAM_TOPICS}
          storageKey="statistics_exam_history"
          backHref="/statistics"
          roomPath="/statistics"
        />
      </main>
      <Footer />
    </div>
  );
}
