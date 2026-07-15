import { create } from 'zustand';
import { submitCardReview } from '@/actions/flashcard.actions';

// Defines the shape of the data returned by our getDueCards Server Action
export interface QueuedCard {
  id: string; // The UserCard ID
  interval: number;
  repetition: number;
  easeFactor: number;
  card: {
    id: string;
    frontText: string;
    backText: string;
    language: string;
  };
}

interface SessionState {
  queue: QueuedCard[];
  currentIndex: number;
  sessionXp: number; // Gamification tracking for the current session
  
  // Actions
  setQueue: (cards: QueuedCard[]) => void;
  gradeCurrentCard: (quality: number) => Promise<void>;
  isFinished: () => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  sessionXp: 0,

  // Initialize a new study session
  setQueue: (cards) => set({ 
    queue: cards, 
    currentIndex: 0, 
    sessionXp: 0 
  }),

  // The core optimistic update function
  gradeCurrentCard: async (quality: number) => {
    const { queue, currentIndex, sessionXp } = get();
    
    // Prevent out-of-bounds execution
    if (currentIndex >= queue.length) return;

    const currentCard = queue[currentIndex];
    
    // Calculate XP gamification (e.g., higher quality = more XP)
    const xpGained = quality > 2 ? 10 * quality : 5;

    // 1. Optimistic UI Update: Instantly advance the queue and grant XP
    set({
      currentIndex: currentIndex + 1,
      sessionXp: sessionXp + xpGained,
    });

    // 2. Background Database Sync: Fire and forget the server action
    try {
      const result = await submitCardReview(currentCard.id, quality);
      
      if (!result.success) {
        // In a production environment, you would trigger a toast notification 
        // to inform the user of network failure, and potentially rollback the state.
        console.error("Background sync failed for card:", currentCard.id, result.error);
      }
    } catch (error) {
      console.error("Network error during card submission:", error);
    }
  },

  // Helper to check if the user has completed the queue
  isFinished: () => {
    const { queue, currentIndex } = get();
    return queue.length > 0 && currentIndex >= queue.length;
  }
}));