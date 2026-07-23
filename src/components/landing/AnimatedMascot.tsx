"use client";

import Image from "next/image";
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
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".mascot-art", {
        rotate: -1.5,
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 85%",
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
        scope.querySelector(".mascot-art"),
        {
          rotate: -8,
          x: -5,
          duration: 0.14,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut",
          transformOrigin: "50% 85%",
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
        <span className="mascot-art">
          <Image
            src="/yap-duck.png"
            alt=""
            width={604}
            height={711}
            priority
            draggable={false}
          />
        </span>
      </button>

      <div className="mascot-shadow" aria-hidden="true" />
      <div className="mascot-spark mascot-spark-one" aria-hidden="true" />
      <div className="mascot-spark mascot-spark-two" aria-hidden="true" />
      <div className="mascot-spark mascot-spark-three" aria-hidden="true" />
    </div>
  );
}
