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
      <body className="min-h-screen bg-[#f7f4ef] text-neutral-950 antialiased selection:bg-amber-200 dark:bg-neutral-950 dark:text-white dark:selection:bg-amber-500/30">
        {children}
      </body>
    </html>
  );
}
