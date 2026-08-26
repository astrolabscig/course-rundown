export type CommSkillsSource = "past-question" | "lecture-material";

export type CommSkillsTopic =
  | "communication-fundamentals"
  | "organizational-communication"
  | "writing-process"
  | "cv-writing"
  | "letter-writing"
  | "memorandum"
  | "report-writing"
  | "meetings-minutes"
  | "oral-communication";

export interface CommSkillsQuestion {
  id: string;
  source: CommSkillsSource;
  sourceLabel: string;
  topic: CommSkillsTopic;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  warning?: string;
}

export const commSkillsTopics: { id: CommSkillsTopic; label: string }[] = [
  { id: "communication-fundamentals", label: "Communication Fundamentals" },
  { id: "organizational-communication", label: "Organizational Communication" },
  { id: "writing-process", label: "Writing as a Process" },
  { id: "cv-writing", label: "CV Writing" },
  { id: "letter-writing", label: "Formal Letters" },
  { id: "memorandum", label: "Memorandum" },
  { id: "report-writing", label: "Report Writing" },
  { id: "meetings-minutes", label: "Meetings & Minutes" },
  { id: "oral-communication", label: "Oral Communication" },
];
