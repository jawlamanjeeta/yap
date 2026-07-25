import Image from "next/image";
import Link from "next/link";
import AuthForm from "./AuthForm";

export default function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";

  return (
    <main className="auth-page">
      <Link href="/" className="auth-brand" aria-label="Back to yap home">
        yap<span>.</span>
      </Link>

      <section className="auth-art" aria-hidden="true">
        <p>say it badly.</p>
        <strong>then say it better.</strong>
        <Image
          src="/yap-hero-mascot-stickers.png"
          alt=""
          width={1393}
          height={1034}
          priority
        />
      </section>

      <section className={`auth-panel ${isSignup ? "auth-panel-signup" : ""}`}>
        <p className="auth-kicker">{isSignup ? "Create your account" : "Welcome back, learner"}</p>
        <h1>{isSignup ? "Sign up." : "Keep yapping."}</h1>
        <p className="auth-copy">
          {isSignup
            ? "Create your private learning space and start building a language habit."
            : "Your reviews, conversations, and progress are waiting exactly where you left them."}
        </p>
        <AuthForm mode={mode} />
      </section>
    </main>
  );
}
