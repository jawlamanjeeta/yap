"use client";

import { useEffect, useCallback } from "react";
import { useSessionStore } from "@/store/useSessionStore";

export default function GradingControls() {
  const { gradeCurrentCard, isFinished, queue } = useSessionStore();

  // Map the 4-button interface to the 0-5 SM-2 quality scale
  // 1 = Again (Blackout) -> Quality 1
  // 2 = Hard -> Quality 3
  // 3 = Good -> Quality 4
  // 4 = Easy -> Quality 5
  const handleGrade = useCallback(
    (buttonIndex: number) => {
      const qualityMap: Record<number, number> = {
        1: 1,
        2: 3,
        3: 4,
        4: 5,
      };
      
      const quality = qualityMap[buttonIndex];
      if (quality !== undefined) {
        gradeCurrentCard(quality);
      }
    },
    [gradeCurrentCard]
  );

  // Global keyboard listener for rapid grading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering if the user is typing in an input field (for future chat context)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (isFinished()) return;

      if (e.key === "1") handleGrade(1);
      if (e.key === "2") handleGrade(2);
      if (e.key === "3") handleGrade(3);
      if (e.key === "4") handleGrade(4);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleGrade, isFinished]);

  // Hide the controls if the session is over or hasn't started
  if (isFinished() || queue.length === 0) return null;

  return (
    <div className="flex w-full max-w-sm gap-2 mt-6">
      <button
        onClick={() => handleGrade(1)}
        className="group flex flex-1 flex-col items-center justify-center rounded-xl border border-neutral-800 bg-black py-3 hover:bg-neutral-900 transition-colors duration-200"
      >
        <span className="mb-1 text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">1</span>
        <span className="text-sm font-medium text-white">Again</span>
      </button>

      <button
        onClick={() => handleGrade(2)}
        className="group flex flex-1 flex-col items-center justify-center rounded-xl border border-neutral-800 bg-black py-3 hover:bg-neutral-900 transition-colors duration-200"
      >
        <span className="mb-1 text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">2</span>
        <span className="text-sm font-medium text-white">Hard</span>
      </button>

      <button
        onClick={() => handleGrade(3)}
        className="group flex flex-1 flex-col items-center justify-center rounded-xl border border-neutral-800 bg-black py-3 hover:bg-neutral-900 transition-colors duration-200"
      >
        <span className="mb-1 text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">3</span>
        <span className="text-sm font-medium text-white">Good</span>
      </button>

      <button
        onClick={() => handleGrade(4)}
        className="group flex flex-1 flex-col items-center justify-center rounded-xl border border-neutral-800 bg-black py-3 hover:bg-neutral-900 transition-colors duration-200"
      >
        <span className="mb-1 text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">4</span>
        <span className="text-sm font-medium text-white">Easy</span>
      </button>
    </div>
  );
}