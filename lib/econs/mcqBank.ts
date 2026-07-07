import type { MCQ } from "@/lib/mcqBank";

export const econsMcqBank: MCQ[] = [
  {
    id: "e-mcq-1",
    question: "Which of these is a macroeconomic (not microeconomic) question?",
    options: [
      "Why does this bakery charge more for bread than its rival?",
      "Why is the national unemployment rate rising?",
      "Why did this one household switch from rice to bread?",
      "Why does this firm's supply curve slope upward?",
    ],
    correctIndex: 1,
    explanation: "Macroeconomics looks at the economy as a whole (national unemployment, inflation, growth) rather than a single market or household.",
  },
  {
    id: "e-mcq-2",
    question: "In the aggregate demand identity AD = C + I + G + X − M, what does the M stand for?",
    options: ["Money supply", "Manufacturing output", "Imports", "Marginal propensity to consume"],
    correctIndex: 2,
    explanation: "M is imports — spending that leaves the domestic circular flow, which is why it's subtracted.",
  },
  {
    id: "e-mcq-3",
    question: "Which of these is a withdrawal (leakage) from the circular flow of income?",
    options: ["Government expenditure", "Exports", "Savings", "Investment"],
    correctIndex: 2,
    explanation: "Savings, net taxes, and import expenditure are the three withdrawals — money that leaves the inner spending flow. Investment, government spending, and exports are injections, not withdrawals.",
  },
  {
    id: "e-mcq-4",
    question: "Which method of measuring national income adds up wages, rent, interest, and profit?",
    options: ["The output (product) method", "The income method", "The expenditure method", "The deflator method"],
    correctIndex: 1,
    explanation: "The income method sums all factor incomes (wages to labour, rent to land, interest to capital, profit to entrepreneurship).",
  },
  {
    id: "e-mcq-5",
    question: "Real GDP, unlike nominal GDP, is calculated using...",
    options: ["Current-year prices", "Constant base-year prices", "Foreign currency prices", "Only export prices"],
    correctIndex: 1,
    explanation: "Real GDP uses fixed base-year prices so that changes in real GDP reflect changes in actual quantities produced, not just price inflation.",
  },
  {
    id: "e-mcq-6",
    question: "Frictional unemployment is best described as unemployment caused by...",
    options: [
      "A fall in aggregate demand",
      "Imperfect information — it takes time to match searching workers to vacancies",
      "Trade unions pushing wages above the market-clearing level",
      "The seasons of the year",
    ],
    correctIndex: 1,
    explanation: "Frictional (search) unemployment exists even when vacancies are available, simply because matching workers to jobs takes time.",
  },
  {
    id: "e-mcq-7",
    question: "Cost-push inflation is most directly caused by a shift in which curve?",
    options: ["Aggregate demand shifts right", "Aggregate supply shifts left (costs rise)", "Aggregate supply shifts right", "The Phillips curve shifts left"],
    correctIndex: 1,
    explanation: "Cost-push inflation comes from rising production costs, which shift the aggregate supply curve left/upward, raising prices while output tends to fall.",
  },
  {
    id: "e-mcq-8",
    question: "The Phillips curve originally illustrated a trade-off between...",
    options: ["Growth and inflation", "Inflation and unemployment", "Imports and exports", "Interest rates and savings"],
    correctIndex: 1,
    explanation: "The original Phillips curve showed that lower unemployment tended to come with higher inflation, and vice versa.",
  },
  {
    id: "e-mcq-9",
    question: "A country's balance of payments current account records all of the following EXCEPT...",
    options: ["Trade in goods", "Trade in services", "Purchases of foreign shares and property", "Income flows and current transfers"],
    correctIndex: 2,
    explanation: "Purchases of foreign shares/property/assets belong to the financial account, not the current account, which is about incomes from trade and investment.",
  },
  {
    id: "e-mcq-10",
    question: "If the Ghana cedi depreciates against the US dollar, this means...",
    options: [
      "Fewer cedis are now needed to buy one dollar",
      "More cedis are now needed to buy one dollar",
      "The cedi and the dollar now have equal value",
      "Ghana has adopted a fixed exchange rate",
    ],
    correctIndex: 1,
    explanation: "Depreciation is a fall in the free-market value of the domestic currency — it now takes MORE cedis to buy the same one dollar.",
  },
];
