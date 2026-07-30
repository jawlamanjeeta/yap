import { GoogleGenAI } from "@google/genai";

export const geminiFlashModel = "gemini-3.1-flash-lite";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  return new GoogleGenAI({ apiKey });
}
