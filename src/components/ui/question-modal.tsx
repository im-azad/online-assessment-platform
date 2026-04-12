"use client";

import { useState, useCallback, memo } from "react";
import { RichTextEditor } from "./rich-text-editor";
import { Button } from "./button";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/utils";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

export interface QuestionOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionData {
  id?: string;
  text: string;
  type: "radio" | "checkbox" | "text";
  score: number;
  options: QuestionOption[];
}

interface QuestionModalProps {
  open: boolean;
  index: number;
  initial?: QuestionData;
  onSave: (q: QuestionData) => void;
  onSaveAndAdd: (q: QuestionData) => void;
  onClose: () => void;
}

function buildDefault(): QuestionData {
  return {
    text: "",
    type: "radio",
    score: 1,
    options: [
      { label: "A", text: "", isCorrect: false },
      { label: "B", text: "", isCorrect: false },
      { label: "C", text: "", isCorrect: false },
    ],
  };
}

export const QuestionModal = memo(function QuestionModal({
  open,
  index,
  initial,
  onSave,
  onSaveAndAdd,
  onClose,
}: QuestionModalProps) {
  const [data, setData] = useState<QuestionData>(initial ?? buildDefault());

  if (!open) return null;

  const setType = (type: QuestionData["type"]) =>
    setData((d) => ({ ...d, type }));

  const setScore = (score: number) => setData((d) => ({ ...d, score }));

  const setQuestionText = (text: string) => setData((d) => ({ ...d, text }));

  const setOptionText = (i: number, text: string) =>
    setData((d) => {
      const options = [...d.options];
      options[i] = { ...options[i], text };
      return { ...d, options };
    });

  const toggleCorrect = (i: number) =>
    setData((d) => {
      const options = d.options.map((o, idx) => ({
        ...o,
        isCorrect: d.type === "radio" ? idx === i : idx === i ? !o.isCorrect : o.isCorrect,
      }));
      return { ...d, options };
    });

  const addOption = () => {
    if (data.options.length >= OPTION_LABELS.length) return;
    setData((d) => ({
      ...d,
      options: [
        ...d.options,
        { label: OPTION_LABELS[d.options.length], text: "", isCorrect: false },
      ],
    }));
  };

  const removeOption = (i: number) =>
    setData((d) => ({
      ...d,
      options: d.options
        .filter((_, idx) => idx !== i)
        .map((o, idx) => ({ ...o, label: OPTION_LABELS[idx] })),
    }));

  const handleSave = () => onSave(data);
  const handleSaveAndAdd = () => {
    onSaveAndAdd(data);
    setData(buildDefault());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              {index}
            </div>
            <span className="font-semibold text-slate-800">Question {index}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Score:</span>
              <input
                type="number"
                min={1}
                value={data.score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-12 border border-slate-200 rounded px-2 py-0.5 text-sm text-center"
              />
            </div>
            <select
              value={data.type}
              onChange={(e) => setType(e.target.value as QuestionData["type"])}
              className="text-sm border border-slate-200 rounded px-2 py-1"
            >
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
              <option value="text">Text</option>
            </select>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question text */}
        <div className="px-5 pt-4">
          <RichTextEditor
            placeholder="Enter question text..."
            onChange={setQuestionText}
            minHeight={90}
          />
        </div>

        {/* Options (for radio / checkbox) */}
        {data.type !== "text" && (
          <div className="px-5 pt-4 space-y-3">
            {data.options.map((opt, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0">
                    {opt.label}
                  </span>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                    <input
                      type={data.type === "radio" ? "radio" : "checkbox"}
                      name={`correct-${index}`}
                      checked={opt.isCorrect}
                      onChange={() => toggleCorrect(i)}
                      className={cn(
                        "w-4 h-4 cursor-pointer",
                        "accent-primary"
                      )}
                    />
                    Set as correct answer
                  </label>
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="ml-auto p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <RichTextEditor
                  placeholder={`Option ${opt.label}`}
                  onChange={(html) => setOptionText(i, html)}
                  minHeight={64}
                />
              </div>
            ))}

            {data.options.length < OPTION_LABELS.length && (
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1"
              >
                <Plus className="w-4 h-4" />
                Another options
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 mt-4 border-t border-slate-100">
          <Button variant="outline" onClick={handleSave} className="rounded-lg border-primary text-primary hover:bg-primary/5">
            Save
          </Button>
          <Button onClick={handleSaveAndAdd} className="rounded-lg bg-primary text-white hover:bg-primary/90">
            Save & Add More
          </Button>
        </div>
      </div>
    </div>
  );
});
