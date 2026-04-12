"use client";

import { Check } from "lucide-react";
import { cn } from "@/utils";

export interface Step {
  label: string;
  completed: boolean;
  active: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          {/* Circle */}
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
              step.completed
                ? "bg-primary text-white"
                : step.active
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-slate-500"
            )}
          >
            {step.completed ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>

          {/* Label */}
          <span
            className={cn(
              "ml-2 text-sm font-medium",
              step.completed || step.active ? "text-primary" : "text-slate-400"
            )}
          >
            {step.label}
          </span>

          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-3 h-px w-16",
                steps[i + 1].completed || steps[i + 1].active
                  ? "bg-primary"
                  : "bg-slate-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
