import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ExamRoom from "@/components/exam/ExamRoom";
import { econsExamBank, ECONS_EXAM_TOPICS } from "@/lib/econs/examBank";

export default function EconsExamPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/econs" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <h1 className="text-3xl font-semibold text-heading">Economics Exam Room</h1>
          <p className="text-body max-w-2xl">
            {econsExamBank.length} original questions across the whole macroeconomics syllabus.
            Configure a topic-focused or comprehensive exam, work through it under a real timer,
            then review every answer with a full explanation and a link back to the lesson it
            came from.
          </p>
        </div>
        <ExamRoom
          bank={econsExamBank}
          topics={ECONS_EXAM_TOPICS}
          storageKey="econs_exam_history"
          backHref="/econs"
          roomPath="/econs"
        />
      </main>
      <Footer />
    </div>
  );
}
