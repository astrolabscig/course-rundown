import type { FormulaPart, FormulaSection } from "@/lib/statistics/formulaSheet";

function FormulaPartView({ part }: { part: FormulaPart }) {
  if (part.type === "text") {
    return <span>{part.value}</span>;
  }
  if (part.type === "frac") {
    return (
      <span className="inline-flex flex-col items-center align-middle mx-0.5 text-[0.85em] leading-tight">
        <span className="px-1.5 pb-0.5 border-b-2 border-current">{part.num}</span>
        <span className="px-1.5 pt-0.5">{part.den}</span>
      </span>
    );
  }
  // sqrt
  return (
    <span className="inline-flex items-start mx-0.5">
      {part.index && <sup className="text-[0.55em] leading-none mt-0.5">{part.index}</sup>}
      <span className="text-[1.1em] leading-none">√</span>
      <span className="border-t-2 border-current px-0.5 pt-0.5">{part.value}</span>
    </span>
  );
}

function FormulaDisplay({ parts }: { parts: FormulaPart[] }) {
  return (
    <div className="font-mono text-sm text-accent bg-code-bg rounded-lg px-3 py-3 mb-2 flex flex-wrap items-center gap-y-2">
      {parts.map((part, i) => (
        <FormulaPartView key={i} part={part} />
      ))}
    </div>
  );
}

export default function FormulaCheatsheet({ sections }: { sections: FormulaSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 scroll-mt-24"
        >
          <h3 className="text-base font-semibold text-heading mb-4">{section.title}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.formulas.map((f) => (
              <div key={f.id} className="rounded-xl border border-card-border bg-muted p-4">
                <p className="text-sm font-semibold text-heading mb-2">{f.name}</p>
                <FormulaDisplay parts={f.formula} />
                {f.where && f.where.length > 0 && (
                  <ul className="space-y-1 mb-2">
                    {f.where.map((w, i) => (
                      <li key={i} className="text-xs text-secondary flex gap-1.5">
                        <span className="text-accent shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {f.note && <p className="text-xs text-secondary italic">{f.note}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
