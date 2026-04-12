"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ExamCard } from "@/components/ui/exam-card";
import { mockExams } from "@/mocks/data";

export default function CandidateDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "candidate")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleStartExam = (examId: string) => {
    router.push(`/candidate/exam/${examId}`);
  };

  const filteredExams = mockExams.filter(
    (exam) => 
      exam.status === "published" && 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex-1">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">Online Tests</h2>

          <div className="relative w-80">
            <Input
              placeholder="Search by exam title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full bg-white border-slate-200 pr-12 h-10 focus-visible:ring-primary/30"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-full text-primary">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Exam grid */}
        {filteredExams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No exams available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onStart={handleStartExam}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
