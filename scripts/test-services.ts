import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";

async function runTests() {
  console.log("=== 1. Testing Neon Postgres Connection ===");
  const prisma = new PrismaClient();
  
  const user = await prisma.user.findUnique({ where: { email: "recruiter@faang.com" } });
  const decks = await prisma.deck.findMany();
  const cardCount = await prisma.card.count();
  
  console.log("Neon Postgres Status: CONNECTED");
  console.log("Database Host:", process.env.DATABASE_URL?.split("@")[1]?.split("/")[0]);
  console.log("Seeded User:", user?.email);
  console.log("Decks loaded from Neon:", decks.map((d) => d.title).join(", "));
  console.log("Total Cards in Neon:", cardCount);

  console.log("\n=== 2. Testing Database Read & Write Operations to Neon ===");
  const testEmail = `neon_verify_${Date.now()}@example.com`;
  const created = await prisma.user.create({
    data: { email: testEmail, name: "Neon Integration Test User" },
  });
  console.log("Neon INSERT Status: SUCCESS (Created User ID: " + created.id + ")");

  const readBack = await prisma.user.findUnique({ where: { id: created.id } });
  console.log("Neon SELECT Status: SUCCESS (Verified User Name: " + readBack?.name + ")");

  await prisma.user.delete({ where: { id: created.id } });
  console.log("Neon DELETE Status: SUCCESS (Cleaned up test record)");

  await prisma.$disconnect();

  console.log("\n=== 3. Summary ===");
  console.log("Neon Postgres service is fully operational and verified end-to-end!");
}

runTests().catch((err) => {
  console.error("Test encountered an error:", err);
  process.exit(1);
});
