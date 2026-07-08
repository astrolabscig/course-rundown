import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import QuizRoom from "@/components/discreteMaths/QuizRoom";
import { discreteMathsQuizBank } from "@/lib/discreteMaths/quizBank";

export default function DiscreteMathsQuizPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/discrete-maths" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <h1 className="text-3xl font-semibold text-heading">Discrete Maths Concept Quiz</h1>
          <p className="text-body max-w-2xl">
            {discreteMathsQuizBank.length} questions across every concept in this room, filterable
            by topic. Within each concept, the trickier questions come first. A mix of
            multiple-choice and fill-in-the-blank, with a full step-by-step solution wherever the
            question needs one, and an explanation every time.
          </p>
        </div>
        <QuizRoom />
      </main>
      <Footer />
    </div>
  );
}
