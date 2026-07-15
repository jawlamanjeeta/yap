import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-black">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          yap<span className="text-neutral-500">.</span>
        </h1>
        <p className="text-sm text-neutral-400 max-w-xs mx-auto">
          Master languages through spaced repetition and raw conversation practice.
        </p>
        
        <div className="flex flex-col gap-3 pt-4">
          <Link 
            href="/flashcards" 
            className="w-full py-3 px-4 bg-white text-black text-sm font-medium rounded hover:bg-neutral-200 transition-colors duration-200"
          >
            Start Flashcards
          </Link>
          <Link 
            href="/chat" 
            className="w-full py-3 px-4 bg-black border border-neutral-800 text-white text-sm font-medium rounded hover:bg-neutral-900 transition-colors duration-200"
          >
            Practice Speaking
          </Link>
        </div>
      </div>
    </main>
  );
}