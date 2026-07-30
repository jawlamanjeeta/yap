import { ApiError } from "@google/genai";
import { NextResponse } from "next/server";

export function geminiErrorResponse(error: unknown, feature: "chat" | "transcription") {
  const fallback =
    feature === "chat"
      ? "The AI tutor is temporarily unavailable."
      : "Speech transcription is temporarily unavailable.";

  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: "The Gemini API key is invalid or does not have access to this model." },
        { status: 503 },
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: "The Gemini API account has reached its current usage limit." },
        { status: 429 },
      );
    }

    if (error.status === 400) {
      return NextResponse.json(
        { error: feature === "transcription" ? "The recording could not be processed." : fallback },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: fallback }, { status: 502 });
  }

  if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
    return NextResponse.json(
      { error: "The server is missing its Gemini API key." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { error: "Could not connect to Gemini. Check the server network and try again." },
    { status: 503 },
  );
}
