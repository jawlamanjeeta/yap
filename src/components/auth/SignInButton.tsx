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
    
      {isPending ? (
        
      ) : (
        
      )}
      {isPending ? "Connecting..." : "Continue with GitHub"}
    
  );
}