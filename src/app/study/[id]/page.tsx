import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    <main className="min-h-screen bg-[#f7f4ef] p-4 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:p-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <LogoutButton compact />
        </div>

        <header className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-600 dark:text-amber-300">
                SM-2 review session
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">{deck.title}</h1>
              {deck.description && (
                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  {deck.description}
                </p>
              )}
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {initialQueue.length} due / {deck._count.cards} total
            </span>
          </div>
        </header>

        <section className="flex justify-center">
          <FlashcardDeck initialQueue={initialQueue} />
        </section>
      </div>
    </main>
  );
}
