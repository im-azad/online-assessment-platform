export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  EMPLOYER_DASHBOARD: "/employer/dashboard",
  EMPLOYER_CREATE_EXAM: "/employer/create-exam",
  CANDIDATE_DASHBOARD: "/candidate/dashboard",
  CANDIDATE_EXAM: "/candidate/exam",
} as const;

export const QUERY_KEYS = {
  AUTH: ["auth"],
  EXAMS: ["exams"],
  EXAM: ["exam"],
  CANDIDATES: ["candidates"],
} as const;

export const STORAGE_KEYS = {
  AUTH: "auth",
  EXAM_ANSWERS: "exam_answers",
  EXAM_ATTEMPT: "exam_attempt",
} as const;
