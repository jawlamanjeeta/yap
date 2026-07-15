import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth's native Next.js bridge handles all OAuth callbacks automatically
export const { GET, POST } = toNextJsHandler(auth);