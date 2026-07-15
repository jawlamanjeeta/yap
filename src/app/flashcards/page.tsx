import { getDueCards } from "@/actions/flashcard.actions";
import FlashcardDeck from "@/components/flashcards/FlashcardDeck";

export default async function FlashcardsPage() {
  // In a production application, you will extract the authenticated userId here 
  // via NextAuth/Auth.js. We use placeholders for the initial scaffold.
  const userId = "placeholder-user-id";
  const deckId = "placeholder-deck-id"; 

  const { success, data, error } = await getDueCards(userId, deckId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      {success && data ? (
        <FlashcardDeck initialQueue={data} />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-neutral-400">Failed to load deck session.</p>
          <p className="text-xs text-neutral-600">{error}</p>
        </div>
      )}
    </main>
  );
}