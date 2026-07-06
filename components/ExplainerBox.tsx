import { ReactNode } from "react";

export default function ExplainerBox({
  title = "In plain English",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-accent/20 bg-[#EAF2FF] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1.5">{title}</p>
      <div className="text-sm text-body space-y-2 leading-relaxed">{children}</div>
    </div>
  );
}
