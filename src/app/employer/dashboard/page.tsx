"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mockExams } from "@/mocks/data";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import React from "react";

// Employer exam card — memoised to avoid re-renders on search
const EmployerExamCard = React.memo(function EmployerExamCard({
  exam,
  onClick,
}: {
  exam: (typeof mockExams)[0];
  onClick: () => void;
}) {
  const totalQuestions = exam.questionSets.reduce(
    (acc, qs) => acc + qs.questions.length,
    0
  );
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors">
      <h3 className="font-bold text-slate-800 text-base mb-4">{exam.title}</h3>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 mb-5">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Candidates: <strong className="text-slate-700">{exam.candidates.length || "Not Set"}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
          Question Set: <strong className="text-slate-700">{exam.questionSets.length || "Not Set"}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
          </svg>
          Exam Slots: <strong className="text-slate-700">{exam.slots || "Not Set"}</strong>
        </span>
      </div>
      <Button
        variant="outline"
        onClick={onClick}
        className="rounded-full border-primary text-primary text-sm font-semibold hover:bg-primary/5 px-5"
      >
        View Candidates
      </Button>
    </div>
  );
});

export default function EmployerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "employer")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const publishedExams = useMemo(
    () => mockExams.filter((e) => e.status === "published"),
    []
  );

  const { query, setQuery, filtered } = useDebouncedSearch(publishedExams);

  const handleCreate = useCallback(() => {
    router.push("/employer/create-exam");
  }, [router]);

  const handleView = useCallback(
    (id: string) => () => router.push(`/employer/exam/${id}`),
    [router]
  );

  if (isLoading || !isAuthenticated || user?.role !== "employer") return null;

  return (
    <div className="w-full flex-1">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-slate-800 shrink-0">Online Tests</h2>

          <div className="relative flex-1 max-w-xl">
            <Input
              placeholder="Search by exam title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-full bg-white border-primary/30 pr-12 h-10 focus-visible:ring-primary/30"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-full text-primary">
              <Search className="w-4 h-4" />
            </div>
          </div>

          <Button
            onClick={handleCreate}
            className="rounded-lg bg-primary text-white font-semibold px-5 hover:bg-primary/90 shrink-0"
          >
            Create Online Test
          </Button>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16">
            <EmptyState
              title="No Online Test Available"
              description="Currently, there are no online tests available. Please check back later for updates."
              icon={
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#EEF2FF" />
                  <rect x="22" y="30" width="36" height="28" rx="3" fill="#6366F1" opacity=".2" />
                  <rect x="22" y="30" width="36" height="28" rx="3" stroke="#6366F1" strokeWidth="2" />
                  <path d="M30 30V24a10 10 0 0 1 20 0v6" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="40" cy="46" r="5" fill="#6633FF" />
                  <path d="M40 48v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="40" cy="43.5" r=".75" fill="white" />
                </svg>
              }
            />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((exam) => (
              <EmployerExamCard
                key={exam.id}
                exam={exam}
                onClick={handleView(exam.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
