import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { loadEnvConfig } from "@next/env";
import { launchLanguages } from "../src/lib/languages";
import { starterDecks } from "./starter-decks";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const configuredLanguages = new Set(launchLanguages.map((language) => language.label));
  const seededLanguages = new Set(starterDecks.map((deck) => deck.language));

  if (
    configuredLanguages.size !== seededLanguages.size ||
    Array.from(configuredLanguages).some((language) => !seededLanguages.has(language))
  ) {
    throw new Error("Chat languages and starter deck languages must stay in sync.");
  }

  const demoPasswordHash = await hash("DemoPassword123!", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "recruiter@faang.com" },
    update: {},
    create: {
      email: "recruiter@faang.com",
      name: "Test User",
      passwordHash: demoPasswordHash,
    },
  });

  const allCardIds: string[] = [];

  for (const starterDeck of starterDecks) {
    const existingDeck = await prisma.deck.findFirst({
      where: { language: starterDeck.languageCode },
    });

    if (existingDeck?.title === "Core Spanish 101") {
      await prisma.card.deleteMany({
        where: {
          deckId: existingDeck.id,
          frontText: {
            in: ["El perro", "La biblioteca", "Siempre", "Desayuno", "Cansado"],
          },
        },
      });
    }

    const deck = existingDeck
      ? await prisma.deck.update({
          where: { id: existingDeck.id },
          data: {
            title: starterDeck.title,
            description: starterDeck.description,
          },
        })
      : await prisma.deck.create({
          data: {
            title: starterDeck.title,
            description: starterDeck.description,
            language: starterDeck.languageCode,
          },
        });

    for (const starterCard of starterDeck.cards) {
      const existingCard = await prisma.card.findFirst({
        where: {
          deckId: deck.id,
          frontText: starterCard.frontText,
        },
      });

      const card = existingCard
        ? await prisma.card.update({
            where: { id: existingCard.id },
            data: {
              backText: starterCard.backText,
              language: starterDeck.languageCode,
            },
          })
        : await prisma.card.create({
            data: {
              deckId: deck.id,
              frontText: starterCard.frontText,
              backText: starterCard.backText,
              language: starterDeck.languageCode,
            },
          });

      allCardIds.push(card.id);
    }
  }

  const users = await prisma.user.findMany({ select: { id: true } });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  for (const user of users) {
    await prisma.languageEnrollment.createMany({
      data: starterDecks.map((deck) => ({
        userId: user.id,
        language: deck.language,
      })),
      skipDuplicates: true,
    });

    await prisma.userCard.createMany({
      data: allCardIds.map((cardId) => ({
        userId: user.id,
        cardId,
        nextReview: yesterday,
      })),
      skipDuplicates: true,
    });
  }

  console.log("Database seeding completed successfully.");
  console.log(`Starter decks: ${starterDecks.length}`);
  console.log(`Starter cards: ${allCardIds.length}`);
  console.log(`Demo user ID: ${demoUser.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
