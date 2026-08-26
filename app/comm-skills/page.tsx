import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import CommSkillsRoom from "@/components/commSkills/CommSkillsRoom";
import { commSkillsPastQuestions } from "@/lib/commSkills/pastQuestions";
import { commSkillsConceptQuestions } from "@/lib/commSkills/conceptBank";

export default function CommSkillsPage() {
  const total = commSkillsPastQuestions.length + commSkillsConceptQuestions.length;
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">ENGL 158 · Communication Skills II</p>
          <h1 className="text-3xl font-semibold text-heading">Communication Skills Exam Prep</h1>
          <p className="text-body max-w-2xl">
            {total} questions across two sections. <strong className="text-heading">Section A</strong> preserves{" "}
            {commSkillsPastQuestions.length} real past-exam questions exactly as they were originally asked, source and
            all. <strong className="text-heading">Section B</strong> is a {commSkillsConceptQuestions.length}-question
            concept bank built directly from the lecture slides — organizational communication, CVs, formal letters,
            memos, report writing, meetings &amp; minutes, and oral communication/interviews — testing the same ideas
            from multiple angles.
          </p>
          <p className="text-xs text-secondary max-w-2xl">
            A small number of past questions carry a note flagging a possible typo, an inconsistency with the lecture
            material, or an answer that had to be inferred because the source didn&rsquo;t mark one clearly — these are
            disclosed rather than silently corrected.
          </p>
        </section>
        <CommSkillsRoom />
      </main>
      <Footer />
    </div>
  );
}
