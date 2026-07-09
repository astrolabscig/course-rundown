import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PasscoCheatsheet from "@/components/passco/PasscoCheatsheet";
import { discreteMathsPasscoBank } from "@/lib/discreteMaths/passcoBank";

export default function DiscreteMathsPasscoPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/discrete-maths" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <h1 className="text-3xl font-semibold text-heading">Discrete Maths Passco Room</h1>
          <p className="text-body max-w-2xl">
            {discreteMathsPasscoBank.length} real past-questions and revision problems, drawn from
            several counting-principle worksheets, a real KNUST midsem exam, and topic-by-topic
            MCQ revision sets, grouped by topic. Pick an answer to see it marked instantly, with a
            full step-by-step solution and a note on how to spot the same pattern next time.
          </p>
        </div>
        <PasscoCheatsheet questions={discreteMathsPasscoBank} />
      </main>
      <Footer />
    </div>
  );
}
