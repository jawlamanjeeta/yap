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
      const entranceTargets = [
        ".editorial-nav",
        ".hero-word",
        ".hero-highlight",
        ".hero-script",
        ".mascot-stage",
        ".hero-note",
        ".box-debris-piece",
      ];

      if (prefersReducedMotion) {
        gsap.set(entranceTargets, { clearProps: "all" });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .fromTo(
          ".editorial-nav",
          { autoAlpha: 0, y: -22 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
        )
        .fromTo(
          ".hero-word",
          { autoAlpha: 0, y: 70, rotation: -3 },
          { autoAlpha: 1, y: 0, rotation: 0, duration: 0.85 },
          "-=0.15",
        )
        .fromTo(
          ".hero-highlight",
          { autoAlpha: 0, y: 34, rotation: 7 },
          { autoAlpha: 1, y: 0, rotation: -2, duration: 0.62 },
          "-=0.5",
        )
        .fromTo(
          ".hero-script",
          { autoAlpha: 0, x: -55, rotation: -6 },
          { autoAlpha: 1, x: 0, rotation: -4, duration: 0.9 },
          "-=0.55",
        )
        .fromTo(
          ".mascot-stage",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          "-=0.65",
        )
        .fromTo(
          ".hero-note",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.55,
          },
          "-=0.55",
        );

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

      intro.fromTo(
        ".box-debris-piece",
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.65,
          ease: "back.out(1.8)",
        },
        "-=0.45",
      );

      gsap.utils.toArray<HTMLElement>(".deck-reveal").forEach((element, index) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
          },
          autoAlpha: 0,
          y: 42,
          rotate: index % 2 === 0 ? -0.8 : 0.8,
          duration: 0.82,
          ease: "power3.out",
        });
      });

      gsap.to(".practice-wave i", {
        scaleY: () => gsap.utils.random(0.45, 1.15),
        transformOrigin: "center",
        duration: 0.48,
        stagger: {
          each: 0.055,
          from: "center",
        },
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    {
      dependencies: [prefersReducedMotion],
      revertOnUpdate: true,
    },
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
          <span className="hero-phrase">
            <span className="hero-highlight">any</span>
            <span className="hero-script">language</span>
          </span>
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

        <div className="doodle-arrow" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
