import type { FormulaSection } from "@/lib/statistics/formulaSheet";

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
                <p className="font-mono text-sm text-accent bg-code-bg rounded-lg px-3 py-2 mb-2 overflow-x-auto whitespace-pre">
                  {f.formula}
                </p>
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
