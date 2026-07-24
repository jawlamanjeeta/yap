"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  Headphones,
  Mic,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedMascot from "./AnimatedMascot";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LandingHero({
  dueCount,
  reviewedPercent,
  totalCards,
}: {
  dueCount: number;
  reviewedPercent: number;
  totalCards: number;
}) {
  const scopeRef = useRef<HTMLElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".editorial-nav", { autoAlpha: 0, y: -22, duration: 0.7 })
        .from(".hero-eyebrow", { autoAlpha: 0, y: 16, duration: 0.45 }, "-=0.25")
        .from(".hero-word", { autoAlpha: 0, y: 70, rotate: -3, duration: 0.85 }, "-=0.15")
        .from(
          ".hero-script",
          { autoAlpha: 0, x: -55, rotate: -6, duration: 0.9 },
          "-=0.55",
        )
        .from(".hero-mascot-shell", { autoAlpha: 0, y: 70, scale: 0.84, duration: 0.9 }, "-=0.72")
        .from(".hero-note", { autoAlpha: 0, y: 24, rotate: 8, stagger: 0.08, duration: 0.55 }, "-=0.55")
        .from(".hero-proof", { autoAlpha: 0, y: 14, stagger: 0.06, duration: 0.4 }, "-=0.25");

      gsap.to(".hero-note-float", {
        y: -8,
        rotate: 1.5,
        duration: 2.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });

      gsap.from(".deck-reveal", {
        scrollTrigger: {
          trigger: "#decks",
          start: "top 84%",
        },
        autoAlpha: 0,
        y: 34,
        stagger: 0.08,
        duration: 0.72,
        ease: "power3.out",
      });
    },
    { scope: scopeRef, dependencies: [prefersReducedMotion] },
  );

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (prefersReducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty("--parallax-x", `${x * 20}px`);
    event.currentTarget.style.setProperty("--parallax-y", `${y * 14}px`);
  }

  return (
    <section
      ref={scopeRef}
      onPointerMove={handlePointerMove}
      className="editorial-hero"
      style={
        {
          "--parallax-x": "0px",
          "--parallax-y": "0px",
        } as CSSProperties
      }
    >
      <header className="editorial-nav">
        <Link href="/" className="editorial-brand" aria-label="yap home">
          yap<span>.</span>
        </Link>

        <nav className="editorial-nav-links" aria-label="Main navigation">
          <Link href="#how-it-works">How it works</Link>
          <Link href="#decks">Your words</Link>
        </nav>

        <Link href="/chat" className="editorial-nav-action">
          <Mic aria-hidden="true" />
          Start yapping
        </Link>
      </header>

      <div className="editorial-canvas">
        <p className="hero-eyebrow">
          <Sparkles aria-hidden="true" />
          A language studio for brave mouths
        </p>

        <h1 className="editorial-title">
          <span className="hero-word">Words</span>
          <span className="hero-script">worth yapping</span>
        </h1>

        <p className="hero-title-tail">about.</p>

        <div className="hero-mascot-shell">
          <AnimatedMascot
            reducedMotion={prefersReducedMotion}
          />
        </div>

        <div className="hero-note hero-note-float hero-note-listen">
          <Headphones aria-hidden="true" />
          <span>hear the tiny details</span>
        </div>

        <div className="hero-note hero-note-float hero-note-level">
          <span className="hero-note-label">today&apos;s glow-up</span>
          <strong>{reviewedPercent}% fluent</strong>
        </div>

        <div className="hero-note hero-note-float hero-note-courage">
          <span className="hero-note-label">tiny rule</span>
          <strong>mistakes welcome</strong>
        </div>

        <div className="hero-note hero-note-float hero-note-memory">
          <span className="hero-note-label">memory magic</span>
          <strong>right word, right time</strong>
        </div>

        <div className="hero-proof-row">
          <span className="hero-proof">
            <strong>{dueCount}</strong> due today
          </span>
          <span className="hero-proof">
            <strong>{totalCards}</strong> words in play
          </span>
          <span className="hero-proof">
            <strong>CEFR</strong> fluency tracking
          </span>
        </div>

      </div>
    </section>
  );
}
