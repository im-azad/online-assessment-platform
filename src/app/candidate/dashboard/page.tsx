"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Play } from "lucide-react";
import { toast } from "sonner";

export default function CandidateDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "candidate")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  const exams = [
    {
      id: "exam-1",
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics including variables, functions, and control flow.",
      duration: 30,
      questions: 15,
      status: "available" as const,
    },
  ];

  const handleStartExam = (examId: string) => {
    toast.success("Starting exam...", {
      description: "You will be redirected to the exam screen",
    });
    router.push(`/candidate/exam/${examId}`);
  };

  if (isLoading || !isAuthenticated || user?.role !== "candidate") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Candidate Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Available Exams</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete the following exams to demonstrate your skills
          </p>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No exams available at the moment</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{exam.title}</h3>
                  <Badge variant="default">{exam.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {exam.description}
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exam.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {exam.questions} questions
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleStartExam(exam.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Exam
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
