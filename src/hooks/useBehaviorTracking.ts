import { useEffect, useRef, useCallback, useState } from "react";

interface UseBehaviorTrackingOptions {
  onTabSwitch?: (count: number) => void;
  onFullscreenExit?: (count: number) => void;
  onSuspiciousActivity?: (type: string) => void;
}

export function useBehaviorTracking({
  onTabSwitch,
  onFullscreenExit,
  onSuspiciousActivity,
}: UseBehaviorTrackingOptions = {}) {
  const tabSwitchCountRef = useRef(0);
  const fullscreenExitCountRef = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const recordTabSwitch = useCallback(() => {
    tabSwitchCountRef.current += 1;
    onTabSwitch?.(tabSwitchCountRef.current);
    onSuspiciousActivity?.("tab_switch");
  }, [onTabSwitch, onSuspiciousActivity]);

  const recordFullscreenExit = useCallback(() => {
    fullscreenExitCountRef.current += 1;
    onFullscreenExit?.(fullscreenExitCountRef.current);
    onSuspiciousActivity?.("fullscreen_exit");
  }, [onFullscreenExit, onSuspiciousActivity]);

  const getCounts = useCallback(() => ({
    tabSwitches: tabSwitchCountRef.current,
    fullscreenExits: fullscreenExitCountRef.current,
  }), []);

  const resetCounts = useCallback(() => {
    tabSwitchCountRef.current = 0;
    fullscreenExitCountRef.current = 0;
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        recordTabSwitch();
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && fullscreenExitCountRef.current > 0) {
        recordFullscreenExit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [recordTabSwitch, recordFullscreenExit]);

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("Failed to exit fullscreen:", error);
      }
    }
  }, []);

  return {
    isFullscreen,
    tabSwitchCount: tabSwitchCountRef.current,
    fullscreenExitCount: fullscreenExitCountRef.current,
    getCounts,
    resetCounts,
    enterFullscreen,
    exitFullscreen,
    enterFullscreen: async () => {
      try {
        await document.documentElement.requestFullscreen();
        return true;
      } catch {
        return false;
      }
    },
  };
}
