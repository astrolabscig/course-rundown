export interface LabModule {
  number: number;
  title: string;
  icon: string;
  teaser: string;
  href?: string;
}

export const labModules: LabModule[] = [
  { number: 1, title: "Business Cycle", icon: "🌊", teaser: "Watch Real GDP swing through five phases, then trigger a recession or recovery yourself.", href: "/econs/lab/business-cycle" },
  { number: 2, title: "Long-Run Economic Growth", icon: "📐", teaser: "Reshape the economy's long-term trend with education, technology, investment, and infrastructure.", href: "/econs/lab/growth" },
  { number: 3, title: "Output Gap", icon: "🔀", teaser: "Real GDP vs. Potential GDP, side by side, with the gap between them shaded live.", href: "/econs/lab/output-gap" },
  { number: 4, title: "Aggregate Demand", icon: "🛒", teaser: "See how consumption, investment, government spending, and net exports shift the AD curve." },
  { number: 5, title: "Aggregate Supply", icon: "🏭", teaser: "Trigger an oil crisis, a tech breakthrough, or a natural disaster and watch supply shift." },
  { number: 6, title: "AD-AS Model", icon: "⚖️", teaser: "Combine demand and supply shocks with fiscal and monetary policy and watch equilibrium move." },
  { number: 7, title: "Inflation", icon: "🔥", teaser: "Demand-pull vs. cost-push inflation, hyperinflation, deflation, and disinflation." },
  { number: 8, title: "Phillips Curve", icon: "📉", teaser: "The short-run vs. long-run trade-off between inflation and unemployment." },
  { number: 9, title: "Unemployment", icon: "👥", teaser: "Frictional, structural, cyclical, and seasonal unemployment, triggered live." },
  { number: 10, title: "Fiscal Policy", icon: "🏛️", teaser: "Government spending, taxes, and the multiplier effect on GDP." },
  { number: 11, title: "Monetary Policy", icon: "🏦", teaser: "Control the central bank: interest rates, reserve requirements, and the money supply." },
  { number: 12, title: "Economic Growth Simulator", icon: "🌍", teaser: "The capstone — manage a whole economy for 50 years and see the consequences of every choice." },
];
