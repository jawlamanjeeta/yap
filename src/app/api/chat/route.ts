import { NextResponse } from "next/server";
import { ApiError } from "@google/genai";
import { geminiFlashModel, getGeminiClient } from "@/lib/gemini";
import { estimateCefr } from "@/utils/cefr";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth-user";
import { isLaunchLanguage } from "@/lib/languages";
import { recordUserActivity } from "@/lib/activity";
import { geminiErrorResponse } from "@/lib/gemini-error";

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

async function retryWhenGeminiIsBusy<T>(request: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 503 || attempt === 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }

  throw new Error("Gemini retry loop ended unexpectedly.");
}

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
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const gemini = getGeminiClient();
    const body = (await req.json()) as {
      messages?: unknown;
      language?: string;
      conversationId?: string | null;
      pronunciation?: {
        score?: number;
        label?: string;
        tip?: string;
      };
    };

    if (
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.length > 30 ||
      !body.messages.every(
        (message) => isTutorMessage(message) && message.content.trim().length <= 2000,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid or missing messages array." },
        { status: 400 },
      );
    }

    const targetLanguage = body.language?.trim() || "Spanish";
    if (!isLaunchLanguage(targetLanguage)) {
      return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
    }

    const latestUserMessage = [...body.messages].reverse().find((message) => message.role === "user");
    if (!latestUserMessage) {
      return NextResponse.json({ error: "A learner message is required." }, { status: 400 });
    }

    const existingConversation = body.conversationId
      ? await prisma.conversation.findFirst({
          where: {
            id: body.conversationId,
            userId,
            language: targetLanguage,
          },
        })
      : null;

    if (body.conversationId && !existingConversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    const response = await retryWhenGeminiIsBusy(() => gemini.models.generateContent({
      model: geminiFlashModel,
      contents: body.messages.slice(-20).map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction: [
          `You are a concise ${targetLanguage} conversation tutor.`,
          "Return only valid JSON with keys: reply, correction, grammarNotes, suggestedReply.",
          "reply: one natural tutor response in the target language.",
          "correction: a short English correction of the learner's last message, or 'No major correction.'",
          "grammarNotes: up to three short English notes.",
          "suggestedReply: one short learner response in the target language.",
        ].join(" "),
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            reply: { type: "string" },
            correction: { type: "string" },
            grammarNotes: { type: "array", items: { type: "string" } },
            suggestedReply: { type: "string" },
          },
          required: ["reply", "correction", "grammarNotes", "suggestedReply"],
        },
      },
    }));

    const content = response.text ?? "";
    const tutor = parseTutorResponse(content);
    const cefr = estimateCefr(latestUserMessage?.content ?? "", tutor.grammarNotes.length);
    const conversation =
      existingConversation ??
      (await prisma.conversation.create({
        data: {
          userId,
          language: targetLanguage,
          title: latestUserMessage.content.slice(0, 60),
        },
      }));

    await prisma.$transaction([
      prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: latestUserMessage.content,
          cefrLevel: cefr.level,
          cefrScore: cefr.score,
          pronunciationScore:
            typeof body.pronunciation?.score === "number"
              ? Math.max(0, Math.min(100, Math.round(body.pronunciation.score)))
              : null,
          pronunciationLabel: body.pronunciation?.label?.slice(0, 80),
          pronunciationTip: body.pronunciation?.tip?.slice(0, 240),
        },
      }),
      prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content: tutor.reply,
          correction: tutor.correction,
          grammarNotes: tutor.grammarNotes,
          suggestedReply: tutor.suggestedReply,
        },
      }),
      prisma.languageEnrollment.upsert({
        where: {
          userId_language: {
            userId,
            language: targetLanguage,
          },
        },
        create: {
          userId,
          language: targetLanguage,
          cefrLevel: cefr.level,
          cefrScore: cefr.score,
        },
        update: {
          cefrLevel: cefr.level,
          cefrScore: cefr.score,
        },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    await recordUserActivity(userId, { xp: 5, messages: 1 });

    return NextResponse.json({
      conversationId: conversation.id,
      ...tutor,
      cefr,
    });
  } catch (error) {
    console.error("Gemini chat routing error:", error);
    return geminiErrorResponse(error, "chat");
  }
}
