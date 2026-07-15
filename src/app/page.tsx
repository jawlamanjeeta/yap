import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Mic, Plus } from "lucide-react";
import SignInButton from "@/components/auth/SignInButton";

export default async function DashboardPage() {
  // 1. Await Next.js 16/15 headers and validate the active Better Auth session
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  // 2. Unauthenticated State: Minimal Login Gate
  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800">
            <Mic className="h-8 w-8 text-neutral-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Vocalize</h1>
            <p className="text-neutral-500 text-sm">
              Master languages through AI conversation and spaced repetition.
            </p>
          </div>
          <SignInButton />
        </div>
      </main>
    );
  }

  // 3. Authenticated State: Fetch User's Decks from the database
  const decks = await prisma.deck.findMany({
    include: {
      _count: {
        select: { cards: true }
      }
    }
  });

  return (
    <main className="flex min-h-screen flex-col bg-black p-6 text-white">
      <div className="mx-auto w-full max-w-4xl mt-12 space-y-8">
        {/* Dashboard Header */}
        <header className="flex items-center justify-between border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Decks</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Welcome back, {session.user.name}
            </p>
          </div>
          <Link 
            href="/chat" 
            className="flex items-center space-x-2 rounded-lg border border-neutral-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-900"
          >
            <Mic className="h-4 w-4" />
            <span>Practice Speaking</span>
          </Link>
        </header>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Link 
              key={deck.id} 
              href={`/study/${deck.id}`}
              className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-900"
            >
              <div className="space-y-3">
                <BookOpen className="h-6 w-6 text-neutral-500 group-hover:text-white transition-colors" />
                <h3 className="font-semibold tracking-tight">{deck.title}</h3>
                {deck.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {deck.description}
                  </p>
                )}
              </div>
              <div className="mt-6 text-xs font-medium text-neutral-600">
                {deck._count.cards} Cards
              </div>
            </Link>
          ))}

          {/* Create New Deck Placeholder */}
          <button className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 text-neutral-500 transition-colors hover:border-neutral-600 hover:bg-neutral-900 hover:text-white">
            <Plus className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Create New Deck</span>
          </button>
        </div>
      </div>
    </main>
  );
}