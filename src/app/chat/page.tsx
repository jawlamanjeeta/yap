import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import LogoutButton from "@/components/auth/LogoutButton";
import { requireUser } from "@/lib/auth-user";

export default async function ChatPage() {
  const user = await requireUser();

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
        <ChatInterface initialLanguage={user.preferredLanguage} />
      </div>
    </main>
  );
}
