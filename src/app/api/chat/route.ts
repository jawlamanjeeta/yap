import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, language = "Spanish" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    // 1. Construct the System Prompt
    // This strictly confines GPT-4o to act as a language tutor, enforcing short, 
    // conversational responses and inline grammatical corrections.
    const systemMessage = {
      role: "system",
      content: `You are an expert ${language} language tutor. 
      The user is practicing their spoken ${language}. 
      Rules:
      1. Keep your responses concise (1-3 sentences) to simulate a real verbal conversation.
      2. If the user makes a grammatical error, politely provide a quick correction in English in parentheses, then continue the conversation in ${language}.
      3. Adapt your vocabulary to the user's apparent CEFR level.
      4. Never break character.`,
    };

    const apiMessages = [systemMessage, ...messages];

    // 2. Initiate the GPT-4o Stream
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: apiMessages,
      stream: true,
      temperature: 0.7, // Balances creativity with predictable grammar
    });

    // 3. Create a standard Web ReadableStream to pipe the data to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("Stream processing error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    // 4. Return the stream directly to the browser
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("GPT-4o API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate conversation response." },
      { status: 500 }
    );
  }
}