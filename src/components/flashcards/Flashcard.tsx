"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";

export default function Flashcard() {
  const { queue, currentIndex, isFinished } = useSessionStore();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  if (isFinished() || queue.length === 0) {
    return (
      <div className="flex h-80 w-full max-w-sm flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-lg font-black tracking-tight">
          {queue.length === 0 ? "No cards due right now" : "Session complete"}
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {queue.length === 0
            ? "Your scheduled reviews are caught up for this deck."
            : "Nice work. The reviewed cards have new SM-2 dates."}
        </p>
      </div>
    );
  }

  const currentCard = queue[currentIndex].card;

  return (
    <div className="relative h-80 w-full max-w-sm [perspective:1000px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={queue[currentIndex].id}
          initial={{ x: 50, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            rotateY: isFlipped ? 180 : 0,
          }}
          exit={{ x: -50, opacity: 0 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-6 shadow-sm [backface-visibility:hidden] dark:border-neutral-800 dark:bg-neutral-900">
            <span className="absolute right-4 top-4 text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">
              {currentCard.language}
            </span>
            <h2 className="text-center text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
              {currentCard.frontText}
            </h2>
            <p className="absolute bottom-6 text-sm font-semibold text-neutral-400">
              Tap to reveal
            </p>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <h2 className="text-center text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
              {currentCard.backText}
            </h2>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
