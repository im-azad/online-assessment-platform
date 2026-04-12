import { Exam } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, FileText, MinusCircle } from "lucide-react";

interface ExamCardProps {
  exam: Exam;
  onStart: (examId: string) => void;
}

export function ExamCard({ exam, onStart }: ExamCardProps) {
  const totalQuestions = exam.questionSets.reduce((acc, qs) => acc + qs.questions.length, 0);

  return (
    <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors bg-white">
      <div>
        <h3 className="font-bold text-lg text-slate-800 mb-6">{exam.title}</h3>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-slate-600 mb-6 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Duration: {exam.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Questions: {totalQuestions}</span>
          </div>
          {exam.negativeMarking !== undefined && (
            <div className="flex items-center gap-2 text-rose-500">
              <MinusCircle className="w-4 h-4" />
              <span>Negative Mark: -{exam.negativeMarking}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <Button 
          variant="outline" 
          onClick={() => onStart(exam.id)}
          className="rounded-full px-8 text-primary border-primary hover:bg-primary/5 font-semibold"
        >
          Start
        </Button>
      </div>
    </Card>
  );
}
