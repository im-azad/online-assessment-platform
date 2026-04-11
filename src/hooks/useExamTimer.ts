import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAnswer, setCurrentAttempt, clearAnswers } from "@/store/slices/examSlice";
import { get as idbGet, set as idbSet } from "idb-keyval";
import { STORAGE_KEYS } from "@/constants";

interface UseExamTimerOptions {
  examId: string;
  duration: number;
  onTimeUp: () => void;
  autoSave?: boolean;
}

export function useExamTimer({
  examId,
  duration,
  onTimeUp,
  autoSave = true,
}: UseExamTimerOptions) {
  const dispatch = useAppDispatch();
  const { answers } = useAppSelector((state) => state.exam);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveProgress = useCallback(async () => {
    try {
      await idbSet(`${STORAGE_KEYS.EXAM_ANSWERS}_${examId}`, {
        answers,
        timeLeft,
        savedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, [examId, answers, timeLeft]);

  const restoreProgress = useCallback(async () => {
    try {
      const saved = await idbGet(`${STORAGE_KEYS.EXAM_ANSWERS}_${examId}`);
      if (saved) {
        setTimeLeft(saved.timeLeft);
        return saved.answers;
      }
    } catch (error) {
      console.error("Failed to restore progress:", error);
    }
    return null;
  }, [examId]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(duration * 60);
    dispatch(clearAnswers());
  }, [duration, dispatch]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  useEffect(() => {
    if (autoSave && isRunning && timeLeft % 30 === 0) {
      saveProgress();
    }
  }, [autoSave, isRunning, timeLeft, saveProgress]);

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    saveProgress,
    restoreProgress,
    formattedTime: `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`,
  };
}
