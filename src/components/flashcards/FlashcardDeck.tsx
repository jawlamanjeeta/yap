"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSessionStore, QueuedCard } from "@/store/useSessionStore";
import Flashcard from "./Flashcard";
import GradingControls from "./GradingControls";

export default function FlashcardDeck({ initialQueue }: { initialQueue: QueuedCard[] }) {
  const { setQueue, sessionXp, currentIndex } = useSessionStore();
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate the Zustand store with the server-fetched queue
  useEffect(() => {
    setQueue(initialQueue);
    setIsMounted(true);
  }, [initialQueue, setQueue]);

  // Prevent server/client hydration mismatch errors
  if (!isMounted) return null;

  const totalCards = initialQueue.length;
  const progress = totalCards === 0 ? 100 : Math.min(100, (currentIndex / totalCards) * 100);

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      {/* Gamification Header: XP & Progress */}
      <div className="mb-8 w-full flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-medium text-neutral-400 uppercase tracking-wider">
          <span>XP <span className="text-white ml-1">{sessionXp}</span></span>
          <span>{Math.min(currentIndex, totalCards)} / {totalCards}</span>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-900">
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