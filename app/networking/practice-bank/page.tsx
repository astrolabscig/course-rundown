import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PracticeBankRoom from "@/components/networking/PracticeBankRoom";
import { csm152PracticeBank } from "@/lib/networking/practiceBank";

export default function NetworkingPracticeBankPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/networking" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            CSM 152 · Practice Question Bank
          </p>
          <h1 className="text-3xl font-semibold text-heading">CSM 152 Practice Question Bank</h1>
          <p className="text-body max-w-2xl">
            {csm152PracticeBank.length} exam-style questions spanning Module 0 (Network Systems
            Foundations) through Module 8 (the Capstone), plus a 25-question Mixed Expert Set that
            forces two or more modules together in a single question. Every question is tiered —
            Tier A (foundational check), Tier B (applied scenario), Tier C (diagnostic/integration)
            — and every option comes with a full explanation of why it&rsquo;s right or wrong, not
            just which one is correct. Several questions are &ldquo;select all that apply.&rdquo;
            Filter by module below.
          </p>
        </div>
        <PracticeBankRoom />
      </main>
      <Footer />
    </div>
  );
}
