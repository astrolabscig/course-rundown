export default function ComingSoon({ note }: { note: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-card-border bg-muted p-6 text-sm text-secondary">
      {note}
    </div>
  );
}
