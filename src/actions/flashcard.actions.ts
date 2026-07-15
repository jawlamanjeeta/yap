"use server";

import { prisma } from "@/lib/db";
import { calculateSM2 } from "@/utils/sm2";

/**
 * Fetches a batch of cards that are currently due for a specific user and deck.
 */
export async function getDueCards(userId: string, deckId: string, limit: number = 20) {
  try {
    const dueCards = await prisma.userCard.findMany({
      where: {
        userId: userId,
        card: {
          deckId: deckId,
        },
        nextReview: {
          lte: new Date(), // Only fetch cards where nextReview is in the past or now
        },
      },
      include: {
        card: true, // Join the actual front/back text from the Card table
      },
      orderBy: {
        nextReview: "asc", // Prioritize the most overdue cards first
      },
      take: limit,
    });

    return { success: true, data: dueCards };
  } catch (error) {
    console.error("Error fetching due cards:", error);
    return { success: false, error: "Failed to fetch due cards." };
  }
}

/**
 * Processes a user's grade (0-5), calculates the new SM-2 intervals, and updates PostgreSQL.
 */
export async function submitCardReview(userCardId: string, quality: number) {
  try {
    // 1. Fetch current SM-2 stats from the database
    const currentRecord = await prisma.userCard.findUnique({
      where: { id: userCardId },
    });

    if (!currentRecord) {
      throw new Error("User card record not found.");
    }

    // 2. Run the pure SM-2 math function
    const { interval, repetition, easeFactor } = calculateSM2(quality, {
      interval: currentRecord.interval,
      repetition: currentRecord.repetition,
      easeFactor: currentRecord.easeFactor,
    });

    // 3. Calculate the exact Date object for the next review
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    // 4. Persist the updated stats to PostgreSQL
    const updatedCard = await prisma.userCard.update({
      where: { id: userCardId },
      data: {
        interval,
        repetition,
        easeFactor,
        nextReview,
      },
    });

    return { success: true, data: updatedCard };
  } catch (error) {
    console.error("Error submitting card review:", error);
    return { success: false, error: "Failed to submit review." };
  }
}