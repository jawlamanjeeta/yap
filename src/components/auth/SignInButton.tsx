"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Github } from "lucide-react";

export default function SignInButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/", // Redirect back to dashboard after login
    });
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isPending}
      className="flex w-full items-center justify-center space-x-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Github className="h-5 w-5" />
      )}
      <span>{isPending ? "Connecting..." : "Continue with GitHub"}</span>
    </button>
  );
}