"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import {
  loginAction,
  signupAction,
  type AuthActionState,
} from "@/actions/auth.actions";

const initialState: AuthActionState = {};

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="auth-form">
      {state.error && <p className="auth-form-error">{state.error}</p>}

      {isSignup && (
        <Field
          id="name"
          name="name"
          label="Your name"
          autoComplete="name"
          icon={UserRound}
          errors={state.fields?.name}
        />
      )}

      <Field
        id="email"
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
        icon={Mail}
        errors={state.fields?.email}
      />

      <Field
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        icon={LockKeyhole}
        errors={state.fields?.password}
      />

      {isSignup && (
        <Field
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          icon={LockKeyhole}
          errors={state.fields?.confirmPassword}
        />
      )}

      <SubmitButton label={isSignup ? "Create my account" : "Enter yap"} />

      <p className="auth-switch">
        {isSignup ? "Already learning with us?" : "New around here?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  errors,
  ...inputProps
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  icon: typeof Mail;
  errors?: string[];
}) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <div>
        <Icon aria-hidden="true" />
        <input id={id} required {...inputProps} />
      </div>
      {errors?.map((error) => (
        <small key={error}>{error}</small>
      ))}
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="auth-submit" disabled={pending}>
      {pending ? <LoaderCircle className="auth-spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
      {pending ? "One moment" : label}
    </button>
  );
}
