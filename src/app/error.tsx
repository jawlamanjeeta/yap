"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a production app, you would log this to Sentry or Datadog here
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          {error.message || "An unexpected error occurred while loading this view."}
        </p>
        <button
          onClick={() => reset()}
          className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}