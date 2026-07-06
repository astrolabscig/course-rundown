export default function ErrorPanel({ error }: { error: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-error mb-1">
        Compiler / linker error
      </div>
      <pre className="rounded-xl bg-error-bg text-error font-mono text-sm p-4 border-l-4 border-error overflow-x-auto whitespace-pre-wrap">
        {error}
      </pre>
    </div>
  );
}
