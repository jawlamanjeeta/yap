import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = Boolean(auth?.user);
      const isProtected =
        nextUrl.pathname.startsWith("/chat") || nextUrl.pathname.startsWith("/study");
      const isAuthPage =
        nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");

      if (isProtected) return isAuthenticated;
      if (isAuthPage && isAuthenticated) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
