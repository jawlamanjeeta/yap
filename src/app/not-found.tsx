import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800">
          <SearchX className="h-8 w-8 text-neutral-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            We couldn&apos;t find the page or flashcard deck you were looking for.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
