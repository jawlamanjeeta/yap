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
    <main className="min-h-screen bg-[#080907] text-[#f8efd0]">
      <LandingHero dueCount={dueCount} reviewedPercent={reviewProgress} totalCards={totalCards} />

      <div className="relative overflow-hidden px-4 pb-14 pt-3 sm:px-6 sm:py-14 lg:px-8">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(248,239,208,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(248,239,208,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8ff4f]/60 to-transparent" />
        <section
          id="decks"
          className="relative mx-auto grid w-full max-w-6xl scroll-mt-8 gap-5 lg:grid-cols-[0.68fr_0.32fr]"
        >
          <div className="deck-reveal">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#55d7ff]">
                  Learning cockpit
                </p>
                <h2 className="font-display mt-2 text-3xl font-black text-[#f8efd0]">
                  Vocabulary decks
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#f8efd0]/58">
                  Pick a deck and review the cards that are due.
                </p>
              </div>
              <span className="rounded-lg border border-[#b8ff4f]/25 bg-[#b8ff4f]/12 px-3 py-1 text-xs font-black text-[#b8ff4f]">
                {totalCards} cards
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {decks.map((deck) => (
                <Link
                  key={deck.id}
                  href={`/study/${deck.id}`}
                  className="deck-reveal group rounded-lg border border-[#f8efd0]/12 bg-[#f8efd0]/7 p-4 shadow-[6px_6px_0_rgba(248,239,208,0.08)] backdrop-blur transition hover:-translate-y-1 hover:border-[#b8ff4f]/70 hover:bg-[#b8ff4f]/10"
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd84d] text-[#080907] shadow-[4px_4px_0_#ff6b8a]">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#f8efd0]/38 transition group-hover:translate-x-1 group-hover:text-[#b8ff4f]" />
                  </div>
                  <h3 className="font-display text-xl font-black text-[#f8efd0]">{deck.title}</h3>
                  {deck.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#f8efd0]/55">
                      {deck.description}
                    </p>
                  )}
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#55d7ff]">
                    {deck._count.cards} cards
                  </p>
                </Link>
              ))}

              {decks.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#f8efd0]/18 bg-[#f8efd0]/6 p-6 text-sm text-[#f8efd0]/58">
                  No decks found yet. Seed the database to load the starter Spanish deck.
                </div>
              )}
            </div>
          </div>

          <aside className="deck-reveal">
            <div className="mb-5 grid gap-3">
              <StatCard icon={CalendarClock} label="Due today" value={dueCount.toString()} tone="gold" />
              <StatCard icon={Trophy} label="Reviewed" value={`${reviewProgress}%`} tone="mint" />
              <StatCard icon={Flame} label="Streak" value={`${user?.currentStreak ?? 0} days`} tone="coral" />
            </div>
            <h2 className="font-display text-xl font-black text-[#f8efd0]">Today&apos;s loop</h2>
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
    gold: "bg-[#ffd84d] text-[#080907]",
    mint: "bg-[#b8ff4f] text-[#080907]",
    coral: "bg-[#ff6b8a] text-[#080907]",
  };

  return (
    <div className="deck-reveal rounded-lg border border-[#f8efd0]/12 bg-[#f8efd0]/7 p-4 shadow-[6px_6px_0_rgba(248,239,208,0.08)] backdrop-blur">
      <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="font-display text-2xl font-black text-[#f8efd0]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#f8efd0]/45">
        {label}
      </p>
    </div>
  );
}

function LoopStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f8efd0] text-xs font-black text-[#080907]">
        {number}
      </span>
      <div>
        <h3 className="font-display text-sm font-black text-[#f8efd0]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#f8efd0]/55">{body}</p>
      </div>
    </div>
  );
}
