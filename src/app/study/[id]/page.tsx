import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FlashcardDeck from "@/components/FlashcardDeck";

export default async function StudyPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Next.js 15 requirement: Await the dynamic URL parameters
  const { id } = await params;

  // 2. Validate the Better Auth session
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect("/"); // Kick unauthenticated users back to the login gate
  }

  // 3. Fetch the Deck, Cards, and the User's SM-2 Statistics
  const deck = await prisma.deck.findUnique({
    where: { id },
    include: {
      cards: {
        include: {
          // Fetch the statistical record (interval, easeFactor) specific to this user
          userCards: {
            where: { userId: session.user.id }
          }
        }
      }
    }
  });

  // 4. Handle invalid URLs gracefully using the not-found.tsx fallback
  if (!deck) {
    notFound();
  }

  // 5. Mount the interactive Client Component
  return (
    <main className="flex min-h-screen flex-col bg-black p-6 text-white">
      <div className="mx-auto w-full max-w-3xl mt-12 space-y-8">
        <header className="border-b border-neutral-800 pb-6">
          <h1 className="text-2xl font-bold">{deck.title}</h1>
          {deck.description && (
            <p className="text-sm text-neutral-500 mt-1">
              {deck.description}
            </p>
          )}
        </header>
        
        {/* Inject the data into your Framer Motion hardware-accelerated UI */}
        <FlashcardDeck 
          cards={deck.cards} 
          deckId={deck.id} 
          userId={session.user.id} 
        />
      </div>
    </main>
  );
}