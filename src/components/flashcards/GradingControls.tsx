"use client";

import { useCallback, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";

const gradeOptions = [
  { key: 1, label: "Again", tone: "again" },
  { key: 2, label: "Hard", tone: "hard" },
  { key: 3, label: "Good", tone: "good" },
  { key: 4, label: "Easy", tone: "easy" },
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
    <div className="study-grading">
      {gradeOptions.map((item) => (
        <button
          key={item.key}
          onClick={() => handleGrade(item.key)}
          className={`study-grade study-grade-${item.tone}`}
        >
          <span>{item.key}</span>
          <strong>{item.label}</strong>
        </button>
      ))}
    </div>
  );
}
