import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"; // Assumes your prisma singleton is at src/lib/prisma.ts

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", 
  }),
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
  },
});