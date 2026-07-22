"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowDown, BookOpen, MessageCircle, Mic, Play, Radio, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const LanguageFieldScene = dynamic(() => import("./LanguageFieldScene"), {
  ssr: false,
  loading: () => <SceneFallback activeToken="hola" />,
});

gsap.registerPlugin(useGSAP, ScrollTrigger);

const landingTokens = [
  {
    label: "hola",
    language: "Spanish",
    line: "Start warm. Land the vowels.",
    color: "#ffd84d",
  },
  {
    label: "merci",
    language: "French",
    line: "Short phrase. Clean ending.",
    color: "#55d7ff",
  },
  {
    label: "lernen",
    language: "German",
    line: "Recall, then say it out loud.",
    color: "#b8ff4f",
  },
  {
    label: "hanasu",
    language: "Japanese",
    line: "Speak with rhythm, not panic.",
    color: "#ff6b8a",
  },
];

const tickerItems = ["WHISPER", "SM-2", "GPT-4o", "CEFR", "SPEAK", "RECALL", "STREAK", "VOCAB"];

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

      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .from(".hero-nav", { autoAlpha: 0, y: -18, duration: 0.7 })
        .from(".hero-kicker", { autoAlpha: 0, y: 14, duration: 0.55 }, "-=0.25")
        .from(".hero-title-line", { autoAlpha: 0, y: 46, rotateX: -12, stagger: 0.08, duration: 0.78 }, "-=0.2")
        .from(".hero-copy", { autoAlpha: 0, y: 18, duration: 0.55 }, "-=0.35")
        .from(".hero-action", { autoAlpha: 0, y: 16, stagger: 0.07, duration: 0.5 }, "-=0.28")
        .from(".hero-stat", { autoAlpha: 0, y: 22, stagger: 0.06, duration: 0.52 }, "-=0.25")
        .from(".scene-shell", { autoAlpha: 0, scale: 0.92, rotateY: -8, duration: 0.9 }, "-=0.82")
        .from(".hud-card", { autoAlpha: 0, x: 24, stagger: 0.08, duration: 0.55 }, "-=0.45")
        .from(".token-pill", { autoAlpha: 0, y: 14, stagger: 0.05, duration: 0.42 }, "-=0.35");

      gsap.to(".ticker-track", {
        xPercent: -50,
        duration: 18,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".float-card", {
        y: -9,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
      });

      gsap.to(".signal-bar", {
        scaleY: () => gsap.utils.random(0.45, 1.2),
        duration: 0.42,
        transformOrigin: "bottom",
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.06,
      });

      gsap.from(".deck-reveal", {
        scrollTrigger: {
          trigger: "#decks",
          start: "top 82%",
        },
        autoAlpha: 0,
        y: 26,
        stagger: 0.08,
        duration: 0.72,
        ease: "power3.out",
      });
    },
    { scope: scopeRef, dependencies: [prefersReducedMotion] },
  );

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty("--parallax-x", `${x * 24}px`);
    event.currentTarget.style.setProperty("--parallax-y", `${y * 18}px`);
  }

  return (
    <section
      ref={scopeRef}
      onPointerMove={handlePointerMove}
      className="relative isolate min-h-[96svh] overflow-hidden bg-[#080907] px-4 pb-6 pt-4 text-[#f8efd0] sm:px-6 sm:pb-8 sm:pt-5 lg:min-h-[88vh] lg:px-8"
      style={
        {
          "--parallax-x": "0px",
          "--parallax-y": "0px",
          "--token-color": activeTokenDetails.color,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#080907_0%,#10130d_36%,#251209_72%,#2a1905_100%)]" />
      <div className="absolute inset-0 -z-20 opacity-45 [background-image:linear-gradient(to_right,rgba(248,239,208,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(248,239,208,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(85,215,255,0.12),transparent_28%,rgba(184,255,79,0.09)_58%,rgba(255,107,138,0.12))]" />
      <div className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light opacity-25 [background-image:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_1px,transparent_1px,transparent_5px)]" />

      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
        <header className="hero-nav flex items-center justify-between border-b border-[#f8efd0]/15 pb-4">
          <Link href="/" className="group flex items-center gap-3" aria-label="yap landing page">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#f8efd0]/15 bg-[#f8efd0] text-[#080907] shadow-[4px_4px_0_#ff6b8a] transition group-hover:-translate-y-0.5">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-black">yap.</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="#decks"
              className="hidden rounded-lg border border-[#f8efd0]/15 px-3 py-2 text-sm font-bold text-[#f8efd0]/80 transition hover:border-[#b8ff4f] hover:text-[#b8ff4f] sm:inline-flex"
            >
              Decks
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f8efd0] px-3 py-2 text-sm font-black text-[#080907] transition hover:-translate-y-0.5 hover:bg-[#b8ff4f]"
            >
              <Mic className="h-4 w-4" />
              Speak
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-4 py-5 sm:gap-7 sm:py-8 lg:grid-cols-[0.88fr_1.12fr] lg:py-7">
          <div className="relative z-10 max-w-2xl">
            <p className="hero-kicker mb-4 inline-flex items-center gap-2 rounded-lg border border-[#ffd84d]/40 bg-[#ffd84d]/12 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#ffd84d]">
              <MessageCircle className="h-3.5 w-3.5" />
              AI speaking arcade
            </p>

            <h1 className="hero-title font-display text-[2.8rem] font-black leading-[0.9] text-[#f8efd0] sm:text-7xl lg:text-[6.8rem]">
              <span className="hero-title-line block">yap.</span>
              <span className="hero-title-line block text-[#b8ff4f]">Make your mouth</span>
              <span className="hero-title-line block text-[#55d7ff]">remember.</span>
            </h1>

            <p className="hero-copy mt-5 max-w-xl text-base leading-7 text-[#f8efd0]/72 sm:text-lg">
              A fast little practice loop for flashcards, speaking reps, and AI feedback that feels
              more like a game than homework.
            </p>

            <div className="mt-6 hidden flex-col gap-2 sm:flex sm:flex-row sm:gap-3">
              <Link
                href="/chat"
                className="hero-action inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff6b8a] px-5 py-3 text-sm font-black text-[#080907] shadow-[5px_5px_0_#f8efd0] transition hover:-translate-y-0.5 hover:bg-[#ffd84d]"
              >
                <Play className="h-4 w-4 fill-current" />
                Start speaking
              </Link>
              <Link
                href="#decks"
                className="hero-action inline-flex items-center justify-center gap-2 rounded-lg border border-[#f8efd0]/20 bg-[#f8efd0]/8 px-5 py-3 text-sm font-black text-[#f8efd0] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#55d7ff] hover:text-[#55d7ff]"
              >
                Review deck
                <ArrowDown className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-3 gap-2 sm:mt-7">
              <HeroStat label="Due" value={dueCount.toString()} tone="gold" />
              <HeroStat label="Fluency" value={`${reviewedPercent}%`} tone="lime" />
              <HeroStat label="Cards" value={totalCards.toString()} tone="cyan" />
            </div>

            <div className="mt-3 grid gap-2 sm:hidden">
              <div className="rounded-lg border border-[#f8efd0]/12 bg-[#f8efd0]/8 p-2.5">
                <p className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-[#f8efd0]/45">
                  Now practicing
                </p>
                <p className="mt-1 font-display text-xl font-black text-[var(--token-color)]">
                  {activeTokenDetails.label}
                  <span className="ml-2 text-xs text-[#f8efd0]/54">{activeTokenDetails.language}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {landingTokens.map((token) => (
                  <button
                    key={token.label}
                    type="button"
                    data-testid={`landing-token-mobile-${token.label}`}
                    onClick={() => setActiveToken(token.label)}
                    onFocus={() => setActiveToken(token.label)}
                    className={`rounded-lg border px-3 py-2 text-xs font-black transition ${
                      activeToken === token.label
                        ? "border-[#f8efd0] bg-[#f8efd0] text-[#080907]"
                        : "border-[#f8efd0]/15 bg-[#080907]/62 text-[#f8efd0]"
                    }`}
                  >
                    {token.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="scene-shell relative h-[14rem] min-h-[14rem] overflow-hidden rounded-lg border border-[#f8efd0]/16 bg-[#f8efd0]/6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur sm:h-[31rem] sm:min-h-[31rem] lg:h-[43rem]">
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-[#f8efd0]/12 bg-[#080907]/66 px-3 py-2 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#f8efd0]/70">
                <Radio className="h-3.5 w-3.5 text-[#b8ff4f]" />
                Live rig
              </div>
              <div className="flex h-5 items-end gap-1" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                  <span
                    key={index}
                    className="signal-bar block h-4 w-1 rounded-sm bg-[var(--token-color)]"
                  />
                ))}
              </div>
            </div>

            <div className="absolute left-3 top-12 z-10 hidden w-[12.5rem] rounded-lg border border-[#f8efd0]/14 bg-[#080907]/72 p-3 shadow-[5px_5px_0_rgba(248,239,208,0.12)] backdrop-blur sm:block">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#f8efd0]/45">
                Now practicing
              </p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-3xl font-black text-[var(--token-color)]">
                    {activeTokenDetails.label}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#f8efd0]/58">
                    {activeTokenDetails.language}
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-[#ffd84d]" />
              </div>
              <p className="mt-3 text-sm leading-5 text-[#f8efd0]/76">{activeTokenDetails.line}</p>
            </div>

            <div className="absolute bottom-4 left-3 right-3 z-10 hidden flex-wrap gap-2 sm:flex">
              {landingTokens.map((token) => (
                <button
                  key={token.label}
                  type="button"
                  data-testid={`landing-token-${token.label}`}
                  onClick={() => setActiveToken(token.label)}
                  onFocus={() => setActiveToken(token.label)}
                  onMouseEnter={() => setActiveToken(token.label)}
                  className={`token-pill rounded-lg border px-3 py-2 text-xs font-black shadow-sm backdrop-blur transition hover:-translate-y-0.5 ${
                    activeToken === token.label
                      ? "border-[#f8efd0] bg-[#f8efd0] text-[#080907]"
                      : "border-[#f8efd0]/15 bg-[#080907]/62 text-[#f8efd0] hover:border-[#b8ff4f]"
                  }`}
                  style={{ "--token-accent": token.color } as CSSProperties}
                >
                  {token.label}
                </button>
              ))}
            </div>

            <div className="absolute right-4 top-16 z-10 hidden w-44 sm:block">
              <div className="hud-card float-card rounded-lg border border-[#55d7ff]/24 bg-[#081210]/76 p-3 shadow-[5px_5px_0_rgba(85,215,255,0.18)] backdrop-blur">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#55d7ff]">
                  Whisper
                </p>
                <p className="mt-2 text-2xl font-black text-[#f8efd0]">91%</p>
                <p className="mt-1 text-xs font-bold text-[#f8efd0]/52">pronunciation lock</p>
              </div>
            </div>

            <div className="absolute right-6 bottom-20 z-10 hidden w-44 lg:block">
              <div className="hud-card float-card rounded-lg border border-[#b8ff4f]/24 bg-[#081210]/76 p-3 shadow-[5px_5px_0_rgba(184,255,79,0.18)] backdrop-blur">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#b8ff4f]">
                  Next review
                </p>
                <p className="mt-2 text-2xl font-black text-[#f8efd0]">4h</p>
                <p className="mt-1 text-xs font-bold text-[#f8efd0]/52">SM-2 queue</p>
              </div>
            </div>

            {prefersReducedMotion ? (
              <SceneFallback activeToken={activeToken} />
            ) : (
              <LanguageFieldScene activeToken={activeToken} onTokenChange={setActiveToken} />
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-y border-[#f8efd0]/12 bg-[#080907]/80 py-2 backdrop-blur">
        <div className="ticker-track flex w-max gap-5 text-xs font-black uppercase tracking-[0.18em] text-[#f8efd0]/48">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-5">
              {item}
              <span className="h-1.5 w-1.5 rounded-sm bg-[#ff6b8a]" />
            </span>
          ))}
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
  tone: "gold" | "lime" | "cyan";
}) {
  const tones = {
    gold: "text-[#ffd84d] shadow-[#ffd84d]/20",
    lime: "text-[#b8ff4f] shadow-[#b8ff4f]/20",
    cyan: "text-[#55d7ff] shadow-[#55d7ff]/20",
  };

  return (
    <div className="hero-stat rounded-lg border border-[#f8efd0]/12 bg-[#f8efd0]/8 p-2.5 shadow-sm backdrop-blur sm:p-3">
      <p className={`font-display text-xl font-black sm:text-3xl ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#f8efd0]/45">
        {label}
      </p>
    </div>
  );
}

function SceneFallback({ activeToken }: { activeToken: string }) {
  const active = landingTokens.find((token) => token.label === activeToken) ?? landingTokens[0];

  return (
    <div className="flex h-full w-full items-center justify-center pt-14">
      <div
        className="relative h-72 w-72 [image-rendering:pixelated] sm:h-96 sm:w-96"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[18%] h-8 w-8 -translate-x-1/2 bg-[#ff3b19] shadow-[0_32px_0_#ff7a1f,0_64px_0_#ffd84d]" />
        <div className="absolute left-1/2 top-[29%] h-28 w-40 -translate-x-1/2 bg-[#ffd84d] shadow-[0_0_0_8px_#3a2416]" />
        <div className="absolute left-1/2 top-[50%] h-28 w-48 -translate-x-1/2 bg-[#ffd84d] shadow-[0_0_0_8px_#3a2416]" />
        <div className="absolute left-[34%] top-[39%] h-5 w-5 bg-[#080907] shadow-[4px_4px_0_#fff]" />
        <div className="absolute left-[58%] top-[39%] h-5 w-5 bg-[#080907] shadow-[4px_4px_0_#fff]" />
        <div className="absolute left-1/2 top-[49%] h-7 w-24 -translate-x-1/2 bg-[#ff8a1f] shadow-[0_7px_0_#d95f00]" />
        <div className="absolute left-[29%] top-[50%] h-5 w-7 bg-[#ff9db0]" />
        <div className="absolute right-[29%] top-[50%] h-5 w-7 bg-[#ff9db0]" />
        <span className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-lg bg-[#080907] px-3 py-1 text-xs font-black text-[#f8efd0]">
          {active.label}
        </span>
      </div>
    </div>
  );
}
