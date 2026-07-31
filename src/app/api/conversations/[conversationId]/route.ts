import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-user";
import { findConversationForUser } from "@/lib/conversation-access";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { conversationId } = await params;
  const conversation = await findConversationForUser(
    (query) => prisma.conversation.findFirst({
      ...query,
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          correction: true,
          grammarNotes: true,
          suggestedReply: true,
          cefrLevel: true,
          cefrScore: true,
          pronunciationScore: true,
          pronunciationLabel: true,
          pronunciationTip: true,
          createdAt: true,
        },
      },
    },
    }),
    userId,
    conversationId,
  );

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}
