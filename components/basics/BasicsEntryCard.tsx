import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ExplainerBox from "../ExplainerBox";
import type { BasicsEntry } from "@/lib/basics";

export default function BasicsEntryCard({ entry }: { entry: BasicsEntry }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
      <h4 className="text-base font-semibold text-heading mb-1">{entry.title}</h4>
      <p className="text-sm text-body mb-4">{entry.summary}</p>

      <div className="mb-4">
        <ExplainerBox>
          <p>{entry.eli5}</p>
        </ExplainerBox>
      </div>

      {entry.code && (
        <div className="mb-4">
          <CodeBlock code={entry.code} />
        </div>
      )}

      {entry.output && (
        <div className="mb-4">
          <OutputPanel output={entry.output} />
        </div>
      )}

      <ul className="space-y-1.5">
        {entry.points.map((point, i) => (
          <li key={i} className="text-sm text-body flex gap-2">
            <span className="text-accent shrink-0">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
