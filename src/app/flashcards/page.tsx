import { getDueCards } from "@/actions/flashcard.actions";
import FlashcardDeck from "@/components/flashcards/FlashcardDeck";

export default async function FlashcardsPage() {
  // In a production app, fetch the authenticated user ID here.
  // For this scaffold, we'll assume a placeholder ID or bypass the strict requirement.
  const userId = "placeholder-user-id";
  const deckId = "placeholder-deck-id"; 

  const { success, data, error } = await getDueCards(userId, deckId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      {success && data ? (
        <FlashcardDeck initialQueue={data} />
      ) : (
        <p className="text-red-500">Error: {error}</p>
      )}
    </main>
  );
}