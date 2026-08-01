import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond, Marcellus } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { SITE_BASE_PATH } from "@/lib/runtime-mode";

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

const cormorant = Cormorant_Garamond({
  weight: ["500", "600", "700"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const marcellus = Marcellus({
  weight: ["400"],
  variable: "--font-subdisplay",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PyArcana · De cero a Data Scientist",
  description: "PyArcana — curso online de Python para Data Analysis y Data Science. En español peruano, con método I Do / We Do / You Do, ejercicios prácticos y proyectos de portafolio.",
  keywords: ["PyArcana", "Python", "Data Science", "Data Analyst", "Pandas", "NumPy", "scikit-learn", "curso online", "Perú", "Art Nouveau"],
  authors: [{ name: "PyArcana" }],
  icons: {
    icon: [{ url: `${SITE_BASE_PATH}/favicon.svg`, type: "image/svg+xml" }],
    shortcut: `${SITE_BASE_PATH}/favicon.svg`,
    apple: `${SITE_BASE_PATH}/logo.svg`,
  },
  // Content-Security-Policy via <meta> tag. GitHub Pages doesn't support
  // custom HTTP headers, so a <meta> tag is the only way to ship a CSP on the
  // static export. Next.js static export uses inline scripts for hydration,
  // so 'unsafe-inline' is required for script-src (this is a known Next.js
  // limitation — see next.js discussion #91816). We still gain:
  //   - object-src 'none': blocks Flash/Java/plugin-based XSS
  //   - base-uri 'self': blocks <base> tag injection
  //   - frame-ancestors 'none': blocks clickjacking (the site is not meant
  //     to be framed)
  //   - form-action 'self': blocks form submissions to external origins
  //   - img-src/style-src/font-src restricted to self + the Pyodide CDN
  //   - connect-src 'self' + Firebase + Pyodide CDN + GitHub Pages origin
  // When the dynamic LMS ships, replace unsafe-inline with nonces/hashes.
  other: {
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://cdn.jsdelivr.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  openGraph: {
    title: "PyArcana · De cero a Data Analyst/Scientist",
    description: "PyArcana — curso online de Python para Data Analysis y Data Science en español peruano.",
    siteName: "PyArcana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyArcana",
    description: "PyArcana — curso online de Python para Data Analysis y Data Science.",
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
        className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} ${marcellus.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
