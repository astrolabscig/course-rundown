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
    id: "consumption-savings-functions",
    title: "The consumption & savings functions",
    entries: [
      {
        id: "consumption-function",
        title: "The consumption function: C = a + bY",
        summary: "Consumption rises with income, but not one-for-one — a is autonomous, b is the MPC.",
        eli5:
          "Think of your own spending: even with zero income you'd still spend something (borrowing, past savings, family help) just to survive — that's 'a', autonomous consumption. Then for every extra cedi you earn, you spend a fraction of it and save the rest — 'b' is that fraction, the marginal propensity to consume (MPC). A steeper line (bigger b) means people are big spenders out of extra income; a flatter line means they're savers.",
        code: "C = a + bY\na = autonomous consumption (spent even at zero income)\nb = MPC = marginal propensity to consume, 0 < b < 1\n\nExample: C = 200 + 0.8Y\nAt Y = 1000: C = 200 + 0.8(1000) = 1000",
        points: [
          "a (the intercept) is spending that happens regardless of income; b (the slope) is the MPC — extra spending per extra cedi of income.",
          "MPC = ΔC/ΔY. Because people don't spend every extra cedi, 0 < MPC < 1.",
          "APC (average propensity to consume) = C/Y falls as Y rises, since the fixed 'a' gets spread over more and more income.",
        ],
      },
      {
        id: "savings-function",
        title: "The savings function: S = Y − C",
        summary: "Whatever isn't spent is saved — so the savings function falls straight out of the consumption function.",
        eli5:
          "Savings is just the leftovers. If C = a + bY, then whatever's left of your income once you subtract consumption is your saving: S = Y − C = −a + (1 − b)Y. Notice the −a: at very low income, people don't just save nothing, they actually spend MORE than they earn (dissaving), which is why the savings line starts below zero.",
        code: "S = Y − C = Y − (a + bY) = −a + (1 − b)Y\nMPS = 1 − MPC\nMPC + MPS = 1  (every extra cedi is either spent or saved, nothing else)",
        points: [
          "MPS (marginal propensity to save) = ΔS/ΔY = 1 − MPC, since every extra cedi is either consumed or saved.",
          "The savings function has the same intercept as consumption but negated (−a), and slope (1 − b) = MPS.",
          "At low income the savings line is negative (dissaving) — people spend out of past savings or borrowing to maintain consumption.",
        ],
      },
      {
        id: "other-determinants-of-consumption",
        title: "What shifts the whole line, versus what moves you along it",
        summary: "A change in Y moves you along the C line; a change in wealth, taxes, expectations, or tastes shifts the whole line.",
        eli5:
          "Changing your income moves you to a different point on the SAME consumption line — you're still the same kind of spender, just richer or poorer. But if your house suddenly doubles in value, or you hear a recession is coming, your whole attitude to spending changes at every level of income — that shifts the entire line up or down, not just where you sit on it.",
        points: [
          "A change in income (Y) is a movement ALONG the existing consumption function — it does not change a or b.",
          "A shift of the WHOLE consumption function (a change in 'a') comes from: wealth/asset prices, changes in taxation, expectations about future income or prices, the distribution of income, and changes in tastes/preferences.",
          "Exam trap: don't confuse 'income rises so consumption rises' (movement along the line) with 'consumer confidence rises so people spend more at every income level' (the whole line shifts up).",
        ],
      },
    ],
  },
  {
    id: "withdrawals-injections-functions",
    title: "Withdrawals & injections",
    entries: [
      {
        id: "the-three-withdrawals",
        title: "The three withdrawals: S, T, M",
        summary: "Savings, net taxes, and imports each leak a fraction of extra income out of the domestic spending flow.",
        eli5:
          "Every extra cedi of national income can escape the inner household-firm spending loop three ways: people save some of it, the government taxes some of it away, and some of it gets spent on imported goods (leaving the country entirely). Each escape route has its own 'leak rate' — the marginal propensity to save (mps), to tax (mpt), and to import (mpm).",
        code: "S = −a + (1 − b)Y            mps = 1 − b\nT = T0 + tY                   mpt = t   (t = the tax rate)\nM = M0 + mY                   mpm = m",
        points: [
          "mps (marginal propensity to save) = 1 − MPC — the fraction of extra income saved rather than spent.",
          "mpt (marginal propensity to tax) = t, the tax rate applied to extra income; T0 is any fixed/lump-sum tax component.",
          "mpm (marginal propensity to import) = m — the fraction of extra income spent on imported rather than domestic goods.",
        ],
      },
      {
        id: "the-three-injections",
        title: "The three injections: I, G, X",
        summary: "Investment, government spending, and exports feed money back into the flow — and are treated as autonomous.",
        eli5:
          "Injections are money entering the household-firm loop from outside the normal wage-and-spending cycle: firms investing in new machinery (I), the government buying goods and services (G), and foreigners buying domestic exports (X). In the simple model, none of these depend on domestic income — they're set by other forces entirely, so we treat them as fixed (autonomous) numbers.",
        points: [
          "Investment (I) is driven mainly by interest rates and business confidence/expected profitability, not by current domestic income.",
          "Government spending (G) is set by fiscal policy decisions (the budget), not by domestic income.",
          "Exports (X) depend on foreign incomes and the country's price competitiveness abroad, not on domestic income — which is exactly why all three are modelled as autonomous (a flat line against Y).",
        ],
      },
      {
        id: "mpw-and-the-mpcd-identity",
        title: "mpw = mps + mpt + mpm, and mpcd + mpw = 1",
        summary: "Add up the three leak rates to get the total withdrawal propensity — and it's the mirror image of spending on domestic goods.",
        eli5:
          "Stack the three individual 'leak rates' together and you get mpw, the total fraction of every extra cedi that escapes the domestic flow one way or another. Since every extra cedi you earn either escapes (mpw) or gets spent on domestically-produced goods (mpcd), those two must always add up to exactly 1 — they're two sides of the same coin.",
        code: "mpw = mps + mpt + mpm\nmpcd + mpw = 1   (mpcd = marginal propensity to consume DOMESTIC output)",
        points: [
          "mpw (marginal propensity to withdraw) is the sum of the three individual marginal leak rates: mps + mpt + mpm.",
          "mpcd (consumption of domestic output) differs from plain MPC because MPC includes spending on imports too — mpcd strips that out.",
          "Because every extra cedi is either withdrawn or spent on domestic output, mpcd + mpw = 1 always holds — a useful identity for exam questions that give you one and ask for the other.",
        ],
      },
    ],
  },
  {
    id: "equilibrium-multiplier",
    title: "Equilibrium income & the multiplier",
    entries: [
      {
        id: "equilibrium-condition",
        title: "Equilibrium: W = J, equivalently Y = AE",
        summary: "National income settles where total withdrawals equal total injections — the same point as where output equals total spending.",
        eli5:
          "Picture the circular flow as a bathtub: withdrawals (S+T+M) are water draining out, injections (I+G+X) are water pouring in from a tap. The water level (national income) only stops changing when the drain rate exactly matches the tap rate — W = J. On a graph of spending against income, that's exactly the same point where the total-spending (AE) line crosses the 45° reference line, i.e. where planned spending equals actual output, Y = AE.",
        code: "Equilibrium condition (two equivalent views):\n  W = J           i.e.  S + T + M = I + G + X\n  Y = AE          i.e.  Y = C + I + G + X − M",
        points: [
          "The 45° line is just every point where Y = AE (spending exactly equals output) — it is not the aggregate expenditure line itself, only a reference line.",
          "Equilibrium is where the AE line crosses the 45° line — read straight down to find equilibrium income, Ye.",
          "W = J and Y = AE are two different-looking routes to exactly the same equilibrium income — either can be used to solve the same problem.",
        ],
      },
      {
        id: "the-multiplier",
        title: "The multiplier: k = ΔY / ΔJ = 1 / mpw",
        summary: "A change in autonomous spending causes a bigger final change in income — because each round of new spending becomes someone else's income, part of which gets spent again.",
        eli5:
          "Drop GH₵100 of new investment into the economy and it doesn't stop there. That GH₵100 becomes income for someone (say, a builder), who spends most of it, which becomes income for someone else, who spends most of THAT, and so on — a chain of 'rounds' that keeps adding to national income, shrinking a little each round because some leaks out as savings, tax, and imports at every step. The multiplier, k, tells you the TOTAL final change in income for every GH₵1 of initial injection.",
        code: "k = 1 / mpw = 1 / (mps + mpt + mpm)\nSimple case (no tax or imports): k = 1 / MPS = 1 / (1 − MPC)\n\nΔY = k × ΔJ",
        points: [
          "The bigger the leak rate (mpw), the SMALLER the multiplier — more leaking out at each round means the chain of extra spending dies out faster.",
          "Exam trap: a fall in G, I, or X changes the LEVEL of national income, but does NOT by itself change the SIZE of the multiplier — only a change in mps, mpt, or mpm changes k.",
          "'Cumulative causation': the same multiplier process runs in reverse for a fall in injections (or rise in withdrawals) — a small initial cut in spending can cause a much larger fall in national income.",
        ],
      },
      {
        id: "worked-equilibrium-example",
        title: "Full worked example: C = 200 + 0.8Yd, I = 100, T = 0.2Y",
        summary: "Solve the same equilibrium both ways (W=J and Y=AE) and see they agree — plus the correct multiplier value.",
        eli5:
          "This is the textbook's own numerical example, solved carefully both ways to double-check the answer. Substituting T = 0.2Y into C gives C = 200 + 0.64Y. From there, both the withdrawals-equal-injections route and the income-equals-spending route land on exactly the same equilibrium income, Ye = 833.33.",
        code:
          "Yd = Y − T = Y − 0.2Y = 0.8Y\nC = 200 + 0.8(0.8Y) = 200 + 0.64Y\n\nRoute 1 — Y = AE (no G or X in this example):\n  Y = C + I = 200 + 0.64Y + 100\n  Y − 0.64Y = 300\n  0.36Y = 300  ->  Ye = 833.33\n\nRoute 2 — S = I (T already netted into Yd, so W reduces to S):\n  S = Y − C = Y − 200 − 0.64Y = −200 + 0.36Y\n  Set S = I:  −200 + 0.36Ye = 100  ->  Ye = 833.33  ✓ matches Route 1\n\nMultiplier: k = 1 / 0.36 = 2.78 (not 2.27 — a common arithmetic slip)",
        points: [
          "Both routes must always agree, since W = J and Y = AE describe the same equilibrium point — use whichever is more convenient for the numbers given.",
          "The denominator (0.36 here) is the effective mpw for this example: 1 − MPC×(1 − t) = 1 − 0.8×0.8 = 0.36.",
          "k = 1/0.36 ≈ 2.78, so a further GH₵10bn rise in investment would raise equilibrium income by roughly GH₵27.8bn.",
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
