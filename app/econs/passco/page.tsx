import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PasscoCheatsheet from "@/components/passco/PasscoCheatsheet";
import { econsPasscoBank, ECONS_PASS_SECTIONS } from "@/lib/econs/passcoBank";

export default function EconsPasscoPage() {
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
            {econsPasscoBank.length} real past-exam questions with correct answers and short
            explanations, straight from an ECON 152 past-questions booklet. Filter by topic,
            click a question to reveal the answer.
          </p>
        </div>
        <PasscoCheatsheet questions={econsPasscoBank} sections={ECONS_PASS_SECTIONS} />
      </main>
      <Footer />
    </div>
  );
}
