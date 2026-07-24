"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE_SELECTOR = "a, button, input, textarea, [role='button']";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const precisePointer = window.matchMedia("(min-width: 901px) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!cursor || !precisePointer.matches || reducedMotion.matches) return;

    document.body.classList.add("has-custom-cursor");
    cursor.classList.add("is-enabled");

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      cursor.classList.add("is-visible");
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target;
      cursor.classList.toggle(
        "is-interactive",
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR)),
      );
    };

    const handleDown = () => cursor.classList.add("is-pressed");
    const handleUp = () => cursor.classList.remove("is-pressed");
    const handleLeave = () => cursor.classList.remove("is-visible");

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span>yap</span>
    </div>
  );
}
