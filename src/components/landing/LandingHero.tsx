"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedMascot from "./AnimatedMascot";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LandingHero() {
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
        .from(".hero-word", { autoAlpha: 0, y: 70, rotate: -3, duration: 0.85 }, "-=0.15")
        .from(".hero-highlight", { autoAlpha: 0, y: 34, rotate: 7, duration: 0.62 }, "-=0.5")
        .from(
          ".hero-script",
          { autoAlpha: 0, x: -55, rotate: -6, duration: 0.9 },
          "-=0.55",
        )
        .from(".hero-mascot-shell", { autoAlpha: 0, y: 70, scale: 0.84, duration: 0.9 }, "-=0.72")
        .from(".hero-note", { autoAlpha: 0, y: 24, rotate: 8, stagger: 0.08, duration: 0.55 }, "-=0.55")
        .from(".hero-proof", { autoAlpha: 0, y: 14, stagger: 0.06, duration: 0.4 }, "-=0.25");

      gsap.utils.toArray<HTMLElement>(".hero-note-float").forEach((note, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        gsap.to(note, {
          y: direction * (4 + index * 1.5),
          rotation: `${direction > 0 ? "+=" : "-="}${1.2 + index * 0.45}`,
          duration: 2.1 + index * 0.37,
          delay: index * 0.18,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      gsap.from(".box-debris-piece", {
        autoAlpha: 0,
        y: 34,
        rotate: -10,
        stagger: 0.07,
        duration: 0.65,
        ease: "back.out(1.8)",
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
        <h1 className="editorial-title">
          <span className="hero-word">yap in</span>
          <span className="hero-highlight">any</span>
          <span className="hero-script">language</span>
        </h1>

        <div className="hero-mascot-shell">
          <AnimatedMascot
            reducedMotion={prefersReducedMotion}
          />
        </div>

        <div className="hero-note hero-note-float hero-note-listen">
          <span className="hero-note-label">Español</span>
          <strong>qué bonito</strong>
        </div>

        <div className="hero-note hero-note-float hero-note-level">
          <span className="hero-note-label">Français</span>
          <strong>joie de vivre</strong>
        </div>

        <div className="hero-note hero-note-float hero-note-courage">
          <span className="hero-note-label">Deutsch</span>
          <strong>alles wird gut</strong>
        </div>

        <div className="hero-note hero-note-float hero-note-memory">
          <span className="hero-note-label">日本語</span>
          <strong>ゆっくりでいい</strong>
        </div>

        <div className="box-debris" aria-hidden="true">
          <span className="box-debris-piece debris-word debris-hola">hola!</span>
          <span className="box-debris-piece debris-word debris-ciao">ciao</span>
          <span className="box-debris-piece debris-word debris-salut">salut</span>
          <span className="box-debris-piece debris-letter debris-letter-one">a</span>
          <span className="box-debris-piece debris-letter debris-letter-two">?</span>
          <span className="box-debris-piece debris-spark debris-spark-one" />
          <span className="box-debris-piece debris-spark debris-spark-two" />
          <span className="box-debris-piece debris-dash debris-dash-one" />
          <span className="box-debris-piece debris-dash debris-dash-two" />
        </div>

        <div className="mini-duck-sticker box-debris-piece" aria-hidden="true" />
        <div className="doodle-arrow" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
