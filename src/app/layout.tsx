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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[#b8ff4f] selection:text-[#080907]"
      >
        {children}
      </body>
    </html>
  );
}
