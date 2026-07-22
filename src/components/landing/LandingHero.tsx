"use client";

import dynamic from "next/dynamic";
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
      className="relative isolate min-h-[92svh] overflow-hidden px-4 pb-5 pt-4 text-[#10201f] sm:px-6 sm:pb-8 sm:pt-5 lg:min-h-[84vh] lg:px-8"
    >
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#eef8f3_0%,#eaf4ff_48%,#fff5dc_100%)] dark:bg-[linear-gradient(135deg,#071614_0%,#0a2442_54%,#2b2108_100%)]" />
      <div className="absolute inset-0 -z-20 opacity-[0.16] [background-image:linear-gradient(to_right,#10201f_1px,transparent_1px),linear-gradient(to_bottom,#10201f_1px,transparent_1px)] [background-size:42px_42px] dark:opacity-[0.12] dark:[background-image:linear-gradient(to_right,#f4fff9_1px,transparent_1px),linear-gradient(to_bottom,#f4fff9_1px,transparent_1px)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#eef8f3] to-transparent dark:from-[#071614]" />

      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-[#10201f]/15 pb-4 dark:border-white/15">
          <Link href="/" className="flex items-center gap-3" aria-label="yap landing page">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10201f] text-white shadow-sm shadow-[#00a67e]/25 dark:bg-[#f4fff9] dark:text-[#10201f]">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-black">yap.</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="#decks"
              className="hidden rounded-lg px-3 py-2 text-sm font-bold text-[#243f3b] transition hover:bg-white/70 dark:text-[#d7f8ed] dark:hover:bg-white/10 sm:inline-flex"
            >
              Decks
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-[#10201f] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#183936] dark:bg-[#f4fff9] dark:text-[#10201f] dark:hover:bg-white"
            >
              <Mic className="h-4 w-4" />
              Speak
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-1 py-6 sm:gap-6 sm:py-9 lg:grid-cols-[0.92fr_1.08fr] lg:py-6">
          <div className="relative z-10 max-w-2xl">
            <p className="hero-kicker mb-4 inline-flex items-center gap-2 rounded-lg border border-[#f7b801]/55 bg-[#fff1b6]/75 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#5f4300] backdrop-blur dark:border-[#f7b801]/35 dark:bg-[#f7b801]/15 dark:text-[#ffe9a3]">
              <MessageCircle className="h-3.5 w-3.5" />
              3D AI language practice
            </p>

            <h1 className="hero-title font-display text-4xl font-black leading-[0.95] text-[#10201f] dark:text-[#f4fff9] sm:text-6xl lg:text-7xl">
              yap.
              <span className="block text-[#2563eb]">Practice until speech clicks.</span>
            </h1>

            <p className="hero-copy mt-4 max-w-xl text-sm leading-6 text-[#38534f] dark:text-[#d7f8ed] sm:mt-5 sm:text-lg sm:leading-7">
              A kinetic language lab where vocabulary reviews, voice recording,
              Whisper transcription, and GPT-4o feedback all feed the same learning loop.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:gap-3">
              <Link
                href="/chat"
                className="hero-action inline-flex items-center justify-center gap-2 rounded-lg bg-[#10201f] px-5 py-3 text-sm font-black text-white shadow-sm shadow-[#00a67e]/25 transition hover:-translate-y-0.5 hover:bg-[#183936] dark:bg-[#f4fff9] dark:text-[#10201f] dark:hover:bg-white"
              >
                <Play className="h-4 w-4 fill-current" />
                Try speaking practice
              </Link>
              <Link
                href="#decks"
                className="hero-action inline-flex items-center justify-center gap-2 rounded-lg border border-[#00a67e]/40 bg-white/72 px-5 py-3 text-sm font-black text-[#10201f] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-[#00a67e]/45 dark:bg-white/10 dark:text-[#f4fff9] dark:hover:bg-white/15"
              >
                Review flashcards
                <ArrowDown className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid max-w-xl grid-cols-3 gap-2 sm:mt-8">
              <HeroStat label="Due today" value={dueCount.toString()} tone="gold" />
              <HeroStat label="Reviewed" value={`${reviewedPercent}%`} tone="mint" />
              <HeroStat label="Cards" value={totalCards.toString()} tone="blue" />
            </div>
          </div>

          <div className="hero-scene relative -mt-3 h-[15rem] min-h-[15rem] overflow-hidden sm:mt-0 sm:h-[28rem] sm:min-h-[22rem] lg:h-[42rem]">
            <div className="absolute left-3 top-3 z-10 rounded-lg border border-[#10201f]/10 bg-white/78 px-2.5 py-1.5 text-xs font-black text-[#10201f] shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#071614]/72 dark:text-[#f4fff9] sm:px-3 sm:py-2 sm:text-sm">
              Hover tokens: <span className="text-[#ff4d6d]">{activeToken}</span>
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
                      ? "border-[#ff4d6d] bg-[#ff4d6d] text-white"
                      : "border-[#10201f]/10 bg-white/78 text-[#10201f] hover:border-[#ff4d6d] dark:border-white/10 dark:bg-[#071614]/72 dark:text-[#f4fff9]"
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

function HeroStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "gold" | "mint" | "blue";
}) {
  const tones = {
    gold: "text-[#9a6b00]",
    mint: "text-[#007f61]",
    blue: "text-[#2563eb]",
  };

  return (
    <div className="hero-stat rounded-lg border border-[#b7e3d6] bg-white/70 p-2.5 backdrop-blur dark:border-white/10 dark:bg-white/10 sm:p-3">
      <p className={`font-display text-xl font-black sm:text-2xl ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-[0.58rem] font-black uppercase tracking-[0.1em] text-[#55716c] dark:text-[#b7e3d6] sm:text-[0.68rem] sm:tracking-[0.12em]">
        {label}
      </p>
    </div>
  );
}

function SceneFallback({ activeToken }: { activeToken: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-64 w-64 sm:h-96 sm:w-96" aria-hidden="true">
        <div className="absolute left-1/2 top-[48%] h-32 w-40 -translate-x-1/2 rounded-[45%] bg-[#ffd84d] shadow-xl shadow-[#f7b801]/25 sm:h-44 sm:w-56" />
        <div className="absolute left-1/2 top-[24%] h-28 w-32 -translate-x-1/2 rounded-[48%] bg-[#ffe778] shadow-lg shadow-[#f7b801]/20 sm:h-40 sm:w-44" />
        <div className="absolute left-[38%] top-[37%] h-4 w-4 rounded-full bg-[#10201f] sm:h-5 sm:w-5" />
        <div className="absolute left-[57%] top-[37%] h-4 w-4 rounded-full bg-[#10201f] sm:h-5 sm:w-5" />
        <div className="absolute left-1/2 top-[46%] h-7 w-20 -translate-x-1/2 rounded-lg bg-[#ff8a1f] sm:h-8 sm:w-24" />
        <div className="absolute left-[27%] top-[46%] h-4 w-5 rounded-lg bg-[#ff9fb1] sm:h-5 sm:w-6" />
        <div className="absolute right-[27%] top-[46%] h-4 w-5 rounded-lg bg-[#ff9fb1] sm:h-5 sm:w-6" />
        <div className="absolute left-[45%] top-[9%] h-20 w-9 -rotate-6 bg-[#ff6b1f] [clip-path:polygon(50%_0,100%_100%,0_100%)] sm:h-28 sm:w-12" />
        <div className="absolute left-[49%] top-[13%] h-14 w-7 rotate-12 bg-[#ffd84d] [clip-path:polygon(50%_0,100%_100%,0_100%)] sm:h-20 sm:w-9" />
        <div className="absolute bottom-6 left-20 h-5 w-10 rounded-lg bg-[#ff8a1f] sm:bottom-8 sm:left-32" />
        <div className="absolute bottom-6 right-20 h-5 w-10 rounded-lg bg-[#ff8a1f] sm:bottom-8 sm:right-32" />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-[#10201f] px-3 py-1 text-xs font-black text-white">
          {activeToken}
        </span>
      </div>
    </div>
  );
}
