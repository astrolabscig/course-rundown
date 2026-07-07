import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ExamRoom from "@/components/exam/ExamRoom";
import { examBank, EXAM_TOPICS } from "@/lib/examBank";

export default function CppExamPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/cpp" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <h1 className="text-3xl font-semibold text-heading">C++ &amp; OOP Exam Room</h1>
          <p className="text-body max-w-2xl">
            {examBank.length} original questions across the whole syllabus. Configure a
            topic-focused or comprehensive exam, work through it under a real timer, then
            review every answer with a full explanation and a link back to the lesson it
            came from.
          </p>
        </div>
        <ExamRoom
          bank={examBank}
          topics={EXAM_TOPICS}
          storageKey="cpp_exam_history"
          backHref="/cpp"
          roomPath="/cpp"
        />
      </main>
      <Footer />
    </div>
  );
}
