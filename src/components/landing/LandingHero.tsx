"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Headphones,
  Mic,
  Sparkles,
  Volume2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedMascot from "./AnimatedMascot";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const landingTokens = [
  {
    label: "hola",
    language: "Spanish",
    line: "Open vowels. Easy rhythm.",
    color: "#f03867",
  },
  {
    label: "merci",
    language: "French",
    line: "Soft ending. Say it lightly.",
    color: "#18734f",
  },
  {
    label: "lernen",
    language: "German",
    line: "Recall it. Then use it.",
    color: "#e75b37",
  },
  {
    label: "hanasu",
    language: "Japanese",
    line: "Keep the rhythm moving.",
    color: "#7857c5",
  },
];

const tickerItems = [
  "SPEAK",
  "LISTEN",
  "REMEMBER",
  "REPEAT",
  "WHISPER",
  "GPT-4o",
  "SM-2",
  "CEFR",
];

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
  const [activeToken, setActiveToken] = useState("hola");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeTokenDetails =
    landingTokens.find((token) => token.label === activeToken) ?? landingTokens[0];

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
        .from(".hero-copy", { autoAlpha: 0, y: 18, duration: 0.5 }, "-=0.35")
        .from(".hero-cta", { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.45 }, "-=0.28")
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

      gsap.to(".ticker-track", {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
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
          "--token-color": activeTokenDetails.color,
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
            activeToken={activeToken}
            accent={activeTokenDetails.color}
            phrase={activeTokenDetails.line}
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

        <div className="hero-note hero-note-speak">
          <Volume2 aria-hidden="true" />
          <span>real-time pronunciation</span>
          <strong>91%</strong>
        </div>

        <div className="hero-copy">
          <p>
            Flashcards that know when to return. AI conversations that correct without killing
            your confidence.
          </p>
          <div className="hero-actions">
            <Link href="/chat" className="hero-cta hero-cta-primary">
              <Mic aria-hidden="true" />
              Speak your first sentence
            </Link>
            <Link href="#decks" className="hero-cta hero-cta-secondary">
              See your decks
              <ArrowDown aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hero-language-strip" aria-label="Choose a practice language">
          {landingTokens.map((token, index) => (
            <button
              key={token.label}
              type="button"
              data-testid={`landing-token-${token.label}`}
              aria-pressed={activeToken === token.label}
              onClick={() => setActiveToken(token.label)}
              onFocus={() => setActiveToken(token.label)}
              className={activeToken === token.label ? "is-active" : ""}
              style={{ "--sticker-rotate": `${index % 2 === 0 ? -2 : 2}deg` } as CSSProperties}
            >
              <span>{token.language}</span>
              <strong>{token.label}</strong>
            </button>
          ))}
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

        <Link href="#how-it-works" className="hero-scroll-cue" aria-label="See how yap works">
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      <div className="editorial-ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <i />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
