export default function OutputPanel({ output }: { output: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
        Output
      </div>
      <pre className="rounded-xl bg-[#1f1f1f] text-[#e8e8e8] font-mono text-sm p-4 overflow-x-auto whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
}
