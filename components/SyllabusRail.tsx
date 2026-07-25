"use client";

import { useEffect, useRef, useState } from "react";
import type { CurriculumPart } from "@/lib/curriculum";

function NavLinks({
  parts,
  visited,
  activeId,
}: {
  parts: CurriculumPart[];
  visited: Set<string>;
  activeId: string | null;
}) {
  return (
    <nav aria-label="Course contents" className="space-y-1">
      {parts.map((part) => {
        const isActive = part.id === activeId;
        return (
          <a
            key={part.id}
            href={`#${part.id}`}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 -mx-2.5 text-sm transition-colors ${
              isActive
                ? "bg-accent/10 text-accent font-semibold"
                : "text-body hover:text-accent hover:bg-muted"
            }`}
          >
            {part.number && (
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  isActive
                    ? "bg-accent text-white"
                    : visited.has(part.id)
                      ? "bg-accent/20 text-accent"
                      : "border border-card-border bg-card text-secondary"
                }`}
              >
                {visited.has(part.id) && !isActive ? "✓" : part.number}
              </span>
            )}
            <span>{part.title}</span>
          </a>
        );
      })}
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const intersectingRef = useRef<Map<string, boolean>>(new Map());

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
        for (const entry of entries) {
          intersectingRef.current.set(entry.target.id, entry.isIntersecting);
        }
        const firstActive = parts.find((p) => intersectingRef.current.get(p.id));
        setActiveId(firstActive ? firstActive.id : null);

        setVisited((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const entry of entries) {
            if (entry.isIntersecting && !next.has(entry.target.id)) {
              next.add(entry.target.id);
              changed = true;
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
          <NavLinks parts={parts} visited={visited} activeId={activeId} />
        </div>
      </details>

      <aside className="hidden md:block w-64 shrink-0 border-r border-card-border">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <NavLinks parts={parts} visited={visited} activeId={activeId} />
        </div>
      </aside>
    </>
  );
}
