import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Python DS Perú · De cero a Data Analyst/Scientist",
  description: "Curso online de Python para Data Analysis y Data Science. En español peruano, con método I Do / We Do / You Do, ejercicios prácticos y proyectos de portafolio.",
  keywords: ["Python", "Data Science", "Data Analyst", "Pandas", "NumPy", "scikit-learn", "curso online", "Perú"],
  authors: [{ name: "Python DS Perú" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Python DS Perú · De cero a Data Analyst/Scientist",
    description: "Curso online de Python para Data Analysis y Data Science en español peruano.",
    siteName: "Python DS Perú",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Python DS Perú",
    description: "Curso online de Python para Data Analysis y Data Science.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PE" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
