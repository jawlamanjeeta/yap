import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "yap.",
  description: "Spaced-repetition flashcards and AI speaking practice for language learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[#bff6df] selection:text-[#10201f] dark:bg-[#071614] dark:text-[#f4fff9] dark:selection:bg-[#2563eb]/40">
        {children}
      </body>
    </html>
  );
}
