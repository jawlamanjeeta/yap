"use server";

import { prisma } from "@/lib/prisma";
import { scheduleNextReview } from "@/utils/sm2";
import { getAuthenticatedUserId } from "@/lib/auth-user";
import { recordUserActivity } from "@/lib/activity";

export async function getDueCards(deckId: string, limit = 20) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, error: "Authentication required." };

    const dueCards = await prisma.userCard.findMany({
      where: {
        userId,
        card: { deckId },
        nextReview: { lte: new Date() },
      },
      include: { card: true },
      orderBy: { nextReview: "asc" },
      take: Math.max(1, Math.min(50, limit)),
    });

    return { success: true, data: dueCards };
  } catch (error) {
    console.error("Error fetching due cards:", error);
    return { success: false, error: "Failed to fetch due cards." };
  }
}

export async function submitCardReview(userCardId: string, quality: number) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, error: "Authentication required." };
    if (!Number.isFinite(quality) || quality < 0 || quality > 5) {
      return { success: false, error: "Invalid review quality." };
    }

    const currentRecord = await prisma.userCard.findFirst({
      where: {
        id: userCardId,
        userId,
      },
    });

    if (!currentRecord) {
      return { success: false, error: "Card not found for this user." };
    }

    const { interval, repetition, easeFactor, nextReview } = scheduleNextReview(quality, {
      interval: currentRecord.interval,
      repetition: currentRecord.repetition,
      easeFactor: currentRecord.easeFactor,
    });

    const updatedCard = await prisma.$transaction(async (transaction) => {
      const card = await transaction.userCard.update({
        where: { id: userCardId },
        data: {
          interval,
          repetition,
          easeFactor,
          nextReview,
        },
      });

      await transaction.reviewLog.create({
        data: {
          userId,
          userCardId,
          quality: Math.round(quality),
          intervalBefore: currentRecord.interval,
          intervalAfter: interval,
        },
      });

      return card;
    });

    await recordUserActivity(userId, {
      xp: quality >= 3 ? quality * 10 : 5,
      reviews: 1,
    });

    return { success: true, data: updatedCard };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false, error: "Failed to submit review." };
  }
}
