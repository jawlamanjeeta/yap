import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid or missing messages array" }, 
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful language tutor. Respond concisely in the target language. If the user makes a grammatical error, gently correct them in English before continuing the conversation." 
        },
        ...messages
      ],
    });

    return NextResponse.json({ 
      message: response.choices[0].message 
    });
  } catch (error) {
    console.error("Chat routing error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" }, 
      { status: 500 }
    );
  }
}