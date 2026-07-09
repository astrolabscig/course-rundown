import type { BasicsGroup } from "@/lib/basics";

export const statisticsFundamentalsGroups: BasicsGroup[] = [
  {
    id: "what-is-statistics",
    title: "What statistics actually is",
    entries: [
      {
        id: "statistics-definition",
        title: "Statistics is the science of learning from data",
        summary: "Developing and studying methods for collecting, organizing, analyzing, interpreting, and presenting data.",
        eli5:
          "Imagine you're handed a spreadsheet with 10,000 rows and asked 'so, what's going on here?' Statistics is the entire toolkit for turning that overwhelming pile of numbers into a few honest, useful sentences — without lying to yourself (or anyone else) about what the data can and can't tell you.",
        points: [
          "Statistics = the science concerned with collecting, organizing, analyzing, interpreting, and presenting data.",
          "Two branches: descriptive statistics (summarizing what you actually observed) and inferential statistics (using a sample to draw conclusions about a larger population you didn't fully observe).",
          "Common software: SPSS, SAS, Stata, MINITAB, MATLAB, R, GENSTAT, Excel.",
        ],
      },
      {
        id: "descriptive-vs-inferential",
        title: "Descriptive vs. inferential statistics",
        summary: "Descriptive statistics describes the data you have; inferential statistics reasons beyond it.",
        eli5:
          "Descriptive statistics is like reporting the final score of a match you actually watched. Inferential statistics is like watching the first 10 minutes and predicting who wins the whole season — same sport, very different level of certainty, and a very different toolbox.",
        points: [
          "Descriptive statistics: organizes, summarizes, and describes data using numerical and graphical summaries of the sample you actually have.",
          "Inferential statistics: uses sample data to draw conclusions about a broader population than just the individuals observed.",
          "Everything in this room (frequency tables, mean/median/mode, dispersion, position, shape) is descriptive statistics — the foundation everything else is built on.",
        ],
      },
    ],
  },
  {
    id: "ivppss",
    title: "IVPPSS: the six terms every statistical analysis starts with",
    entries: [
      {
        id: "ivppss-framework",
        title: "Individual, Variable, Population, Parameter, Sample, Statistic",
        summary: "Six terms that must be explicitly identified at the start of any proper statistical analysis.",
        eli5:
          "Before you can trust ANY statistic you read in the news ('73% of X!'), you should be able to answer six questions: 73% of WHAT exact thing (individual)? measuring WHAT trait (variable)? out of WHO, really, all of them or just some (population vs. sample)? and is that 73% describing everyone or just the ones who were actually asked (parameter vs. statistic)? If you can't answer all six, you can't yet trust the number.",
        code: "Individual   = one item examined (not necessarily a person)\nVariable     = the characteristic recorded about each individual\nPopulation   = the collection of ALL individuals of interest\nParameter    = a summary number computed from the population\nSample       = a subset of the population actually examined\nStatistic    = a summary number computed from the sample",
        points: [
          "Worked example (oak tree DBH): Individual = an oak tree. Variable = diameter-breast-height (DBH). Population = all oak trees on the property. Parameter = mean DBH of ALL oak trees. Sample = the 75 oak trees actually measured. Statistic = mean DBH of those 75 oak trees.",
          "The statistic must be the SAME kind of summary of the sample as the parameter is of the population (e.g. both means, or both proportions) — you can't compute a parameter as a mean and a statistic as a median and compare them.",
          "This exact framework reappears every time you're handed a real-world statistic — always ask which of the six roles each number is playing.",
        ],
      },
    ],
  },
];
