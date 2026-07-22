import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { estimateCefr } from "@/utils/cefr";

type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

type TutorResponse = {
  reply: string;
  correction: string;
  grammarNotes: string[];
  suggestedReply: string;
};

function isTutorMessage(message: unknown): message is TutorMessage {
  if (!message || typeof message !== "object") return false;

  const candidate = message as TutorMessage;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

function parseTutorResponse(content: string): TutorResponse {
  try {
    const parsed = JSON.parse(content) as Partial<TutorResponse>;

    return {
      reply: parsed.reply?.trim() || "Good effort. Tell me one more detail.",
      correction: parsed.correction?.trim() || "No major correction.",
      grammarNotes: Array.isArray(parsed.grammarNotes)
        ? parsed.grammarNotes.filter((note): note is string => typeof note === "string").slice(0, 3)
        : [],
      suggestedReply: parsed.suggestedReply?.trim() || "Can you ask me a follow-up question?",
    };
  } catch {
    return {
      reply: content,
      correction: "I could not parse a structured correction for that turn.",
      grammarNotes: [],
      suggestedReply: "Try answering with a full sentence.",
    };
  }
}

export async function POST(req: Request) {
  try {
    const openai = getOpenAIClient();
    const body = (await req.json()) as {
      messages?: unknown;
      language?: string;
    };

    if (!Array.isArray(body.messages) || !body.messages.every(isTutorMessage)) {
      return NextResponse.json(
        { error: "Invalid or missing messages array." },
        { status: 400 },
      );
    }

    const targetLanguage = body.language?.trim() || "Spanish";
    const latestUserMessage = [...body.messages].reverse().find((message) => message.role === "user");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            `You are a concise ${targetLanguage} conversation tutor.`,
            "Return only valid JSON with keys: reply, correction, grammarNotes, suggestedReply.",
            "reply: one natural tutor response in the target language.",
            "correction: a short English correction of the learner's last message, or 'No major correction.'",
            "grammarNotes: up to three short English notes.",
            "suggestedReply: one short learner response in the target language.",
          ].join(" "),
        },
        ...body.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const tutor = parseTutorResponse(content);
    const cefr = estimateCefr(latestUserMessage?.content ?? "", tutor.grammarNotes.length);

    return NextResponse.json({
      ...tutor,
      cefr,
    });
  } catch (error) {
    console.error("Chat routing error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response." },
      { status: 500 },
    );
  }
}
