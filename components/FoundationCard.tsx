"use client";

import { useState } from "react";
import Card from "./Card";
import CodeBlock from "./CodeBlock";
import OutputPanel from "./OutputPanel";
import ErrorPanel from "./ErrorPanel";
import { trackInteract } from "@/lib/track";
import type { FoundationCardData } from "@/lib/foundations";

export default function FoundationCard({ data }: { data: FoundationCardData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const variant = data.variants[activeIndex];

  return (
    <Card id={data.id} title={data.title} situation={data.situation} why={data.why} examTip={data.examTip}>
      <div
        role="tablist"
        aria-label={`${data.title} code variants`}
        className="flex flex-wrap gap-2"
      >
        {data.variants.map((v, i) => (
          <button
            key={v.label}
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => {
              setActiveIndex(i);
              trackInteract();
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              i === activeIndex
                ? "bg-accent text-white border-accent"
                : "bg-white text-body border-card-border hover:border-accent"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <CodeBlock code={variant.code} />

      {variant.kind === "output" ? (
        <OutputPanel output={variant.result} />
      ) : (
        <>
          <ErrorPanel error={variant.result} />
          {variant.fixNote && (
            <p className="text-sm text-body">
              <span className="font-semibold text-heading">{variant.fixNote}</span>
            </p>
          )}
        </>
      )}
    </Card>
  );
}
