"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={compact ? "account-logout account-logout-compact" : "account-logout"}
        title="Log out"
      >
        <LogOut aria-hidden="true" />
        <span>Log out</span>
      </button>
    </form>
  );
}
