import { prisma } from "./prisma";

type ActivityInput = {
  xp?: number;
  reviews?: number;
  messages?: number;
};

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function recordUserActivity(userId: string, input: ActivityInput) {
  const today = startOfUtcDay();
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  return prisma.$transaction(async (transaction) => {
    const [user, existingActivity] = await Promise.all([
      transaction.user.findUnique({
        where: { id: userId },
        select: { currentStreak: true, lastPracticeAt: true },
      }),
      transaction.dailyActivity.findUnique({
        where: { userId_date: { userId, date: today } },
      }),
    ]);

    if (!user) throw new Error("Authenticated user not found.");

    const xp = input.xp ?? 0;
    const reviews = input.reviews ?? 0;
    const messages = input.messages ?? 0;

    if (existingActivity) {
      await Promise.all([
        transaction.dailyActivity.update({
          where: { id: existingActivity.id },
          data: {
            xpEarned: { increment: xp },
            reviews: { increment: reviews },
            messages: { increment: messages },
          },
        }),
        transaction.user.update({
          where: { id: userId },
          data: {
            xp: { increment: xp },
            lastPracticeAt: new Date(),
          },
        }),
      ]);
      return;
    }

    const lastPracticeDay = user.lastPracticeAt ? startOfUtcDay(user.lastPracticeAt) : null;
    const nextStreak =
      lastPracticeDay?.getTime() === yesterday.getTime() ? user.currentStreak + 1 : 1;

    await Promise.all([
      transaction.dailyActivity.create({
        data: {
          userId,
          date: today,
          xpEarned: xp,
          reviews,
          messages,
        },
      }),
      transaction.user.update({
        where: { id: userId },
        data: {
          xp: { increment: xp },
          currentStreak: nextStreak,
          lastPracticeAt: new Date(),
        },
      }),
    ]);
  });
}
