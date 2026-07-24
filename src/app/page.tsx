import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ChevronRight,
  Flame,
  MessageCircleMore,
  Mic,
  Sparkles,
  Trophy,
  Volume2,
  type LucideIcon,
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
    <main className="landing-page">
      <LandingHero />

      <section id="how-it-works" className="story-section">
        <div className="story-heading deck-reveal">
          <p>Inside the yap studio / 01</p>
          <h2>
            Practice that feels
            <span>alive.</span>
          </h2>
          <div className="story-intro">
            <Sparkles aria-hidden="true" />
            <p>
              Every review is timed to your memory. Every conversation bends around the words
              you&apos;re learning right now.
            </p>
          </div>
        </div>

        <div className="practice-window deck-reveal">
          <div className="practice-window-bar">
            <span>yap / speaking room</span>
            <div aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="practice-copy">
            <p className="practice-index">01 / SAY IT</p>
            <h3>Turn passive words into real conversation.</h3>
            <p>
              Your AI partner meets you at your level, keeps the dialogue natural, and saves the
              corrections until they&apos;re actually useful.
            </p>
            <Link href="/chat">
              Enter the speaking room
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="practice-stage" aria-label="Pronunciation feedback preview">
            <div className="practice-sun" aria-hidden="true" />
            <p className="practice-word">bonjour</p>
            <div className="practice-wave" aria-hidden="true">
              {[42, 72, 50, 88, 64, 96, 58, 78, 46, 70, 38].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="practice-score">
              <span>pronunciation</span>
              <strong>91</strong>
              <small>/100</small>
            </div>
            <div className="practice-feedback">
              <Volume2 aria-hidden="true" />
              <span>Beautiful rhythm. Soften the final “r”.</span>
            </div>
          </div>

          <div className="practice-sidebar">
            <div>
              <span>session</span>
              <strong>04:32</strong>
            </div>
            <div>
              <span>level</span>
              <strong>B1</strong>
            </div>
            <div>
              <span>new words</span>
              <strong>07</strong>
            </div>
          </div>
        </div>

        <div className="feature-ribbon deck-reveal">
          <Feature icon={BookOpen} index="01" title="Recall" copy="Smart reviews return before a word slips away." />
          <Feature icon={Mic} index="02" title="Speak" copy="Use every word in a conversation that feels human." />
          <Feature
            icon={MessageCircleMore}
            index="03"
            title="Refine"
            copy="Get gentle grammar and pronunciation notes in context."
          />
        </div>
      </section>

      <section id="decks" className="decks-section">
        <div className="decks-heading deck-reveal">
          <p>Your word collection / 02</p>
          <h2>
            Keep the words
            <span>you love.</span>
          </h2>
          <p className="decks-heading-copy">
            Pick up where your memory needs you. The schedule is handled; you only have to show
            up and say something.
          </p>
        </div>

        <div className="deck-layout">
          <div className="deck-list">
            {decks.map((deck, index) => (
              <Link
                key={deck.id}
                href={`/study/${deck.id}`}
                className="deck-item deck-reveal"
              >
                <span className="deck-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{deck.title}</h3>
                  <p>{deck.description ?? "A fresh set of words ready for practice."}</p>
                </div>
                <span className="deck-count">{deck._count.cards} cards</span>
                <span className="deck-arrow">
                  <ChevronRight aria-hidden="true" />
                </span>
              </Link>
            ))}

            {decks.length === 0 && (
              <div className="deck-empty deck-reveal">
                Seed the database to load your first language deck.
              </div>
            )}
          </div>

          <aside className="progress-poster deck-reveal">
            <p className="progress-kicker">Today at yap.</p>
            <h3>A little every day gets loud.</h3>
            <div className="progress-stats">
              <ProgressStat
                icon={CalendarClock}
                label="Due today"
                value={dueCount.toString()}
              />
              <ProgressStat icon={Trophy} label="Reviewed" value={`${reviewProgress}%`} />
              <ProgressStat
                icon={Flame}
                label="Current streak"
                value={`${user?.currentStreak ?? 0} days`}
              />
            </div>
            <Link href="/chat">
              Practice now
              <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  index,
  title,
  copy,
}: {
  icon: LucideIcon;
  index: string;
  title: string;
  copy: string;
}) {
  return (
    <article>
      <div>
        <span>{index}</span>
        <Icon aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

function ProgressStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <Icon aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
