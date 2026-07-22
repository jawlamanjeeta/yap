import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { defineConfig } from "@prisma/config";

export default defineConfig({
  migrations: {
    seed: "npm exec tsx prisma/seed.ts",
  },
});
