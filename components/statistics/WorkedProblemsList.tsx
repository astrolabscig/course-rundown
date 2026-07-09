import ProofWalkthrough from "./ProofWalkthrough";
import type { WorkedProblem } from "@/lib/statistics/workedProblems";

export default function WorkedProblemsList({ problems }: { problems: WorkedProblem[] }) {
  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-secondary uppercase tracking-wide">
        Worked problems from the course material
      </p>
      {problems.map((p) => (
        <ProofWalkthrough
          key={p.id}
          title={p.label}
          given={p.given}
          goal={p.goal}
          steps={p.steps}
          conclusion={p.conclusion}
        />
      ))}
    </div>
  );
}
