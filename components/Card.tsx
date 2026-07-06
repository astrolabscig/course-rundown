import { ReactNode } from "react";

export default function Card({
  id,
  title,
  situation,
  children,
  why,
  examTip,
}: {
  id?: string;
  title: string;
  situation: string;
  children: ReactNode;
  why: string;
  examTip: string;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 scroll-mt-24 transition-all duration-200 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
    >
      <h3 className="text-lg font-semibold text-heading mb-1">{title}</h3>
      <p className="text-body mb-4">{situation}</p>

      <div className="space-y-4">{children}</div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-muted p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
            Why
          </div>
          <p className="text-sm text-body">{why}</p>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
            Exam tip
          </div>
          <p className="text-sm text-body">{examTip}</p>
        </div>
      </div>
    </section>
  );
}
