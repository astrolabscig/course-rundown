import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import CodeCompletionLab from "@/components/cpp/CodeCompletionLab";
import { codeCompletionBank } from "@/lib/cpp/codeCompletionBank";

export default function CppCodeLabPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/cpp" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">C++ Code Completion Lab</p>
          <h1 className="text-3xl font-semibold text-heading">C++ Code Completion Lab</h1>
          <p className="text-body max-w-2xl">
            {codeCompletionBank.length} scenario-based snippets across 19 fundamentals topics — fill
            in the missing piece, get an explanation either way, and track which topics still need
            work. Answers are checked with flexible pattern matching (not live compilation), so
            focus on getting the logic right rather than matching one exact phrasing.
          </p>
        </div>
        <CodeCompletionLab />
      </main>
      <Footer />
    </div>
  );
}
