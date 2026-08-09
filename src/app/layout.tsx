import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyArcana — Capstones",
  description: "Four curricular levels. Thirteen capstones. One defensible platform. An applied-project and capstone system with a governed multi-agent AI operations harness.",
  keywords: ["PyArcana", "capstone", "curriculum", "multi-agent", "RAG", "responsible AI", "entity resolution"],
  authors: [{ name: "PyArcana" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "PyArcana — Capstones",
    description: "Four curricular levels. Thirteen capstones. One defensible platform.",
    siteName: "PyArcana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyArcana — Capstones",
    description: "Four curricular levels. Thirteen capstones. One defensible platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply persisted theme before paint to avoid FOUC */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var s = localStorage.getItem('pyarcana-theme');
            if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {}
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
