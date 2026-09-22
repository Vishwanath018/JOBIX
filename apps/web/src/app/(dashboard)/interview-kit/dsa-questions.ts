import rawQuestions from "./dsa-questions.json";

export type DsaDifficulty = "Easy" | "Medium" | "Hard";

export type DsaExample = {
  input: string;
  output: string;
};

export type DsaQuestion = {
  id: string;
  title: string;
  difficulty: DsaDifficulty;
  topic: string;
  frequency: number;
  tags: string[];
  description: string;
  examples: DsaExample[];
  leetcodeUrl: string;
  companies: string[];
};

export const dsaQuestions = rawQuestions as DsaQuestion[];

export const dsaTopics = [
  "All",
  "Array",
  "String",
  "Linked List",
  "Stack",
  "Queue",
  "Binary Search",
  "Tree",
  "Trie",
  "Graph",
  "Dynamic Programming",
  "Heap",
  "Backtracking",
  "Sliding Window",
  "Two Pointers",
  "Greedy",
  "Intervals",
  "Bit Manipulation",
  "Matrix",
  "Math",
  "Other",
] as const;

export const getDsaQuestion = (id: string) =>
  dsaQuestions.find((question) => question.id === id);
