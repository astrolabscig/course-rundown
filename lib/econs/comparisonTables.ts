import type { ComparisonTableData } from "@/lib/comparisonTables";

export const econsComparisonTables: ComparisonTableData[] = [
  {
    id: "demand-pull-vs-cost-push",
    title: "Demand-Pull vs Cost-Push Inflation",
    columns: ["Demand-Pull Inflation", "Cost-Push Inflation"],
    rows: [
      ["Caused by continuing rises in aggregate demand.", "Caused by continuing rises in production costs."],
      ["The AD curve shifts to the right.", "The AS curve shifts left/upward."],
      ["Causes: war, rising exports, rapid industrialisation, wage rises without matching output.", "Causes: wage-push, import-price-push, tax-push, exhaustion of natural resources."],
      ["Price level rises, output tends to rise too.", "Price level rises, but output tends to fall."],
    ],
  },
  {
    id: "fixed-vs-floating-exchange-rate",
    title: "Fixed vs Floating Exchange Rates",
    columns: ["Fixed (Pegged)", "Purely Floating"],
    rows: [
      ["Value is pegged by a monetary authority against another currency.", "Determined freely by market demand and supply."],
      ["Government must intervene to defend the peg.", "Government does not intervene at all."],
      ["Provides certainty for trade and investment.", "Automatically balances the balance of payments."],
      ["Can be costly to maintain if market pressure is strong.", "Can fluctuate a lot in the short term."],
    ],
  },
  {
    id: "actual-vs-potential-growth",
    title: "Actual vs Potential Economic Growth",
    columns: ["Actual Growth", "Potential Growth"],
    rows: [
      ["The percentage annual increase in what the economy actually produces.", "The percentage annual increase in what the economy COULD produce at full capacity."],
      ["Fluctuates with the business cycle (booms and recessions).", "Grows more smoothly, driven by resources/technology/productivity."],
      ["Can temporarily exceed potential output (overheating) or fall short (recession).", "Sets the long-term ceiling actual output tends to move around."],
    ],
  },
  {
    id: "disequilibrium-vs-equilibrium-unemployment",
    title: "Disequilibrium vs Equilibrium (Natural) Unemployment",
    columns: ["Disequilibrium Unemployment", "Equilibrium (Natural) Unemployment"],
    rows: [
      ["Occurs when aggregate labour supply exceeds aggregate labour demand at the going wage.", "Exists even when the labour market has cleared at the equilibrium wage."],
      ["Requires wages to be 'sticky' — not falling immediately to the market-clearing level.", "Caused by frictional, structural, and seasonal factors, not a wage-rate mismatch."],
      ["Types: real-wage (classical) unemployment, demand-deficient (cyclical) unemployment.", "Types: frictional (search), structural, seasonal, residual unemployment."],
    ],
  },
  {
    id: "current-vs-capital-financial-account",
    title: "Current Account vs Capital & Financial Accounts",
    columns: ["Current Account", "Capital & Financial Accounts"],
    rows: [
      ["Records trade in goods, trade in services, income flows, and current transfers.", "Capital account: flows of funds like migrant transfers and government project grants."],
      ["Concerned with money INCOMES — what's earned from trade and investment income.", "Financial account: concerned with the purchase/sale of ASSETS — shares, property, deposits, loans, securities."],
      ["A deficit here must be offset elsewhere in the balance of payments.", "Financial account investment splits into direct, portfolio, and other (mainly short-term) flows."],
    ],
  },
];
