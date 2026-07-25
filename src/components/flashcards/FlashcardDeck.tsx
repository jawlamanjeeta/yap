"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QueuedCard, useSessionStore } from "@/store/useSessionStore";
import Flashcard from "./Flashcard";
import GradingControls from "./GradingControls";

export default function FlashcardDeck({
  initialQueue,
  language,
}: {
  initialQueue: QueuedCard[];
  language: string;
}) {
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
    <div className="study-deck">
      <div className="study-progress">
        <div className="study-progress-copy">
          <span>
            Session XP <strong>{sessionXp}</strong>
          </span>
          <span>
            {Math.min(currentIndex, totalCards)} of {totalCards}
          </span>
        </div>

        <div className="study-progress-track">
          <motion.div
            className="study-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <Flashcard language={language} />
      <GradingControls />
    </div>
  );
}
