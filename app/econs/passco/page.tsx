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
            {econsPasscoBank.length} real past-exam questions from ECON 152 past-question
            booklets and end-of-semester papers, each tagged with its source document — questions
            that share a table or scenario stay right next to each other. Every answer was
            independently re-verified rather than copied from the source&apos;s marked key; where
            that check turned up a likely error or a genuine ambiguity in the source, it&apos;s
            flagged right on the question. Pick an answer to see if you&apos;re right.
          </p>
        </div>
        <PasscoCheatsheet questions={econsPasscoBank} sections={ECONS_PASS_SECTIONS} />
      </main>
      <Footer />
    </div>
  );
}
