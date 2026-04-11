"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { Plus, Trash2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  slots: z.coerce.number().min(1, "At least 1 slot required"),
});

type ExamFormData = z.infer<typeof examSchema>;

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateExamPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "employer")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 30,
      slots: 10,
    },
  });

  const steps = [
    { id: 0, name: "Basic Info", fields: ["title", "description", "duration", "slots"] },
    { id: 1, name: "Questions", fields: [] },
  ];

  const handleAddQuestion = () => {
    if (!newQuestion.text || newQuestion.options?.some((o) => !o)) {
      toast.error("Please fill in all question fields");
      return;
    }

    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        text: newQuestion.text!,
        options: newQuestion.options as string[],
        correctAnswer: newQuestion.correctAnswer || 0,
      },
    ]);

    setNewQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
    setIsDialogOpen(false);
    toast.success("Question added successfully");
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmit = () => {
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    toast.success("Exam created successfully!");
    router.push("/employer/dashboard");
  };

  const canProceed = () => {
    if (currentStep === 0) {
      const { title, description, duration, slots } = form.getValues();
      return title && description && duration > 0 && slots > 0;
    }
    return true;
  };

  if (isLoading || !isAuthenticated || user?.role !== "employer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create New Exam</h1>
          <Button variant="outline" onClick={() => router.push("/employer/dashboard")}>
            Cancel
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{step.name}</span>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px bg-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].name}</CardTitle>
            <CardDescription>
              {currentStep === 0
                ? "Enter the basic information about your exam"
                : "Add questions to your exam"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="e.g., JavaScript Fundamentals"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Describe what this exam covers"
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      {...form.register("duration")}
                    />
                    {form.formState.errors.duration && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.duration.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slots">Total Slots</Label>
                    <Input
                      id="slots"
                      type="number"
                      min="1"
                      {...form.register("slots")}
                    />
                    {form.formState.errors.slots && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.slots.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {questions.length} question{questions.length !== 1 ? "s" : ""} added
                  </span>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Question</DialogTitle>
                        <DialogDescription>
                          Enter the question details and answer options
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Question Text</Label>
                          <Textarea
                            value={newQuestion.text}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                text: e.target.value,
                              })
                            }
                            placeholder="Enter your question"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          {newQuestion.options?.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={newQuestion.correctAnswer === index}
                                onChange={() =>
                                  setNewQuestion({
                                    ...newQuestion,
                                    correctAnswer: index,
                                  })
                                }
                                className="w-4 h-4"
                              />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [
                                    ...(newQuestion.options || []),
                                  ];
                                  newOptions[index] = e.target.value;
                                  setNewQuestion({
                                    ...newQuestion,
                                    options: newOptions,
                                  });
                                }}
                                placeholder={`Option ${index + 1}`}
                              />
                            </div>
                          ))}
                          <p className="text-xs text-muted-foreground">
                            Select the radio button for the correct answer
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddQuestion}>Add Question</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No questions added yet. Click &quot;Add Question&quot; to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="p-4 border rounded-lg relative"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveQuestion(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0">
                            Q{index + 1}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium mb-2">
                              {question.text}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm p-2 rounded ${
                                    optIndex === question.correctAnswer
                                      ? "bg-green-100 dark:bg-green-900"
                                      : "bg-muted"
                                  }`}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Create Exam</Button>
          )}
        </div>
      </main>
    </div>
  );
}
