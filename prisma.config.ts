import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  earlyAccess: true,
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});