import { z } from "zod";

export const createExamSchema = z.object({
  title: z.string().min(1, "Online Test Title is required"),
  totalCandidates: z.coerce.number().min(1, "Required"),
  totalSlots: z.string().min(1, "Select total slots"),
  totalQuestionSet: z.string().min(1, "Select total question set"),
  questionType: z.string().min(1, "Select question type"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  duration: z.string().optional(),
});

export type CreateExamFormData = z.infer<typeof createExamSchema>;

export const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  type: z.enum(["radio", "checkbox", "text"]),
  score: z.coerce.number().min(1).default(1),
  options: z
    .array(
      z.object({
        label: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
