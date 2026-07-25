"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";

export default function Flashcard({ language }: { language: string }) {
  const { queue, currentIndex, isFinished } = useSessionStore();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  if (isFinished() || queue.length === 0) {
    return (
      <div className="study-empty-card">
        <span className="study-empty-stamp">{language}</span>
        <span className="study-empty-spark" aria-hidden="true">✦</span>
        <p>
          {queue.length === 0 ? "No cards due right now" : "Session complete"}
        </p>
        <small>
          {queue.length === 0
            ? "Your scheduled reviews are caught up for this deck."
            : "Nice work. The reviewed cards have new SM-2 dates."}
        </small>
        <strong>{queue.length === 0 ? "Come back fresh tomorrow." : "That was worth yapping about."}</strong>
      </div>
    );
  }

  const currentCard = queue[currentIndex].card;

  return (
    <div className="study-flashcard-wrap [perspective:1000px]">
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
          className="study-flashcard [transform-style:preserve-3d]"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="study-flashcard-face study-flashcard-front [backface-visibility:hidden]">
            <span className="study-card-language">
              {language}
            </span>
            <span className="study-card-index">say it aloud</span>
            <h2>
              {currentCard.frontText}
            </h2>
            <p>
              Tap to reveal the meaning
            </p>
          </div>

          <div className="study-flashcard-face study-flashcard-back [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span>meaning</span>
            <h2>
              {currentCard.backText}
            </h2>
            <p>How well did you remember it?</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
