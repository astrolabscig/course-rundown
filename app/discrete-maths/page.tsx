import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SyllabusRail from "@/components/SyllabusRail";
import FeedbackForm from "@/components/FeedbackForm";
import Tracker from "@/components/Tracker";
import BasicsCheatsheet from "@/components/basics/BasicsCheatsheet";
import TruthTableSimulator from "@/components/discreteMaths/TruthTableSimulator";
import LogicCircuitSimulator from "@/components/discreteMaths/LogicCircuitSimulator";
import QuantifierVisualizer from "@/components/discreteMaths/QuantifierVisualizer";
import InferenceBuilder from "@/components/discreteMaths/InferenceBuilder";
import WorkedProblems from "@/components/discreteMaths/WorkedProblems";
import SetOperationsVenn from "@/components/discreteMaths/SetOperationsVenn";
import FunctionMappingSimulator from "@/components/discreteMaths/FunctionMappingSimulator";
import SequenceRecurrenceStepper from "@/components/discreteMaths/SequenceRecurrenceStepper";
import SearchAlgorithmSimulator from "@/components/discreteMaths/SearchAlgorithmSimulator";
import SortAlgorithmSimulator from "@/components/discreteMaths/SortAlgorithmSimulator";
import GreedyCoinChangeSimulator from "@/components/discreteMaths/GreedyCoinChangeSimulator";
import BigOGrowthChart from "@/components/discreteMaths/BigOGrowthChart";
import InductionProofBuilder from "@/components/discreteMaths/InductionProofBuilder";
import RecursionCallStackSimulator from "@/components/discreteMaths/RecursionCallStackSimulator";
import MergeSortSimulator from "@/components/discreteMaths/MergeSortSimulator";
import CountingTreeDiagram from "@/components/discreteMaths/CountingTreeDiagram";
import PigeonholeDemo from "@/components/discreteMaths/PigeonholeDemo";
import PermutationCombinationCalculator from "@/components/discreteMaths/PermutationCombinationCalculator";
import RelationPropertyChecker from "@/components/discreteMaths/RelationPropertyChecker";
import EquivalenceClassPartitioner from "@/components/discreteMaths/EquivalenceClassPartitioner";
import GraphBuilder from "@/components/discreteMaths/GraphBuilder";
import NamedGraphExplorer from "@/components/discreteMaths/NamedGraphExplorer";
import DijkstraSimulator from "@/components/discreteMaths/DijkstraSimulator";
import TreeTerminologySimulator from "@/components/discreteMaths/TreeTerminologySimulator";
import BSTBuilder from "@/components/discreteMaths/BSTBuilder";
import HuffmanCodingBuilder from "@/components/discreteMaths/HuffmanCodingBuilder";
import TreeTraversalAnimator from "@/components/discreteMaths/TreeTraversalAnimator";
import MSTComparisonSimulator from "@/components/discreteMaths/MSTComparisonSimulator";
import MCQDrill from "@/components/drills/MCQDrill";
import { discreteMathsCurriculum } from "@/lib/discreteMaths/curriculum";
import { discreteMathsFundamentalsGroups } from "@/lib/discreteMaths/fundamentals";
import { discreteMathsMcqBank } from "@/lib/discreteMaths/mcqBank";
import { discreteMathsPasscoBank } from "@/lib/discreteMaths/passcoBank";
import { discreteMathsQuizBank } from "@/lib/discreteMaths/quizBank";
import {
  part1WorkedProblems,
  part2WorkedProblems,
  part3WorkedProblems,
  part4WorkedProblems,
  part5WorkedProblems,
  part6WorkedProblems,
  part7WorkedProblems,
  part8WorkedProblems,
  part9WorkedProblems,
  part10WorkedProblems,
  part11WorkedProblems,
} from "@/lib/discreteMaths/workedProblems";

function PartHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="flex items-center gap-3 border-b border-card-border pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-sm font-bold text-accent border border-card-border">
        {number}
      </span>
      <span className="text-2xl font-semibold text-heading">{title}</span>
    </h2>
  );
}

