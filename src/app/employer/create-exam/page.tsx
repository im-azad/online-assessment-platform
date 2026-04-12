"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/store/hooks";
import { StepIndicator } from "@/components/ui/step-indicator";
import { QuestionModal, type QuestionData } from "@/components/ui/question-modal";
import { createExamSchema, type CreateExamFormData } from "@/lib/validations/exam";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils";

/* ─── Question row in the list (Image 5) ─── */
const QuestionRow = memo(function QuestionRow({
  q,
  index,
  onEdit,
  onRemove,
}: {
  q: QuestionData;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const typeLabel = q.type === "radio" ? "MCQ" : q.type === "checkbox" ? "Checkbox" : "Text";

  return (
    <div className="border-b border-slate-100 pb-6 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">Question {index}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs border border-slate-200 rounded px-2 py-0.5 text-slate-500">{typeLabel}</span>
          <span className="text-xs border border-slate-200 rounded px-2 py-0.5 text-slate-500">{q.score} pt</span>
        </div>
      </div>

      <p
        className="text-sm text-slate-700 mb-3"
        dangerouslySetInnerHTML={{ __html: q.text || "<em>No question text</em>" }}
      />

      {q.type !== "text" && (
        <div className="space-y-1 mb-3">
          {q.options.map((opt, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 text-sm px-3 py-2 rounded-lg",
                opt.isCorrect ? "bg-slate-100" : ""
              )}
            >
              <span className="text-slate-600">{opt.label}.</span>
              <span
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: opt.text || `Option ${opt.label}` }}
              />
              {opt.isCorrect && (
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-1">
        <button type="button" onClick={onEdit} className="text-sm text-primary font-medium hover:underline">Edit</button>
        <button type="button" onClick={onRemove} className="text-sm text-rose-500 font-medium hover:underline">Remove From Exam</button>
      </div>
    </div>
  );
});

/* ─── Select field ─── */
function SelectField({ id, label, placeholder, options, required, ...rest }: {
  id: string; label: string; placeholder: string;
  options: string[]; required?: boolean;
  [key: string]: unknown;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm text-slate-600">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <select
          id={id}
          defaultValue=""
          className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary/30"
          {...(rest as Record<string, unknown>)}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function CreateExamPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((s) => s.auth);
  const [step, setStep] = useState(0); // 0 = Basic Info, 1 = Questions
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "employer")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const form = useForm<CreateExamFormData>({
    resolver: zodResolver(createExamSchema),
    defaultValues: { title: "", totalCandidates: 0, totalSlots: "", totalQuestionSet: "", questionType: "", startTime: "", endTime: "", duration: "" },
  });

  const steps = [
    { label: "Basic Info", completed: step > 0, active: step === 0 },
    { label: "Questions Sets", completed: false, active: step === 1 },
  ];

  const handleSaveBasicInfo = form.handleSubmit(() => setStep(1));

  const addQuestion = useCallback((q: QuestionData) => {
    if (editIndex !== null) {
      setQuestions((prev) => prev.map((old, i) => (i === editIndex ? q : old)));
      setEditIndex(null);
    } else {
      setQuestions((prev) => [...prev, q]);
    }
    setModalOpen(false);
  }, [editIndex]);

  const saveAndAdd = useCallback((q: QuestionData) => {
    setQuestions((prev) => (editIndex !== null
      ? prev.map((old, i) => (i === editIndex ? q : old))
      : [...prev, q]));
    setEditIndex(null);
    // keep modal open for next question
  }, [editIndex]);

  const removeQuestion = useCallback((i: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const openEdit = useCallback((i: number) => {
    setEditIndex(i);
    setModalOpen(true);
  }, []);

  const openAdd = useCallback(() => {
    setEditIndex(null);
    setModalOpen(true);
  }, []);

  const handleFinish = () => {
    toast.success("Exam created successfully!");
    router.push("/employer/dashboard");
  };

  if (isLoading || !isAuthenticated || user?.role !== "employer") return null;

  return (
    <div className="w-full flex-1">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Manage card with StepIndicator */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-800">Manage Online Test</h2>
            <StepIndicator steps={steps} />
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/employer/dashboard")}
            className="rounded-lg text-sm border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-6">
            <h3 className="font-bold text-slate-800 mb-5">Basic Information</h3>
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm text-slate-600">
                  Online Test Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter online test title"
                  className="border-slate-200 focus-visible:ring-primary/30"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-rose-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              {/* Candidates + Slots */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="totalCandidates" className="text-sm text-slate-600">
                    Total Candidates <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="totalCandidates"
                    type="number"
                    placeholder="Enter total candidates"
                    className="border-slate-200 focus-visible:ring-primary/30"
                    {...form.register("totalCandidates")}
                  />
                </div>
                <SelectField
                  id="totalSlots"
                  label="Total Slots"
                  placeholder="Select total shots"
                  options={["10", "20", "30", "50", "100"]}
                  required
                />
              </div>

              {/* Question Set + Type */}
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  id="totalQuestionSet"
                  label="Total Question Set"
                  placeholder="Select total question set"
                  options={["1", "2", "3", "4", "5"]}
                  required
                />
                <SelectField
                  id="questionType"
                  label="Question Type"
                  placeholder="Select question type"
                  options={["MCQ", "Checkbox", "Text", "Mixed"]}
                  required
                />
              </div>

              {/* Start + End + Duration */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="startTime" className="text-sm text-slate-600">
                    Start Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    className="border-slate-200 focus-visible:ring-primary/30"
                    {...form.register("startTime")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="endTime" className="text-sm text-slate-600">
                    End Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    className="border-slate-200 focus-visible:ring-primary/30"
                    {...form.register("endTime")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="duration" className="text-sm text-slate-600">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="Duration Time"
                    className="border-slate-200 focus-visible:ring-primary/30"
                    {...form.register("duration")}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/employer/dashboard")}
                className="rounded-lg border-slate-200 text-slate-600 px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveBasicInfo}
                className="rounded-lg bg-primary text-white px-8 hover:bg-primary/90"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Questions */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-6">
            {questions.length > 0 && (
              <div className="space-y-6 mb-6">
                {questions.map((q, i) => (
                  <QuestionRow
                    key={i}
                    q={q}
                    index={i + 1}
                    onEdit={() => openEdit(i)}
                    onRemove={() => removeQuestion(i)}
                  />
                ))}
              </div>
            )}

            <Button
              type="button"
              onClick={questions.length === 0 ? openAdd : handleFinish}
              className="w-full rounded-xl bg-primary text-white py-6 text-base font-semibold hover:bg-primary/90"
            >
              {questions.length === 0 ? "Add Question" : "Add Question"}
            </Button>

            {questions.length > 0 && (
              <Button
                type="button"
                onClick={handleFinish}
                className="w-full mt-3 rounded-xl bg-green-600 text-white py-4 font-semibold hover:bg-green-700"
              >
                Finish & Save Exam
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Question Modal */}
      <QuestionModal
        open={modalOpen}
        index={editIndex !== null ? editIndex + 1 : questions.length + 1}
        initial={editIndex !== null ? questions[editIndex] : undefined}
        onSave={addQuestion}
        onSaveAndAdd={saveAndAdd}
        onClose={() => { setModalOpen(false); setEditIndex(null); }}
      />
    </div>
  );
}
