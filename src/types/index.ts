export interface User {
  id: string;
  email: string;
  name: string;
  role: "employer" | "candidate";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  type: "single" | "multiple";
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  employerId: string;
  questionSets: QuestionSet[];
  slots: number;
  candidates: string[];
  status: "draft" | "published" | "closed";
  createdAt: string;
  duration: number;
}

export interface ExamAttempt {
  examId: string;
  candidateId: string;
  answers: Record<string, number | number[]>;
  startedAt: string;
  submittedAt?: string;
  status: "in_progress" | "submitted" | "auto_submitted";
  tabSwitches: number;
  fullscreenExits: number;
}

export interface CandidateExam extends Exam {
  attempt?: ExamAttempt;
}
