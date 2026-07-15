"use client";

import { useEffect, useState } from "react";
import { useSessionStore, QueuedCard } from "@/store/useSessionStore";
import Flashcard from "./Flashcard";
import GradingControls from "./GradingControls";
import { motion } from "framer-motion";

export default function FlashcardDeck({ initialQueue }: { initialQueue: QueuedCard[] }) {
  const { setQueue, sessionXp, currentIndex } = useSessionStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setQueue(initialQueue);
    setIsMounted(true);
  }, [initialQueue, setQueue]);

  if (!isMounted) return null;

  const totalCards = initialQueue.length;
  const progress = totalCards === 0 ? 100 : Math.min(100, (currentIndex / totalCards) * 100);

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      {/* Gamification header */}
      <div className="w-full mb-8 flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm font-medium text-neutral-400">
          <span>Session XP: <span className="text-white">{sessionXp}</span></span>
          <span>{Math.min(currentIndex, totalCards)} / {totalCards} Cards</span>
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-900">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <Flashcard />
      <GradingControls />
    </div>
  );
}