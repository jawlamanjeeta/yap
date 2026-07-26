import OpenAI from "openai";
import { NextResponse } from "next/server";

export function openAIErrorResponse(error: unknown, feature: "chat" | "transcription") {
  const fallback =
    feature === "chat"
      ? "The AI tutor is temporarily unavailable."
      : "Speech transcription is temporarily unavailable.";

  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return NextResponse.json(
        { error: "The OpenAI API key is invalid or no longer active." },
        { status: 503 },
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: "The OpenAI account has reached its current usage limit." },
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

  if (error instanceof OpenAI.APIConnectionError) {
    return NextResponse.json(
      { error: "Could not connect to OpenAI. Check the server network and try again." },
      { status: 503 },
    );
  }

  return NextResponse.json({ error: fallback }, { status: 500 });
}
