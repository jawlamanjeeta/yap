import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  Flame,
  type LucideIcon,
  MessageCircle,
  Mic,
  Sparkles,
  Trophy,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ThemeToggle from "@/components/theme/ThemeToggle";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const user = await prisma.user.findFirst({
    orderBy: { email: "asc" },
  });

  const decks = await prisma.deck.findMany({
    include: {
      _count: {
        select: { cards: true },
      },
    },
    orderBy: { title: "asc" },
  });

  const dueCount = user
    ? await prisma.userCard.count({
        where: {
          userId: user.id,
          nextReview: { lte: new Date() },
        },
      })
    : 0;

  const totalCards = await prisma.card.count();
  const reviewedCards = user
    ? await prisma.userCard.count({
        where: {
          userId: user.id,
          repetition: { gt: 0 },
        },
      })
    : 0;

  return {
    user,
    decks,
    dueCount,
    totalCards,
    reviewedCards,
  };
}

export default async function DashboardPage() {
  const { user, decks, dueCount, totalCards, reviewedCards } = await getDashboardData();
  const reviewProgress = totalCards === 0 ? 0 : Math.round((reviewedCards / totalCards) * 100);

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <Link href="/" className="flex items-center gap-3" aria-label="yap dashboard">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="text-xl font-black tracking-tight">yap.</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/chat"
              className="hidden items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold transition hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900 sm:flex"
            >
              <Mic className="h-4 w-4" />
              Speaking
            </Link>
            <ThemeToggle />
          </nav>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI language practice
                </p>
                <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                  Build recall, then practice out loud.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
                  Review vocabulary with SM-2 spaced repetition, record short answers,
                  get Whisper transcription feedback, and keep a GPT-4o tutor in the loop.
                </p>
              </div>
              <div className="flex items-center justify-center md:w-48">
                <Image
                  src="/mascot.png"
                  alt="yap mascot"
                  width={152}
                  height={152}
                  priority
                  className="h-28 w-28 object-contain sm:h-36 sm:w-36"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatCard icon={CalendarClock} label="Due today" value={dueCount.toString()} tone="amber" />
              <StatCard icon={Trophy} label="Reviewed" value={`${reviewProgress}%`} tone="green" />
              <StatCard icon={Flame} label="Streak" value={`${user?.currentStreak ?? 0} days`} tone="rose" />
            </div>
          </div>

          <aside className="rounded-lg border border-neutral-200 bg-[#182a2f] p-5 text-white shadow-sm dark:border-neutral-800">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight">Conversation partner</h2>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  Speak a short response, compare the browser transcript with Whisper,
                  and get grammar corrections plus a CEFR estimate.
                </p>
              </div>
              <Link
                href="/chat"
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-bold text-neutral-950 transition hover:bg-amber-100"
              >
                Start speaking
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">Vocabulary decks</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Pick a deck and review the cards that are due.
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {totalCards} cards
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {decks.map((deck) => (
                <Link
                  key={deck.id}
                  href={`/study/${deck.id}`}
                  className="group rounded-lg border border-neutral-200 p-4 transition hover:border-amber-400 hover:bg-amber-50 dark:border-neutral-800 dark:hover:border-amber-500/60 dark:hover:bg-amber-500/10"
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-amber-600" />
                  </div>
                  <h3 className="font-black tracking-tight">{deck.title}</h3>
                  {deck.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                      {deck.description}
                    </p>
                  )}
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">
                    {deck._count.cards} cards
                  </p>
                </Link>
              ))}

              {decks.length === 0 && (
                <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                  No decks found yet. Seed the database to load the starter Spanish deck.
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-black tracking-tight">Today&apos;s loop</h2>
            <div className="mt-5 space-y-4">
              <LoopStep number="1" title="Recall" body="Review the front of a card and answer from memory." />
              <LoopStep number="2" title="Grade" body="Rate recall from Again to Easy so SM-2 can schedule it." />
              <LoopStep number="3" title="Speak" body="Use the same words in conversation and get AI feedback." />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "amber" | "green" | "rose";
}) {
  const tones = {
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
  };

  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
    </div>
  );
}

function LoopStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white dark:bg-white dark:text-neutral-950">
        {number}
      </span>
      <div>
        <h3 className="text-sm font-black">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{body}</p>
      </div>
    </div>
  );
}
