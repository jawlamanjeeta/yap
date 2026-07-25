"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomCursor from "./CustomCursor";

export default function HorizontalLanding({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef(0);
  const [panel, setPanel] = useState(1);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const desktop = window.matchMedia("(min-width: 901px)");
    if (!scroller) return;

    const updateProgress = () => {
      const maximum = scroller.scrollWidth - scroller.clientWidth;
      const progress = maximum > 0 ? scroller.scrollLeft / maximum : 0;
      progressRef.current?.style.setProperty("--horizontal-progress", progress.toString());
      setPanel(Math.min(3, Math.round(progress * 2) + 1));
      destinationRef.current = scroller.scrollLeft;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!desktop.matches) return;

      event.preventDefault();
      const movement =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const maximum = scroller.scrollWidth - scroller.clientWidth;
      destinationRef.current = gsap.utils.clamp(
        0,
        maximum,
        destinationRef.current + movement * 3.4,
      );

      gsap.to(scroller, {
        scrollLeft: destinationRef.current,
        duration: 0.48,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: updateProgress,
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!desktop.matches || event.target instanceof HTMLInputElement) return;
      if (!["ArrowLeft", "ArrowRight", "PageUp", "PageDown"].includes(event.key)) return;

      event.preventDefault();
      const direction = event.key === "ArrowLeft" || event.key === "PageUp" ? -1 : 1;
      const nextPanel = Math.round(scroller.scrollLeft / scroller.clientWidth) + direction;
      destinationRef.current = gsap.utils.clamp(
        0,
        scroller.scrollWidth - scroller.clientWidth,
        nextPanel * scroller.clientWidth,
      );

      gsap.to(scroller, {
        scrollLeft: destinationRef.current,
        duration: 0.8,
        ease: "power3.inOut",
        overwrite: "auto",
        onUpdate: updateProgress,
      });
    };

    const moveToHash = (animate = true) => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const target = document.getElementById(hash);
      if (!target) return;

      if (!desktop.matches) {
        target.scrollIntoView({ behavior: animate ? "smooth" : "auto" });
        return;
      }

      destinationRef.current = gsap.utils.clamp(
        0,
        scroller.scrollWidth - scroller.clientWidth,
        target.offsetLeft,
      );

      if (!animate) {
        scroller.scrollLeft = destinationRef.current;
        updateProgress();
        return;
      }

      gsap.to(scroller, {
        scrollLeft: destinationRef.current,
        duration: 0.8,
        ease: "power3.inOut",
        overwrite: "auto",
        onUpdate: updateProgress,
      });
    };

    const handleHashChange = () => moveToHash(true);

    scroller.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("hashchange", handleHashChange);
    updateProgress();
    requestAnimationFrame(() => moveToHash(false));

    return () => {
      scroller.removeEventListener("scroll", updateProgress);
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleHashChange);
      gsap.killTweensOf(scroller);
    };
  }, []);

  return (
    <>
      <div ref={scrollerRef} className="horizontal-viewport">
        <div className="horizontal-track">{children}</div>
      </div>

      <div ref={progressRef} className="horizontal-progress" aria-hidden="true">
        <span>0{panel}</span>
        <i />
        <span>03</span>
      </div>

      <CustomCursor />
    </>
  );
}
