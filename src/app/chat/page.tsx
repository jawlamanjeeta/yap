import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import LogoutButton from "@/components/auth/LogoutButton";
import { requireUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export default async function ChatPage() {
  const user = await requireUser();
  const [latestConversation, recentConversations] = await Promise.all([
    prisma.conversation.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        language: true,
        title: true,
        updatedAt: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true },
        },
      },
    }),
  ]);

  const initialConversation = latestConversation
    ? {
        id: latestConversation.id,
        language: latestConversation.language,
        messages: latestConversation.messages.map((message) => ({
          role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: message.content,
          correction: message.correction ?? undefined,
          grammarNotes: Array.isArray(message.grammarNotes)
            ? message.grammarNotes.filter((note): note is string => typeof note === "string")
            : undefined,
          suggestedReply: message.suggestedReply ?? undefined,
        })),
      }
    : undefined;

  return (
    <main className="chat-page">
      <div className="chat-page-word" aria-hidden="true">speak</div>
      <span className="chat-page-spark chat-page-spark-one" aria-hidden="true">✦</span>
      <span className="chat-page-spark chat-page-spark-two" aria-hidden="true">✦</span>

      <div className="chat-shell">
        <nav className="chat-nav" aria-label="Conversation navigation">
          <Link
            href="/#decks"
            className="chat-back"
          >
            <ArrowLeft aria-hidden="true" />
            Word collection
          </Link>
          <div className="chat-account">
            <Sparkles aria-hidden="true" />
            <span>{user.name ?? "Learner"}</span>
            <LogoutButton compact />
          </div>
        </nav>
        <ChatInterface
          initialLanguage={user.preferredLanguage}
          initialConversation={initialConversation}
          recentConversations={recentConversations.map((conversation) => ({
            id: conversation.id,
            language: conversation.language,
            title: conversation.title,
            lastMessage: conversation.messages[0]?.content ?? null,
          }))}
        />
      </div>
    </main>
  );
}
