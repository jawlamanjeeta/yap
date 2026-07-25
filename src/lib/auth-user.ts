import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { prisma } from "./prisma";

const userSelection = {
  id: true,
  email: true,
  name: true,
  preferredLanguage: true,
  xp: true,
  currentStreak: true,
  lastPracticeAt: true,
} as const;

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: userSelection,
  });
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}
