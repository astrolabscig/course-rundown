import type { BasicsGroup } from "@/lib/basics";

export const econsFundamentalsGroups: BasicsGroup[] = [
  {
    id: "scope-of-macro",
    title: "What macroeconomics actually is",
    entries: [
      {
        id: "macro-vs-micro",
        title: "Macroeconomics vs microeconomics",
        summary: "Micro looks at single markets; macro looks at the whole economy at once.",
        eli5:
          "Imagine a whole country is a giant kitchen with millions of cooks (households and firms) all cooking at the same time. Microeconomics zooms in on one cook and one dish — why does this baker charge this much for bread? Macroeconomics steps back and looks at the WHOLE kitchen: is it producing more food than last year? Are enough cooks employed? Are prices across the whole kitchen rising? It ignores the differences between individual cooks so it can see the big picture.",
        points: [
          "Macroeconomics is the economics of the economy as a whole; microeconomics is the economics of the single market.",
          "Macroeconomics deliberately simplifies by ignoring differences among individual households and firms.",
          "It matters because it affects everyone at once: jobs, prices, growth, trade.",
        ],
      },
      {
        id: "macro-objectives",
        title: "The four (or so) macroeconomic goals",
        summary: "Governments generally chase: growth, low unemployment, low inflation, and a healthy balance of payments.",
        eli5:
          "Think of a country like a household trying to juggle four things at once: earning more each year (growth), making sure everyone who wants a job has one (employment), not letting prices spiral out of control (stable prices), and not spending way more abroad than it earns from abroad (balance of payments). The tricky part: pushing hard on one often knocks another off balance.",
        points: [
          "Economic growth: real GDP growing faster than population improves average living standards.",
          "High employment: labour earnings are most households' main income, so low unemployment matters directly.",
          "Stable prices (low inflation): inflation imposes real costs on society, so keeping it low is a goal in itself.",
          "Balance of payments / stable exchange rates: helps reduce inflation, promotes trade, and supports a favourable trade balance.",
        ],
      },
      {
        id: "policy-tradeoffs",
        title: "Why you can't maximise all four goals at once",
        summary: "Chasing faster growth or lower unemployment often makes another objective worse — that's an opportunity cost.",
        eli5:
          "It's like trying to turn up the heat, the volume, and the brightness on your phone all at once when the battery is limited — pushing one up often means another has to come down. A government chasing faster growth might trigger more inflation or a worse trade balance; chasing lower unemployment can do the same. Policymakers constantly have to choose which trade-off they're willing to accept.",
        points: [
          "Faster growth can conflict with a favourable balance of payments (more imports as people get richer).",
          "Lower unemployment can conflict with lower inflation (more on this in the Phillips Curve section).",
          "Because trade-offs exist, policy-makers must set priorities, not just chase every goal at full strength.",
        ],
      },
    ],
  },
  {
    id: "key-terms",
    title: "Definitions you must know cold",
    entries: [
      {
        id: "growth-inflation-unemployment",
        title: "Economic growth, inflation, unemployment",
        summary: "The three headline numbers reported in every macro news story.",
        eli5:
          "Growth is 'is the economy's total output bigger than last year?'. Inflation is 'are things getting more expensive on average?'. Unemployment is 'how many people who want a job can't find one?'.",
        code: "Rate of economic growth = % increase in national output over 12 months\nRate of inflation = % increase in the general price level over 12 months\nUnemployed = people of working age, without work, but available for work at current wage rates",
        points: [
          "Rate of economic growth: the percentage increase in national output over a 12-month period.",
          "Inflation: a persistent increase in the general price level over time; the inflation rate is its 12-month percentage change.",
          "Unemployment: people of working age who are without work but available for work at current wage rates — this excludes students, housewives, and discouraged workers who've stopped searching.",
        ],
      },
      {
        id: "exchange-rate-bop",
        title: "Exchange rate & balance of payments",
        summary: "One is a price (of currency); the other is a country's financial scorecard with the rest of the world.",
        eli5:
          "The exchange rate is simply the 'price tag' for swapping one country's money for another's — like Gh¢14 buying you $1. The balance of payments is like a country's bank statement with the rest of the world: money coming in (credits) and money going out (debits) for everything from selling cocoa abroad to foreign companies investing here.",
        code: "Exchange rate example: Gh¢14 = $1\nBalance of payments = record of a country's transactions with the rest of the world (debits + credits)",
        points: [
          "Exchange rate: the rate at which one national currency exchanges for another.",
          "Balance of payments account: a record of a country's transactions with the rest of the world — payments/deposits abroad (debits) and receipts/deposits from abroad (credits).",
        ],
      },
    ],
  },
  {
    id: "four-objectives-relationship",
    title: "How the four objectives move together",
    entries: [
      {
        id: "ad-and-the-four-objectives",
        title: "What happens when aggregate demand rises relative to potential output",
        summary: "One change in AD ripples through all four macro objectives at once, in a fairly predictable pattern.",
        eli5:
          "Picture the economy as one big engine. Rev it up (AD rises faster than the economy's true capacity) and several dashboard lights react together: the 'jobs' light gets better (unemployment falls), but the 'prices' light gets worse (inflation rises), and the 'trade' light also gets worse (more imports, BOP deteriorates) — while the 'growth' light briefly shines bright. Rev it down (a recession) and it's the reverse.",
        points: [
          "If injections exceed withdrawals, AD rises: unemployment falls, inflation tends to rise, the trade balance tends to deteriorate, and there is (short-term) economic growth.",
          "This is exactly why the four objectives constantly trade off against each other over the business cycle — you rarely get all four moving in a good direction simultaneously.",
          "Long-term policy success means managing potential output growth (supply-side), not just riding the demand-driven ups and downs.",
        ],
      },
    ],
  },
];
