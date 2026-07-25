import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Create account | yap.",
};

export default function SignupPage() {
  return <AuthShell mode="signup" />;
}
