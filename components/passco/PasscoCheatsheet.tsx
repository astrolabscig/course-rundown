"use client";

import { useRef, useState } from "react";
import PassQuestionCard from "./PassQuestionCard";
import { PASS_SECTIONS, type PassQuestion, type PassSection } from "@/lib/passcoBank";
import { trackInteract } from "@/lib/track";

export default function PasscoCheatsheet({ questions }: { questions: PassQuestion[] }) {
  const [active, setActive] = useState<PassSection | "all">("all");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const filtered = active === "all" ? questions : questions.filter((q) => q.section === active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            active === "all" ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
          }`}
        >
          All ({questions.length})
        </button>
        {PASS_SECTIONS.map((s) => {
          const count = questions.filter((q) => q.section === s.id).length;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                active === s.id ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((item, i) => (
          <PassQuestionCard key={item.id} item={item} index={i} onReveal={markInteracted} />
        ))}
      </div>
    </div>
  );
}
