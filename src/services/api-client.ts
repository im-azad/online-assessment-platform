import type { Exam, User, ExamAttempt } from "@/types";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

class ApiClient {
  private baseUrl = "/api";

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
  }

  async getExams(): Promise<ApiResponse<Exam[]>> {
    return this.request("/exams");
  }

  async getExam(id: string): Promise<ApiResponse<Exam>> {
    return this.request(`/exams/${id}`);
  }

  async createExam(exam: Omit<Exam, "id" | "createdAt">): Promise<ApiResponse<Exam>> {
    return this.request("/exams", {
      method: "POST",
      body: JSON.stringify(exam),
    });
  }

  async updateExam(id: string, exam: Partial<Exam>): Promise<ApiResponse<Exam>> {
    return this.request(`/exams/${id}`, {
      method: "PUT",
      body: JSON.stringify(exam),
    });
  }

  async submitExam(attempt: ExamAttempt): Promise<ApiResponse<{ success: boolean }>> {
    return this.request("/exam/submit", {
      method: "POST",
      body: JSON.stringify(attempt),
    });
  }
}

export const apiClient = new ApiClient();
