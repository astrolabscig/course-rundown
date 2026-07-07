"use client";

import { useRef } from "react";
import PassQuestionCard, { type PassQuestion } from "./PassQuestionCard";
import { trackInteract } from "@/lib/track";

export default function PasscoCheatsheet({ questions }: { questions: PassQuestion[] }) {
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  return (
    <div className="space-y-4">
      {questions.map((item, i) => (
        <PassQuestionCard key={item.id} item={item} index={i} onReveal={markInteracted} />
      ))}
    </div>
  );
}
