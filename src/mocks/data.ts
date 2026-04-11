import type { Exam, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "emp-1",
    email: "employer@example.com",
    name: "John Employer",
    role: "employer",
  },
  {
    id: "cand-1",
    email: "candidate@example.com",
    name: "Jane Candidate",
    role: "candidate",
  },
];

export const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    employerId: "emp-1",
    duration: 30,
    slots: 50,
    candidates: ["cand-1"],
    status: "published",
    createdAt: "2024-01-15T10:00:00Z",
    questionSets: [
      {
        id: "qs-1",
        title: "JavaScript Basics",
        description: "Basic JavaScript questions",
        timeLimit: 15,
        questions: [
          {
            id: "q1",
            text: "What is the output of console.log(typeof null)?",
            options: ["null", "undefined", "object", "error"],
            correctAnswer: 2,
            type: "single",
          },
          {
            id: "q2",
            text: "Which keyword declares a block-scoped variable?",
            options: ["var", "let", "const", "function"],
            correctAnswer: 1,
            type: "single",
          },
          {
            id: "q3",
            text: "What is the result of 2 + '2'?",
            options: ["4", "22", "NaN", "Error"],
            correctAnswer: 1,
            type: "single",
          },
        ],
      },
    ],
  },
  {
    id: "exam-2",
    title: "React & Next.js Assessment",
    description: "Advanced React and Next.js concepts",
    employerId: "emp-1",
    duration: 45,
    slots: 30,
    candidates: [],
    status: "draft",
    createdAt: "2024-01-20T14:30:00Z",
    questionSets: [
      {
        id: "qs-2",
        title: "React Fundamentals",
        description: "Core React concepts",
        timeLimit: 20,
        questions: [
          {
            id: "q4",
            text: "What hook is used for state management?",
            options: ["useEffect", "useState", "useContext", "useReducer"],
            correctAnswer: 1,
            type: "single",
          },
          {
            id: "q5",
            text: "What is Next.js App Router?",
            options: [
              "A database",
              "A file-based routing system",
              "A CSS framework",
              "A testing library",
            ],
            correctAnswer: 1,
            type: "single",
          },
        ],
      },
    ],
  },
];

export const sampleQuestions = [
  {
    id: "q-sample-1",
    text: "Sample question 1?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
    type: "single" as const,
  },
  {
    id: "q-sample-2",
    text: "Sample question 2?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 1,
    type: "single" as const,
  },
];
