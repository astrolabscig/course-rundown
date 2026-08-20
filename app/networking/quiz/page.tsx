import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import QuizRoom from "@/components/networking/QuizRoom";
import { networkingQuizBank } from "@/lib/networking/quizBank";

export default function NetworkingQuizPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/networking" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to lessons
          </Link>
          <h1 className="text-3xl font-semibold text-heading">IT Networking Concept Quiz</h1>
          <p className="text-body max-w-2xl">
            {networkingQuizBank.length} questions across every concept in this room — network
            fundamentals and components, transmission media and cabling, topologies, scalable
            design, security, IPv4 addressing, subnetting/VLSM/CIDR, protocols and media access,
            and TCP/IP & OSI layering — filterable by topic, with a heavy focus on practical,
            scenario-based questions rather than plain definitions. Within each concept, the
            trickier questions come first. A mix of multiple-choice and fill-in-the-blank, with a
            full step-by-step solution wherever the question needs one (subnetting math
            especially), and an explanation every time.
          </p>
        </div>
        <QuizRoom />
      </main>
      <Footer />
    </div>
  );
}
