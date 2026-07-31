import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-user";
import { getLaunchLanguage, isLaunchLanguage } from "@/lib/languages";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      language: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true },
      },
    },
  });

  return NextResponse.json({
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      language: conversation.language,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messageCount: conversation._count.messages,
      lastMessage: conversation.messages[0]?.content ?? null,
    })),
  });
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await req.json()) as { language?: unknown };
  if (typeof body.language !== "string" || !isLaunchLanguage(body.language)) {
    return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
  }

  const language = getLaunchLanguage(body.language);
  const conversation = await prisma.conversation.create({
    data: {
      userId,
      language: language.label,
      messages: {
        create: {
          role: "assistant",
          content: language.greeting,
          suggestedReply: language.suggestedReply,
        },
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json({ conversation }, { status: 201 });
}
