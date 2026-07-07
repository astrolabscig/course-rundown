"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const accounts = [
  {
    id: "current",
    label: "Current Account",
    color: "border-accent",
    items: [
      { name: "Trade in goods", detail: "Exports minus imports of physical goods (e.g. cocoa, oil, machinery)." },
      { name: "Trade in services", detail: "Exports minus imports of services (e.g. tourism, shipping, banking)." },
      { name: "Income flows", detail: "Wages, interest, profit and dividends earned from/paid to abroad." },
      { name: "Current transfers", detail: "Money sent with nothing bought in return, e.g. remittances, foreign aid." },
    ],
  },
  {
    id: "capital",
    label: "Capital Account",
    color: "border-accent-warm",
    items: [
      { name: "Transfer of funds by migrants", detail: "Assets migrants bring into or take out of the country." },
      { name: "Government project grants", detail: "Payment of grants for overseas projects, and receipts for projects here." },
    ],
  },
  {
    id: "financial",
    label: "Financial Account",
    color: "border-success",
    items: [
      { name: "Direct investment", detail: "Buying/building real productive assets abroad (e.g. a factory)." },
      { name: "Portfolio investment", detail: "Buying shares, bonds and securities — no direct control of a firm." },
      { name: "Other financial flows", detail: "Mainly short-term flows — bank deposits, loans." },
      { name: "Flows to/from reserves", detail: "Central bank buying/selling foreign currency reserves." },
    ],
  },
];

export default function BalanceOfPaymentsBreakdown() {
  const [openId, setOpenId] = useState<string | null>("current");
  const interactedRef = useRef(false);

  function toggle(id: string) {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Think of it as a country's bank statement with the rest of the world">
        <p>
          Every country trades and does financial business with everyone else — so every country
          is an &ldquo;open economy.&rdquo; The balance of payments simply records all of it:
          money earned from selling things abroad (current account), money moving in from
          migrants and grants (capital account), and money buying/selling actual assets like
          shares and property (financial account).
        </p>
      </ExplainerBox>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div key={account.id} className={`rounded-2xl border-2 ${account.color} bg-card overflow-hidden`}>
            <button
              type="button"
              onClick={() => toggle(account.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-semibold text-heading">{account.label}</span>
              <span className="text-secondary text-sm">{openId === account.id ? "▲" : "▼"}</span>
            </button>
            {openId === account.id && (
              <div className="px-4 pb-4 space-y-2">
                {account.items.map((item) => (
                  <div key={item.name} className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-heading">{item.name}</p>
                    <p className="text-xs text-secondary mt-0.5">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
