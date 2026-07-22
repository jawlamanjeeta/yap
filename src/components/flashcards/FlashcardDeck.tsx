"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QueuedCard, useSessionStore } from "@/store/useSessionStore";
import Flashcard from "./Flashcard";
import GradingControls from "./GradingControls";

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
      <div className="mb-6 flex w-full flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
          <span>
            XP <span className="ml-1 text-neutral-950 dark:text-white">{sessionXp}</span>
          </span>
          <span>
            {Math.min(currentIndex, totalCards)} / {totalCards}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <motion.div
            className="h-full bg-amber-500"
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