export default function DiscreteMathsRoom() {
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar showCredit />
      <div className="flex flex-col md:flex-row flex-1 mx-auto w-full max-w-[1280px]">
        <SyllabusRail parts={discreteMathsCurriculum} storageKey="dm_visited_parts" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 space-y-12">
          <section className="space-y-2">
            <h1 className="text-3xl font-semibold text-heading">
              Discrete Mathematics: the math behind computer science
            </h1>
            <p className="text-body max-w-2xl">
              Logic, proofs, sets, algorithms, induction, counting, relations, graphs, and
              trees — each with a real simulation, real textbook problems solved step by
              step, and a plain-language why, straight from Rosen&rsquo;s Discrete
              Mathematics and Its Applications.
            </p>
          </section>

          <a
            href="/discrete-maths/quiz"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-[#EAF2FF] px-5 py-4 hover:border-accent transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-accent">{discreteMathsQuizBank.length}-question Concept Quiz →</p>
              <p className="text-sm text-body mt-0.5">
                Filter by concept, hardest questions first, mixing multiple-choice with fill-in-
                the-blank — full step-by-step solutions and explanations every time.
              </p>
            </div>
            <span className="shrink-0 px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium">
              Open quiz
            </span>
          </a>

          <a
            href="/discrete-maths/passco"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-[#EAF2FF] px-5 py-4 hover:border-accent transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-accent">{discreteMathsPasscoBank.length}-question Passco Room →</p>
              <p className="text-sm text-body mt-0.5">
                Real past-questions and revision problems from worksheets and an actual exam,
                grouped by topic, with a full step-by-step solution and pattern-spotting tip for
                every question.
              </p>
            </div>
            <span className="shrink-0 px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium">
              Open Passco
            </span>
          </a>

          <section id="dm-part-0" className="space-y-6 scroll-mt-24">
            <PartHeading number="0" title="Discrete Math Orientation" />
            <p className="text-sm text-secondary">
              Click a topic to expand it. Start here for the big picture, then dig into
              each part below.
            </p>
            <BasicsCheatsheet groups={discreteMathsFundamentalsGroups} />
          </section>

          <section id="dm-part-1" className="space-y-6 scroll-mt-24">
            <PartHeading number="1" title="Propositional Logic" />
            <p className="text-sm text-secondary">
              Build a truth table for any expression, then watch the same expression light up as
              a circuit of AND/OR/NOT gates (Rosen 1.1-1.3).
            </p>
            <TruthTableSimulator />
            <LogicCircuitSimulator />
            <WorkedProblems problems={part1WorkedProblems} />
          </section>

          <section id="dm-part-2" className="space-y-6 scroll-mt-24">
            <PartHeading number="2" title="Quantifiers & Inference" />
            <p className="text-sm text-secondary">
              See ∀ and ∃ run like nested loops over a small domain, then chain rules of
              inference to build a real argument step by step (Rosen 1.4-1.6).
            </p>
            <QuantifierVisualizer />
            <InferenceBuilder />
            <WorkedProblems problems={part2WorkedProblems} />
          </section>

          <section id="dm-part-3" className="space-y-6 scroll-mt-24">
            <PartHeading number="3" title="Proof Techniques" />
            <p className="text-sm text-secondary">
              Direct proof, proof by contradiction, the pigeonhole principle, and iff proofs —
              each one revealed one justified step at a time (Rosen 1.7-1.8).
            </p>
            <WorkedProblems problems={part3WorkedProblems} />
          </section>

          <section id="dm-part-4" className="space-y-6 scroll-mt-24">
            <PartHeading number="4" title="Sets & Set Operations" />
            <p className="text-sm text-secondary">
              Edit two sets and watch the Venn diagram and every set operation update live
              (Rosen 2.1-2.2).
            </p>
            <SetOperationsVenn />
            <WorkedProblems problems={part4WorkedProblems} />
          </section>

          <section id="dm-part-5" className="space-y-6 scroll-mt-24">
            <PartHeading number="5" title="Functions & Sequences" />
            <p className="text-sm text-secondary">
              Build a mapping by hand and see it classified live, then step through recurrences
              and summations term by term (Rosen 2.3-2.4).
            </p>
            <FunctionMappingSimulator />
            <SequenceRecurrenceStepper />
            <WorkedProblems problems={part5WorkedProblems} />
          </section>

          <section id="dm-part-6" className="space-y-6 scroll-mt-24">
            <PartHeading number="6" title="Algorithms" />
            <p className="text-sm text-secondary">
              Step through linear vs. binary search, bubble vs. insertion sort, greedy coin
              change, and compare growth rates on a live chart (Rosen 3.1-3.3).
            </p>
            <SearchAlgorithmSimulator />
            <SortAlgorithmSimulator />
            <GreedyCoinChangeSimulator />
            <BigOGrowthChart />
            <WorkedProblems problems={part6WorkedProblems} />
          </section>

          <section id="dm-part-7" className="space-y-6 scroll-mt-24">
            <PartHeading number="7" title="Induction & Recursion" />
            <p className="text-sm text-secondary">
              Build an induction proof rung by rung, watch a recursive call stack unwind, and
              trace merge sort's divide-and-conquer (Rosen 5.1, 5.3-5.4).
            </p>
            <InductionProofBuilder />
            <RecursionCallStackSimulator />
            <MergeSortSimulator />
            <WorkedProblems problems={part7WorkedProblems} />
          </section>

          <section id="dm-part-8" className="space-y-6 scroll-mt-24">
            <PartHeading number="8" title="Counting" />
            <p className="text-sm text-secondary">
              See the product and sum rules as literal decision trees, watch the pigeonhole
              principle force a collision, and calculate permutations vs. combinations (Rosen
              6.1-6.3).
            </p>
            <CountingTreeDiagram />
            <PigeonholeDemo />
            <PermutationCombinationCalculator />
            <WorkedProblems problems={part8WorkedProblems} />
          </section>

          <section id="dm-part-9" className="space-y-6 scroll-mt-24">
            <PartHeading number="9" title="Relations" />
            <p className="text-sm text-secondary">
              Check any relation for reflexive/symmetric/antisymmetric/transitive, then watch an
              equivalence relation partition a set into classes (Rosen 9.1, 9.5).
            </p>
            <RelationPropertyChecker />
            <EquivalenceClassPartitioner />
            <WorkedProblems problems={part9WorkedProblems} />
          </section>

          <section id="dm-part-10" className="space-y-6 scroll-mt-24">
            <PartHeading number="10" title="Graphs" />
            <p className="text-sm text-secondary">
              Click through an acquaintanceship graph, explore the named graph families, and
              trace Dijkstra's algorithm finding a shortest path (Rosen 10.1-10.2, 10.6).
            </p>
            <GraphBuilder />
            <NamedGraphExplorer />
            <DijkstraSimulator />
            <WorkedProblems problems={part10WorkedProblems} />
          </section>

          <section id="dm-part-11" className="space-y-6 scroll-mt-24">
            <PartHeading number="11" title="Trees" />
            <p className="text-sm text-secondary">
              Explore tree vocabulary, build a binary search tree and a Huffman code step by
              step, animate the three traversal orders, and compare Prim's vs. Kruskal's minimum
              spanning tree (Rosen 11.1-11.3, 11.5).
            </p>
            <TreeTerminologySimulator />
            <BSTBuilder />
            <HuffmanCodingBuilder />
            <TreeTraversalAnimator />
            <MSTComparisonSimulator />
            <WorkedProblems problems={part11WorkedProblems} />
          </section>

          <section id="dm-part-12" className="space-y-6 scroll-mt-24">
            <PartHeading number="12" title="MCQ Drill Bank" />
            <p className="text-sm text-secondary">
              A quick spot-check spanning every part of this room, from propositional logic all
              the way to minimum spanning trees.
            </p>
            <MCQDrill questions={discreteMathsMcqBank} />
          </section>

          <section id="feedback" className="scroll-mt-24 max-w-2xl">
            <FeedbackForm />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
