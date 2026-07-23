"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AnimatedMascot({
  activeToken,
  accent,
  phrase,
  reducedMotion,
}: {
  activeToken: string;
  accent: string;
  phrase: string;
  reducedMotion: boolean;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [waveCount, setWaveCount] = useState(0);

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.to(".mascot-character", {
        y: -10,
        rotate: -1.2,
        duration: 1.55,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".mascot-eye", {
        scaleY: 0.08,
        duration: 0.08,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 3.2,
        transformOrigin: "center",
      });

      gsap.to(".mascot-wing-right", {
        rotate: -23,
        x: 10,
        duration: 0.38,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.8,
        transformOrigin: "18% 88%",
      });

      gsap.to(".mascot-flame-piece", {
        y: -5,
        scaleY: 1.08,
        duration: 0.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        transformOrigin: "bottom",
      });

      gsap.to(".mascot-speech", {
        y: -7,
        duration: 1.45,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  useEffect(() => {
    if (reducedMotion) return;

    const scope = scopeRef.current;
    if (!scope) return;

    gsap
      .timeline()
      .to(scope.querySelector(".mascot-character"), {
        scale: 1.05,
        rotate: 2,
        duration: 0.16,
        ease: "power2.out",
      })
      .to(scope.querySelector(".mascot-character"), {
        scale: 1,
        rotate: 0,
        duration: 0.28,
        ease: "back.out(2)",
      })
      .to(
        scope.querySelector(".mascot-wing-right"),
        {
          rotate: -48,
          x: 16,
          y: -8,
          duration: 0.18,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut",
          transformOrigin: "18% 88%",
        },
        0,
      )
      .fromTo(
        scope.querySelector(".mascot-speech"),
        { scale: 0.92, autoAlpha: 0.72 },
        { scale: 1, autoAlpha: 1, duration: 0.24, ease: "back.out(2)" },
        0,
      );
  }, [activeToken, waveCount, reducedMotion]);

  return (
    <div
      ref={scopeRef}
      className="mascot-stage"
      style={{ "--mascot-accent": accent } as CSSProperties}
    >
      <div className="mascot-speech" aria-live="polite">
        <span className="mascot-speech-token">{activeToken}</span>
        <span>{phrase}</span>
      </div>

      <button
        type="button"
        className="mascot-character"
        aria-label="Make the yap mascot wave"
        onClick={() => setWaveCount((count) => count + 1)}
      >
        <span className="mascot-flame" aria-hidden="true">
          <span className="mascot-flame-piece mascot-flame-left" />
          <span className="mascot-flame-piece mascot-flame-mid" />
          <span className="mascot-flame-piece mascot-flame-right" />
        </span>

        <span className="mascot-head" aria-hidden="true">
          <span className="mascot-side mascot-side-left" />
          <span className="mascot-side mascot-side-right" />
          <span className="mascot-eye mascot-eye-left">
            <span />
          </span>
          <span className="mascot-eye mascot-eye-right">
            <span />
          </span>
          <span className="mascot-cheek mascot-cheek-left" />
          <span className="mascot-cheek mascot-cheek-right" />
          <span className="mascot-beak mascot-beak-top" />
          <span className="mascot-beak mascot-beak-bottom" />
        </span>

        <span className="mascot-body" aria-hidden="true">
          <span className="mascot-wing mascot-wing-left" />
          <span className="mascot-wing mascot-wing-right" />
          <span className="mascot-belly" />
        </span>

        <span className="mascot-foot mascot-foot-left" aria-hidden="true" />
        <span className="mascot-foot mascot-foot-right" aria-hidden="true" />
      </button>

      <div className="mascot-shadow" aria-hidden="true" />
      <div className="mascot-spark mascot-spark-one" aria-hidden="true" />
      <div className="mascot-spark mascot-spark-two" aria-hidden="true" />
      <div className="mascot-spark mascot-spark-three" aria-hidden="true" />
    </div>
  );
}
