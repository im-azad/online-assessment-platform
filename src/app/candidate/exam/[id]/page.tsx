"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setAnswer, clearAnswers } from "@/store/slices/examSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { ConfirmDialog } from "@/components/ui/empty-state";
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { toast } from "sonner";

export default function ExamScreen() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const { answers } = useAppSelector((state) => state.exam);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const mockExam = {
    id: examId,
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    duration: 30,
    questions: [
      {
        id: "q1",
        text: "What is the output of console.log(typeof null)?",
        options: ["null", "undefined", "object", "error"],
      },
      {
        id: "q2",
        text: "Which keyword declares a block-scoped variable?",
        options: ["var", "let", "const", "function"],
      },
      {
        id: "q3",
        text: "What is the result of 2 + '2'?",
        options: ["4", "22", "NaN", "Error"],
      },
      {
        id: "q4",
        text: "What hook is used for state management?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
      },
      {
        id: "q5",
        text: "What is the result of Boolean('false')?",
        options: ["true", "false", "undefined", "Error"],
      },
    ],
  };

  const handleTimeUp = useCallback(() => {
    toast.error("Time's up! Your exam has been auto-submitted.", {
      description: "Redirecting to dashboard...",
    });
    setTimeout(() => router.push("/candidate/dashboard"), 3000);
  }, [router]);

  const { formattedTime, start } = useExamTimer({
    examId,
    duration: mockExam.duration,
    onTimeUp: handleTimeUp,
  });

  const { getCounts, tabSwitchCount, fullscreenExitCount } = useBehaviorTracking({
    onSuspiciousActivity: (type) => {
      if (type === "tab_switch") {
        toast.warning("Warning: Tab switch detected!", {
          description: "This activity is being recorded",
        });
      } else if (type === "fullscreen_exit") {
        toast.warning("Warning: Fullscreen mode exited!", {
          description: "Please return to fullscreen mode",
        });
      }
    },
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "candidate")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    start();
    dispatch(clearAnswers());
    return () => {
      dispatch(clearAnswers());
    };
  }, [dispatch, start]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    dispatch(setAnswer({ questionId, answer: answerIndex }));
  };

  const handleSubmit = () => {
    const counts = getCounts();
    toast.success("Exam submitted successfully!", {
      description: `Tab switches: ${counts.tabSwitches}, Fullscreen exits: ${counts.fullscreenExits}`,
    });
    router.push("/candidate/dashboard");
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < mockExam.questions.length) {
      setCurrentQuestion(index);
    }
  };

  if (isLoading || !isAuthenticated || user?.role !== "candidate") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold">{mockExam.title}</h1>
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              {formattedTime}
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSubmitDialogOpen(true)}
          >
            Submit Exam
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1} of {mockExam.questions.length}
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Flag className="w-4 h-4 mr-1" />
                    Flag for review
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-medium">
                  {mockExam.questions[currentQuestion].text}
                </p>
                <div className="space-y-3">
                  {mockExam.questions[currentQuestion].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswerChange(
                            mockExam.questions[currentQuestion].id,
                            index
                          )
                        }
                        className={`w-full p-4 text-left rounded-lg border transition-colors ${
                          answers[mockExam.questions[currentQuestion].id] === index
                            ? "border-primary bg-primary/10"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => goToQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} / {mockExam.questions.length}
              </span>
              <Button
                variant="outline"
                onClick={() => goToQuestion(currentQuestion + 1)}
                disabled={currentQuestion === mockExam.questions.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {mockExam.questions.map((q, index) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                        currentQuestion === index
                          ? "bg-primary text-primary-foreground"
                          : answers[q.id] !== undefined
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <span>Not Answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Proctoring Info
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Tab switches: {tabSwitchCount}</p>
                <p>Fullscreen exits: {fullscreenExitCount}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        title="Submit Exam?"
        description={`You have answered ${Object.keys(answers).length} out of ${mockExam.questions.length} questions. Are you sure you want to submit?`}
        confirmLabel="Submit"
        onConfirm={handleSubmit}
      />
    </div>
  );
}
