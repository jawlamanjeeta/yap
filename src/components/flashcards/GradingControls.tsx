"use client";

import { useCallback, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";

const gradeOptions = [
  { key: 1, label: "Again", tone: "hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" },
  { key: 2, label: "Hard", tone: "hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10" },
  { key: 3, label: "Good", tone: "hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10" },
  { key: 4, label: "Easy", tone: "hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" },
];

export default function GradingControls() {
  const { gradeCurrentCard, isFinished, queue } = useSessionStore();

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
    [gradeCurrentCard],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isFinished()) return;

      if (event.key === "1") handleGrade(1);
      if (event.key === "2") handleGrade(2);
      if (event.key === "3") handleGrade(3);
      if (event.key === "4") handleGrade(4);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleGrade, isFinished]);

  if (isFinished() || queue.length === 0) return null;

  return (
    <div className="mt-4 grid w-full max-w-sm grid-cols-2 gap-2 sm:grid-cols-4">
      {gradeOptions.map((item) => (
        <button
          key={item.key}
          onClick={() => handleGrade(item.key)}
          className={`rounded-lg border border-neutral-200 bg-white py-3 text-center transition dark:border-neutral-800 dark:bg-neutral-900 ${item.tone}`}
        >
          <span className="block text-xs font-bold text-neutral-400">{item.key}</span>
          <span className="text-sm font-black text-neutral-950 dark:text-white">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
