import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { QUERY_KEYS } from "@/constants";
import type { LoginCredentials, Exam, ExamAttempt } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, logout as logoutAction } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.login(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      if (data.user.role === "employer") {
        router.push("/employer/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.logout();
    },
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
}

export function useExams() {
  return useQuery({
    queryKey: QUERY_KEYS.EXAMS,
    queryFn: async () => {
      const response = await apiClient.getExams();
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.EXAM, id],
    queryFn: async () => {
      const response = await apiClient.getExam(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exam: Omit<Exam, "id" | "createdAt">) => {
      const response = await apiClient.createExam(exam);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, exam }: { id: string; exam: Partial<Exam> }) => {
      const response = await apiClient.updateExam(id, exam);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS });
    },
  });
}

export function useSubmitExam() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (attempt: ExamAttempt) => {
      const response = await apiClient.submitExam(attempt);
      return response.data;
    },
  });
}
