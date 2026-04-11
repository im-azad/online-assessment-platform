"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EmployerDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "employer")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  if (isLoading || !isAuthenticated || user?.role !== "employer") {
    return null;
  }

  const exams = [
    {
      id: "exam-1",
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics",
      candidates: 12,
      slots: 50,
      status: "published" as const,
    },
    {
      id: "exam-2",
      title: "React & Next.js Assessment",
      description: "Advanced React and Next.js concepts",
      candidates: 0,
      slots: 30,
      status: "draft" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Exams</h2>
          <Button onClick={() => router.push("/employer/create-exam")}>
            Create New Exam
          </Button>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No exams created yet</p>
            <Button onClick={() => router.push("/employer/create-exam")}>
              Create Your First Exam
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/employer/exam/${exam.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{exam.title}</h3>
                  <Badge
                    variant={exam.status === "published" ? "success" : "secondary"}
                  >
                    {exam.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {exam.description}
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{exam.candidates} candidates</span>
                  <span>{exam.slots} slots</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
