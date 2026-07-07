export interface CurriculumPart {
  id: string;
  number: string;
  title: string;
}

export const curriculum: CurriculumPart[] = [
  { id: "part-0", number: "0", title: "C++ Basics Cheatsheet" },
  { id: "part-1", number: "1", title: "Functions" },
  { id: "part-2", number: "2", title: "Classes & Objects" },
  { id: "part-3", number: "3", title: "Encapsulation" },
  { id: "part-4", number: "4", title: "Abstraction" },
  { id: "part-5", number: "5", title: "Inheritance" },
  { id: "part-6", number: "6", title: "Polymorphism" },
  { id: "part-7", number: "7", title: "Speed Tables" },
  { id: "part-8", number: "8", title: "MCQ Drill Bank" },
  { id: "part-9", number: "9", title: "Output-Prediction Drill" },
  { id: "part-10", number: "10", title: "Passco Cheatsheet" },
  { id: "feedback", number: "", title: "Feedback" },
];
