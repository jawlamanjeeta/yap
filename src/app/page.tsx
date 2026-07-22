import Link from "next/link";
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  Flame,
  type LucideIcon,
  Trophy,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import LandingHero from "@/components/landing/LandingHero";

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
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] dark:bg-[#071614] dark:text-[#f4fff9]">
      <LandingHero dueCount={dueCount} reviewedPercent={reviewProgress} totalCards={totalCards} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-14 sm:px-6 lg:px-8">
        <section
          id="decks"
          className="grid scroll-mt-8 gap-4 lg:grid-cols-[0.65fr_0.35fr]"
        >
          <div className="rounded-lg border border-[#b7e3d6] bg-white/80 p-5 shadow-sm shadow-[#00a67e]/10 backdrop-blur dark:border-white/10 dark:bg-white/10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2563eb]">
                  Learning cockpit
                </p>
                <h2 className="font-display mt-2 text-2xl font-black">Vocabulary decks</h2>
                <p className="mt-1 text-sm text-[#55716c] dark:text-[#b7e3d6]">
                  Pick a deck and review the cards that are due.
                </p>
              </div>
              <span className="rounded-lg bg-[#dff7ef] px-3 py-1 text-xs font-bold text-[#007f61] dark:bg-[#00a67e]/20 dark:text-[#bff6df]">
                {totalCards} cards
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {decks.map((deck) => (
                <Link
                  key={deck.id}
                  href={`/study/${deck.id}`}
                  className="group rounded-lg border border-[#cbe8df] bg-white/72 p-4 transition hover:border-[#00a67e] hover:bg-[#ecfff8] dark:border-white/10 dark:bg-white/5 dark:hover:border-[#00a67e]/70 dark:hover:bg-[#00a67e]/10"
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dbeafe] text-[#2563eb] dark:bg-[#2563eb]/20 dark:text-[#bfd7ff]">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#6a8782] transition group-hover:translate-x-0.5 group-hover:text-[#ff4d6d]" />
                  </div>
                  <h3 className="font-display font-black">{deck.title}</h3>
                  {deck.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#55716c] dark:text-[#b7e3d6]">
                      {deck.description}
                    </p>
                  )}
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#6a8782]">
                    {deck._count.cards} cards
                  </p>
                </Link>
              ))}

              {decks.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#94cfc0] p-6 text-sm text-[#55716c] dark:border-[#00a67e]/40 dark:text-[#b7e3d6]">
                  No decks found yet. Seed the database to load the starter Spanish deck.
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-lg border border-[#b7e3d6] bg-white/80 p-5 shadow-sm shadow-[#2563eb]/10 backdrop-blur dark:border-white/10 dark:bg-white/10">
            <div className="mb-5 grid gap-3">
              <StatCard icon={CalendarClock} label="Due today" value={dueCount.toString()} tone="gold" />
              <StatCard icon={Trophy} label="Reviewed" value={`${reviewProgress}%`} tone="mint" />
              <StatCard icon={Flame} label="Streak" value={`${user?.currentStreak ?? 0} days`} tone="coral" />
            </div>
            <h2 className="font-display text-lg font-black">Today&apos;s loop</h2>
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
  tone: "gold" | "mint" | "coral";
}) {
  const tones = {
    gold: "bg-[#fff1b6] text-[#9a6b00] dark:bg-[#f7b801]/20 dark:text-[#ffe9a3]",
    mint: "bg-[#dff7ef] text-[#007f61] dark:bg-[#00a67e]/20 dark:text-[#bff6df]",
    coral: "bg-[#ffe1e7] text-[#d9264e] dark:bg-[#ff4d6d]/20 dark:text-[#ffc1cc]",
  };

  return (
    <div className="rounded-lg border border-[#cbe8df] bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="font-display text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#55716c] dark:text-[#b7e3d6]">
        {label}
      </p>
    </div>
  );
}

function LoopStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#10201f] text-xs font-black text-white dark:bg-[#f4fff9] dark:text-[#10201f]">
        {number}
      </span>
      <div>
        <h3 className="font-display text-sm font-black">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#55716c] dark:text-[#b7e3d6]">{body}</p>
      </div>
    </div>
  );
}
