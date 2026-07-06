"use client";

import { useState } from "react";
import { trackInteract } from "@/lib/track";

type Modifier = "public" | "protected" | "private";
type Context = "inside" | "child" | "outside";

const modifiers: Modifier[] = ["public", "protected", "private"];
const contexts: { key: Context; label: string }[] = [
  { key: "inside", label: "Inside the class" },
  { key: "child", label: "In a child class" },
  { key: "outside", label: "Outside, via an object" },
];

const rules: Record<Modifier, Record<Context, { allowed: boolean; reason: string }>> = {
  public: {
    inside: { allowed: true, reason: "Any member can always access other members of its own class." },
    child: { allowed: true, reason: "public members are inherited and remain fully accessible in the child class." },
    outside: { allowed: true, reason: "public is the class's external interface — that's the whole point of making it public." },
  },
  protected: {
    inside: { allowed: true, reason: "Always accessible from within the class that declares it." },
    child: { allowed: true, reason: "protected exists specifically so a derived class can reach it, even though outside code can't." },
    outside: { allowed: false, reason: "protected blocks access from outside the class hierarchy, unlike public." },
  },
  private: {
    inside: { allowed: true, reason: "private is still fully usable inside the class that declares it." },
    child: { allowed: false, reason: "private members are NOT accessible to a derived class — only protected/public members are reachable there. The member still exists in the child object's memory; it just can't be named directly." },
    outside: { allowed: false, reason: "private hides the member entirely from anything outside the class — this is the core mechanism of encapsulation." },
  },
};

export default function AccessControlGrid() {
  const [selected, setSelected] = useState<{ mod: Modifier; ctx: Context } | null>(null);

  function select(mod: Modifier, ctx: Context) {
    setSelected({ mod, ctx });
    trackInteract();
  }

  const result = selected ? rules[selected.mod][selected.ctx] : null;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-secondary font-medium"> </th>
              {contexts.map((c) => (
                <th key={c.key} className="p-2 text-heading font-semibold text-left">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modifiers.map((mod) => (
              <tr key={mod}>
                <td className="p-2 font-mono font-semibold text-heading">{mod}</td>
                {contexts.map((c) => {
                  const cell = rules[mod][c.key];
                  const isSelected = selected?.mod === mod && selected.ctx === c.key;
                  return (
                    <td key={c.key} className="p-2">
                      <button
                        type="button"
                        onClick={() => select(mod, c.key)}
                        className={`w-full rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
                          isSelected
                            ? cell.allowed
                              ? "bg-success text-white border-success"
                              : "bg-error text-white border-error"
                            : cell.allowed
                            ? "bg-white text-success border-success/40 hover:border-success"
                            : "bg-white text-error border-error/40 hover:border-error"
                        }`}
                      >
                        {cell.allowed ? "Allowed" : "Denied"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result && selected && (
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-body">
            <span className="font-mono font-semibold">{selected.mod}</span> member,{" "}
            <span className="font-semibold">
              {contexts.find((c) => c.key === selected.ctx)?.label.toLowerCase()}
            </span>{" "}
            →{" "}
            <span className={result.allowed ? "text-success font-semibold" : "text-error font-semibold"}>
              {result.allowed ? "Allowed" : "Denied"}
            </span>
            . {result.reason}
          </p>
        </div>
      )}
    </div>
  );
}
