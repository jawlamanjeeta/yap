"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { signIn, signOut } from "../../auth";
import { prisma } from "@/lib/prisma";
import { isLaunchLanguage, launchLanguages } from "@/lib/languages";

export type AuthActionState = {
  error?: string;
  fields?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    preferredLanguage?: string[];
  };
};

const loginSchema = z.object({
  email: z.email("Enter a valid email address.").transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
});

const signupSchema = loginSchema
  .extend({
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(50),
    confirmPassword: z.string(),
    preferredLanguage: z
      .string()
      .refine(isLaunchLanguage, "Choose one of the five available languages."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function loginAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { fields: result.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      ...result.data,
      redirectTo: "/",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Email or password is incorrect."
            : "We could not sign you in. Please try again.",
      };
    }
    throw error;
  }
}

export async function signupAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    preferredLanguage: formData.get("preferredLanguage"),
  });

  if (!result.success) {
    return { fields: result.error.flatten().fieldErrors };
  }

  const { name, email, password, preferredLanguage } = result.data;

  try {
    const passwordHash = await hash(password, 12);

    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: {
          name,
          email,
          passwordHash,
          preferredLanguage,
        },
      });

      await transaction.languageEnrollment.createMany({
        data: launchLanguages.map((language) => ({
          userId: user.id,
          language: language.label,
        })),
      });

      const cards = await transaction.card.findMany({ select: { id: true } });
      if (cards.length > 0) {
        await transaction.userCard.createMany({
          data: cards.map((card) => ({
            userId: user.id,
            cardId: card.id,
          })),
        });
      }
    });

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return {};
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An account already exists for that email." };
    }
    if (error instanceof AuthError) {
      return { error: "Your account was created, but sign-in failed. Try logging in." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
