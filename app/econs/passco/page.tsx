import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import EconsPassRoom from "@/components/econs/EconsPassRoom";
import { econsPasscoBank, toIndexedQuestions } from "@/lib/econs/passcoBank";

export default function EconsPasscoPage() {
  const bank = toIndexedQuestions(econsPasscoBank);
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/econs" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <h1 className="text-3xl font-semibold text-heading">Economics Passco Quiz</h1>
          <p className="text-body max-w-2xl">
            {bank.length} real past-exam questions — deduplicated from ECON 152 past-question
            booklets and end-of-semester papers, each tagged with its source document. Every
            answer was independently re-verified rather than copied from the source&apos;s marked
            key; where that turned up a likely error or a genuine ambiguity, it&apos;s flagged
            right on the question. Filter by topic, then work through at your own pace — jump to
            any question, review your answers, and retry anytime.
          </p>
        </div>
        <EconsPassRoom bank={bank} />
      </main>
      <Footer />
    </div>
  );
}
