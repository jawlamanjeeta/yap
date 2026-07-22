import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] p-4 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link 
          href="/" 
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <ChatInterface />
      </div>
    </main>
  );
}
