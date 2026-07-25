import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-user";
import FlashcardDeck from "@/components/flashcards/FlashcardDeck";
import LogoutButton from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await requireUser();

  const deck = await prisma.deck.findUnique({
    where: { id },
    include: {
      _count: {
        select: { cards: true },
      },
    },
  });

  if (!deck) {
    notFound();
  }

  const languageNames: Record<string, string> = {
    de: "German",
    en: "English",
    es: "Spanish",
    fr: "French",
    ja: "Japanese",
  };
  const languageName = languageNames[deck.language] ?? deck.language.toUpperCase();

  const dueCards = await prisma.userCard.findMany({
    where: {
      userId: user.id,
      card: { deckId: id },
      nextReview: { lte: new Date() },
    },
    include: {
      card: true,
    },
    orderBy: {
      nextReview: "asc",
    },
  });

  const initialQueue = dueCards.map((userCard) => ({
    id: userCard.id,
    interval: userCard.interval,
    repetition: userCard.repetition,
    easeFactor: userCard.easeFactor,
    card: {
      id: userCard.card.id,
      frontText: userCard.card.frontText,
      backText: userCard.card.backText,
      language: userCard.card.language,
    },
  }));

  return (
    <main className="study-page" data-language={deck.language}>
      <div className="study-background-word" aria-hidden="true">
        {languageName}
      </div>
      <div className="study-doodle study-doodle-left" aria-hidden="true">
        <Sparkles />
      </div>
      <div className="study-doodle study-doodle-right" aria-hidden="true">
        say it!
      </div>

      <div className="study-shell">
        <nav className="study-nav" aria-label="Study navigation">
          <Link
            href="/"
            className="study-back"
          >
            <ArrowLeft aria-hidden="true" />
            Word collection
          </Link>
          <LogoutButton compact />
        </nav>

        <header className="study-header">
          <div className="study-tape" aria-hidden="true" />
          <div className="study-header-main">
            <div>
              <p className="study-kicker">
                <BookOpen aria-hidden="true" />
                {languageName} starter deck
              </p>
              <h1>{deck.title}</h1>
              {deck.description && (
                <p className="study-description">
                  {deck.description}
                </p>
              )}
            </div>
            <div className="study-count">
              <strong>{initialQueue.length}</strong>
              <span>due now</span>
              <small>{deck._count.cards} cards total</small>
            </div>
          </div>
        </header>

        <section className="study-session">
          <FlashcardDeck initialQueue={initialQueue} language={languageName} />
        </section>
      </div>
    </main>
  );
}
