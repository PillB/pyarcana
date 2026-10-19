import type { Metadata } from "next";
// Inter, JetBrains Mono, Cormorant Garamond and Marcellus, the files Google Fonts served,
// committed and loaded with next/font/local: no build fetches fonts (src/app/fonts/README.md).
import { inter, jetbrainsMono, cormorant, marcellus } from "./fonts";
import "./globals.css";
import "./qa.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { QAFooterBridge } from "@/components/course/QAFooterBridge";
import { SITE_BASE_PATH } from "@/lib/runtime-mode";
import { CspMeta } from "@/components/CspMeta";

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
      <head>
        <CspMeta />
        {/* Content-Security-Policy as <meta http-equiv> (src/components/CspMeta.tsx). GitHub Pages
            cannot send headers, so this meta is the policy there; it must be http-equiv, since a
            name= meta (what metadata.other renders) is ignored by browsers. A meta policy cannot
            list the page's own inline-script hashes (it is written before they are final), so its
            script-src keeps 'unsafe-inline'. On pyarcana.dev the Cloudflare build also sends, per
            page, a header policy whose script-src lists that page's sha256 hashes and no
            'unsafe-inline' (scripts/cloud-headers.mjs, src/lib/cloud/headers.ts; round of 19 Oct
            2026). Both are enforced and a script must pass both, so there the hashes rule. Pyodide
            needs 'wasm-unsafe-eval' to compile WebAssembly. Under `next dev` alone script-src also
            gets 'unsafe-eval', which the dev runtime needs to hydrate (metaCsp); builds never do.
            What the policy gives: object-src 'none', base-uri 'none', form-action 'self',
            script-src and connect-src self + the Pyodide folder on jsDelivr only
            (src/lib/pyodide.ts), style-src self only (the fonts are self-hosted, next/font/local).
            No Firebase hosts: the static builds never configure Firebase (D4 audit, P4).
            frame-ancestors is IGNORED in a meta policy (CSP3), so metaCsp leaves it out; the
            Cloudflare build sends it as a header (plus X-Frame-Options DENY). Built from the public
            cloud config (src/lib/cloud/csp.ts): the shipped config (stage off) yields LEGACY_CSP
            byte for byte (minus frame-ancestors here), which tests pin. */}
        {/* ChunkLoadError guard — inlined directly in <head> so it runs BEFORE
            any Next.js bundle. On a static export, next/script's
            "beforeInteractive" strategy loads via the Next.js runtime, which
            is too late if the runtime itself fails (the exact ChunkLoadError
            case). Inlining here guarantees the window listener is registered
            before webpack's chunk loader runs.
            Auto-reloads with a 30s cooldown + max 3 reloads per session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window==='undefined')return;try{var P=['ChunkLoadError','Loading chunk','Loading CSS chunk','Failed to fetch dynamically imported module','module factory is not available'];var K='pyarcana-chunk-guard-last-reload';var C='pyarcana-chunk-guard-reload-count';var CD=30000;var M=3;function m(x){if(!x)return false;x=String(x);for(var i=0;i<P.length;i++){if(x.indexOf(P[i])!==-1)return true}return false}function r(){try{var c=Number(window.sessionStorage.getItem(C)||0);if(c>=M)return;var l=Number(window.sessionStorage.getItem(K)||0);if(Date.now()-l<CD)return;window.sessionStorage.setItem(K,String(Date.now()));window.sessionStorage.setItem(C,String(c+1))}catch(e){}window.location.reload()}window.addEventListener('error',function(e){var x=(e.error&&e.error.message)||e.message;if(m(x)){e.preventDefault();r()}},true);window.addEventListener('unhandledrejection',function(e){var x=e.reason;var msg=(x&&x.message)||x;if(m(msg)){e.preventDefault();r()}})}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} ${marcellus.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <QAFooterBridge />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
