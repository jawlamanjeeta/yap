"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AnimatedMascot({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [waveCount, setWaveCount] = useState(0);

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.to(".mascot-character", {
        y: -5,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".mascot-art", {
        rotate: -0.6,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 85%",
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
          rotate: -3,
          x: -4,
          duration: 0.16,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut",
          transformOrigin: "50% 85%",
        },
        0,
      );
  }, [waveCount, reducedMotion]);

  return (
    <div ref={scopeRef} className="mascot-stage">
      <button
        type="button"
        className="mascot-character"
        aria-label="Make the yap mascot wave"
        onClick={() => setWaveCount((count) => count + 1)}
      >
        <span className="mascot-art">
          <Image
            src="/yap-hero-mascot-stickers.png"
            alt=""
            width={1393}
            height={1034}
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
