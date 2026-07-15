import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "yap.",
  description: "AI-Powered Spaced-Repetition Language Learning App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-black text-white selection:bg-neutral-800">
        {children}
      </body>
    </html>
  );
}