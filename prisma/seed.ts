import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing data to prevent unique constraint errors during re-seeding
  await prisma.userCard.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.deck.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create a default Recruiter/Test User
  const user = await prisma.user.create({
    data: {
      email: "recruiter@faang.com",
      name: "Test User",
      passwordHash: await hash("DemoPassword123!", 12),
      xp: 0,
      currentStreak: 0,
      enrollments: {
        create: ["Spanish", "French", "German", "Japanese", "English"].map((language) => ({
          language,
        })),
      },
    },
  });

  // 3. Create a default Spanish Vocabulary Deck
  const deck = await prisma.deck.create({
    data: {
      title: "Core Spanish 101",
      description: "High-frequency words to test the SM-2 algorithm.",
      language: "es",
    },
  });

  // 4. Define the Flashcards
  const initialCards = [
    { frontText: "El perro", backText: "The dog", language: "es" },
    { frontText: "La biblioteca", backText: "The library", language: "es" },
    { frontText: "Siempre", backText: "Always", language: "es" },
    { frontText: "Desayuno", backText: "Breakfast", language: "es" },
    { frontText: "Cansado", backText: "Tired", language: "es" },
  ];

  // 5. Create Cards and link them to the Deck
  for (const card of initialCards) {
    const createdCard = await prisma.card.create({
      data: {
        deckId: deck.id,
        frontText: card.frontText,
        backText: card.backText,
        language: card.language,
      },
    });

    // 6. Initialize SM-2 parameters for the Test User
    // We set nextReview to yesterday so they immediately appear in the due queue.
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.userCard.create({
      data: {
        userId: user.id,
        cardId: createdCard.id,
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        nextReview: yesterday,
      },
    });
  }

  console.log("Database seeding completed successfully.");
  console.log(`Test User ID: ${user.id}`);
  console.log(`Test Deck ID: ${deck.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
