"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";

export default function Flashcard() {
  // Connect directly to the global state
  const { queue, currentIndex, isFinished } = useSessionStore();
  const [isFlipped, setIsFlipped] = useState(false);

  // Automatically reset the flip state when Zustand advances to the next card
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Fallback UI when the session is over
  if (isFinished() || queue.length === 0) {
    return (
      <div className="flex h-80 w-full max-w-sm items-center justify-center rounded-2xl border border-neutral-800 bg-black text-neutral-400">
        <p className="font-medium text-lg">Session Complete! 🎉</p>
      </div>
    );
  }

  const currentCard = queue[currentIndex].card;

  return (
    // [perspective:1000px] gives the 3D rotation depth
    <div className="relative h-80 w-full max-w-sm [perspective:1000px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={queue[currentIndex].id} // Changing the key triggers the exit/enter animations
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
          {/* Front Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-black p-6 shadow-2xl [backface-visibility:hidden]">
            <span className="absolute top-4 right-4 text-xs font-semibold text-neutral-600 uppercase tracking-widest">
              {currentCard.language}
            </span>
            <h2 className="text-4xl font-bold text-white text-center">
              {currentCard.frontText}
            </h2>
            <p className="absolute bottom-6 text-sm text-neutral-600 animate-pulse">
              Tap to reveal
            </p>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <h2 className="text-3xl font-medium text-white text-center">
              {currentCard.backText}
            </h2>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}