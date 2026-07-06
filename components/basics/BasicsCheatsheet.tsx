"use client";

import { useRef } from "react";
import BasicsEntryCard from "./BasicsEntryCard";
import { basicsGroups } from "@/lib/basics";
import { trackInteract } from "@/lib/track";

export default function BasicsCheatsheet() {
  const interacted = useRef(false);

  function handleToggle() {
    if (!interacted.current) {
      interacted.current = true;
      trackInteract();
    }
  }

  return (
    <div className="space-y-3">
      {basicsGroups.map((group, i) => (
        <details
          key={group.id}
          id={group.id}
          open={i === 0}
          onToggle={handleToggle}
          className="rounded-2xl border border-card-border bg-muted overflow-hidden"
        >
          <summary className="cursor-pointer select-none px-5 py-3 text-base font-semibold text-heading hover:text-accent transition-colors">
            {group.title}
          </summary>
          <div className="px-5 pb-5 space-y-4">
            {group.entries.map((entry) => (
              <BasicsEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
