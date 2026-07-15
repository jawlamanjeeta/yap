import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black p-6">
      {/* Navigation & Context Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 mt-4">
        <Link 
          href="/" 
          className="group flex items-center text-sm font-medium text-neutral-500 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Dashboard
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
          AI Conversation
        </span>
      </div>

      {/* The interactive client component */}
      <ChatInterface />
    </main>
  );
}