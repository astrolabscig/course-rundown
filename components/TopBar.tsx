import Link from "next/link";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-card-border bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-3 flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent font-mono text-sm font-bold text-white">
            {"</>"}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent-warm" />
          </span>
          <span className="text-lg font-semibold text-heading">Course Rundown</span>
        </Link>
        <span className="ml-auto shrink-0 rounded-full border border-card-border bg-muted px-3 py-1 text-sm sm:text-base font-mono font-semibold text-accent">
          @astrolab
        </span>
      </div>
    </header>
  );
}
