import { http, HttpResponse, delay } from "msw";
import { mockUsers, mockExams } from "./data";
import type { User } from "@/types";

let exams = [...mockExams];
let attempts: Record<string, any>[] = [];

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    await delay(500);
    const body = await request.json() as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);
    
    if (!user) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      data: {
        user,
        token: `mock-token-${user.id}`,
      },
      message: "Login successful",
    });
  }),

  http.post("/api/auth/logout", async () => {
    await delay(200);
    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  http.get("/api/auth/me", async ({ request }) => {
    await delay(300);
    const token = request.headers.get("Authorization");
    
    if (!token) {
      return HttpResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.replace("Bearer mock-token-", "");
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: user });
  }),
];

export const examHandlers = [
  http.get("/api/exams", async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const employerId = url.searchParams.get("employerId");
    const candidateId = url.searchParams.get("candidateId");

    let filteredExams = exams;

    if (employerId) {
      filteredExams = exams.filter((e) => e.employerId === employerId);
    }

    if (candidateId) {
      filteredExams = exams.filter((e) => 
        e.status === "published" && 
        (e.candidates.length === 0 || e.candidates.includes(candidateId))
      );
    }

    return HttpResponse.json({ data: filteredExams });
  }),

  http.get("/api/exams/:id", async ({ params }) => {
    await delay(300);
    const exam = exams.find((e) => e.id === params.id);

    if (!exam) {
      return HttpResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: exam });
  }),

  http.post("/api/exams", async ({ request }) => {
    await delay(500);
    const body = await request.json() as any;
    
    const newExam = {
      ...body,
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    exams.push(newExam);

    return HttpResponse.json({ data: newExam }, { status: 201 });
  }),

  http.put("/api/exams/:id", async ({ params, request }) => {
    await delay(400);
    const body = await request.json() as Partial<any>;
    const index = exams.findIndex((e) => e.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    exams[index] = { ...exams[index], ...body };

    return HttpResponse.json({ data: exams[index] });
  }),

  http.delete("/api/exams/:id", async ({ params }) => {
    await delay(300);
    const index = exams.findIndex((e) => e.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    exams.splice(index, 1);

    return HttpResponse.json({ message: "Exam deleted" });
  }),
];

export const examAttemptHandlers = [
  http.post("/api/exam/submit", async ({ request }) => {
    await delay(500);
    const body = await request.json() as any;
    
    attempts.push({
      ...body,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    });

    return HttpResponse.json({
      data: { success: true },
      message: "Exam submitted successfully",
    });
  }),

  http.get("/api/exam/attempts/:candidateId", async ({ params }) => {
    await delay(300);
    const candidateAttempts = attempts.filter(
      (a) => a.candidateId === params.candidateId
    );

    return HttpResponse.json({ data: candidateAttempts });
  }),
];
