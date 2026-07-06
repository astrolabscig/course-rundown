"use client";

import { useEffect, useState } from "react";
import type { CurriculumPart } from "@/lib/curriculum";

function NavLinks({ parts, visited }: { parts: CurriculumPart[]; visited: Set<string> }) {
  return (
    <nav aria-label="Course contents" className="space-y-1">
      {parts.map((part) => (
        <a
          key={part.id}
          href={`#${part.id}`}
          className="flex items-center gap-2 rounded-full px-2 py-1.5 -mx-2 text-sm text-body hover:text-accent hover:bg-muted transition-colors"
        >
          {part.number && (
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                visited.has(part.id)
                  ? "bg-accent text-white"
                  : "border border-card-border bg-white text-secondary"
              }`}
            >
              {visited.has(part.id) ? "✓" : part.number}
            </span>
          )}
          <span>{part.title}</span>
        </a>
      ))}
    </nav>
  );
}

export default function SyllabusRail({
  parts,
  storageKey,
}: {
  parts: CurriculumPart[];
  storageKey: string;
}) {
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    let stored: string[] = [];
    try {
      stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
      stored = [];
    }
    setVisited(new Set(stored));

    const observer = new IntersectionObserver(
      (entries) => {
        setVisited((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (!next.has(entry.target.id)) {
                next.add(entry.target.id);
                changed = true;
              }
            }
          }
          if (changed) {
            localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
            return next;
          }
          return prev;
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    parts.forEach((part) => {
      const el = document.getElementById(part.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [parts, storageKey]);

  return (
    <>
      <details className="md:hidden border-b border-card-border bg-muted">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-heading">
          Course contents
        </summary>
        <div className="px-4 pb-4">
          <NavLinks parts={parts} visited={visited} />
        </div>
      </details>

      <aside className="hidden md:block w-64 shrink-0 border-r border-card-border">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <NavLinks parts={parts} visited={visited} />
          <p className="mt-6 text-xs text-secondary">
            Built by <span className="font-mono font-medium text-heading">@astrolab</span>
          </p>
        </div>
      </aside>
    </>
  );
}
