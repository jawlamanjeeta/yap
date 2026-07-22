"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, BookOpen, MessageCircle, Mic, Play } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const LanguageFieldScene = dynamic(() => import("./LanguageFieldScene"), {
  ssr: false,
  loading: () => <SceneFallback activeToken="hola" />,
});

gsap.registerPlugin(useGSAP);

const landingTokens = ["hola", "merci", "lernen", "hanasu"];

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

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .from(".hero-kicker", { autoAlpha: 0, y: 14, duration: 0.65 })
        .from(".hero-title", { autoAlpha: 0, y: 24, duration: 0.75 }, "-=0.35")
        .from(".hero-copy", { autoAlpha: 0, y: 18, duration: 0.65 }, "-=0.35")
        .from(".hero-action", { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.5 }, "-=0.3")
        .from(".hero-stat", { autoAlpha: 0, y: 18, stagger: 0.08, duration: 0.55 }, "-=0.2")
        .from(".hero-scene", { autoAlpha: 0, scale: 0.96, duration: 0.9 }, "-=0.8");
    },
    { scope: scopeRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      ref={scopeRef}
      className="relative isolate -mx-4 min-h-[100svh] overflow-hidden px-4 pb-7 pt-4 sm:-mx-6 sm:px-6 sm:pb-12 sm:pt-5 lg:-mx-8 lg:min-h-[88vh] lg:px-8"
    >
      <div className="absolute inset-0 -z-20 bg-[#f7f4ef] dark:bg-neutral-950" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[#f7f4ef] to-transparent dark:from-neutral-950" />

      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-neutral-950/10 pb-4 dark:border-white/10">
          <Link href="/" className="flex items-center gap-3" aria-label="yap landing page">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="text-xl font-black tracking-tight">yap.</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="#decks"
              className="hidden rounded-lg px-3 py-2 text-sm font-bold text-neutral-700 transition hover:bg-white/70 dark:text-neutral-300 dark:hover:bg-white/10 sm:inline-flex"
            >
              Decks
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <Mic className="h-4 w-4" />
              Speak
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-2 py-7 sm:gap-6 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-6">
          <div className="relative z-10 max-w-2xl">
            <p className="hero-kicker mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-100">
              <MessageCircle className="h-3.5 w-3.5" />
              3D AI language practice
            </p>

            <h1 className="hero-title text-4xl font-black leading-[0.95] tracking-tight text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl">
              yap.
              <span className="block text-[#f43f5e]">Practice until speech clicks.</span>
            </h1>

            <p className="hero-copy mt-4 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:mt-5 sm:text-lg sm:leading-7">
              A kinetic language lab where vocabulary reviews, voice recording,
              Whisper transcription, and GPT-4o feedback all feed the same learning loop.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:gap-3">
              <Link
                href="/chat"
                className="hero-action inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <Play className="h-4 w-4 fill-current" />
                Try speaking practice
              </Link>
              <Link
                href="#decks"
                className="hero-action inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white/70 px-5 py-3 text-sm font-black text-neutral-950 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-neutral-700 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                Review flashcards
                <ArrowDown className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid max-w-xl grid-cols-3 gap-2 sm:mt-8">
              <HeroStat label="Due today" value={dueCount.toString()} />
              <HeroStat label="Reviewed" value={`${reviewedPercent}%`} />
              <HeroStat label="Cards" value={totalCards.toString()} />
            </div>
          </div>

          <div className="hero-scene relative -mt-3 h-[18rem] min-h-[18rem] overflow-hidden sm:mt-0 sm:h-[28rem] sm:min-h-[22rem] lg:h-[42rem]">
            <div className="absolute left-3 top-3 z-10 rounded-lg border border-neutral-950/10 bg-white/75 px-2.5 py-1.5 text-xs font-black text-neutral-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/70 dark:text-white sm:px-3 sm:py-2 sm:text-sm">
              Hover tokens: <span className="text-[#f43f5e]">{activeToken}</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap gap-2">
              {landingTokens.map((token) => (
                <button
                  key={token}
                  type="button"
                  data-testid={`landing-token-${token}`}
                  onClick={() => setActiveToken(token)}
                  onFocus={() => setActiveToken(token)}
                  onMouseEnter={() => setActiveToken(token)}
                  className={`rounded-lg border px-3 py-2 text-xs font-black shadow-sm backdrop-blur transition ${
                    activeToken === token
                      ? "border-[#f43f5e] bg-[#f43f5e] text-white"
                      : "border-neutral-950/10 bg-white/75 text-neutral-900 hover:border-[#f43f5e] dark:border-white/10 dark:bg-neutral-900/70 dark:text-white"
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
            {prefersReducedMotion ? (
              <SceneFallback activeToken={activeToken} />
            ) : (
              <LanguageFieldScene activeToken={activeToken} onTokenChange={setActiveToken} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hero-stat rounded-lg border border-neutral-950/10 bg-white/65 p-2.5 backdrop-blur dark:border-white/10 dark:bg-white/10 sm:p-3">
      <p className="text-xl font-black tracking-tight sm:text-2xl">{value}</p>
      <p className="mt-1 text-[0.58rem] font-black uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 sm:text-[0.68rem] sm:tracking-[0.12em]">
        {label}
      </p>
    </div>
  );
}

function SceneFallback({ activeToken }: { activeToken: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-72 w-72 sm:h-96 sm:w-96">
        <div className="absolute inset-8 rounded-full border border-neutral-300 dark:border-neutral-700" />
        <div className="absolute inset-20 rounded-full bg-[#182a2f]" />
        <Image
          src="/mascot.png"
          alt=""
          width={112}
          height={112}
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 object-contain"
        />
        <span className="absolute left-0 top-16 rounded-lg bg-amber-400 px-3 py-2 text-sm font-black text-neutral-950">
          {activeToken}
        </span>
        <span className="absolute bottom-12 right-0 rounded-lg bg-sky-400 px-3 py-2 text-sm font-black text-neutral-950">
          speak
        </span>
      </div>
    </div>
  );
}
