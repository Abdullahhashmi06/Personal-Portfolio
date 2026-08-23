import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { site, siteDescription } from "@/data/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CursorEffect } from "@/components/CursorEffect";
import { Loader } from "@/components/Loader";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: siteDescription,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: siteDescription,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.role}`,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <head>
        {/* Prevent flash of wrong theme on initial load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(
              function() {
                var t = localStorage.getItem('theme');
                if (t === 'light' || t === 'dark') {
                  document.documentElement.setAttribute('data-theme', t);
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              }
            )()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink focus:shadow-lift"
          >
            Skip to content
          </a>

          <ScrollProgress />
          <Navbar />

          <main id="main">{children}</main>

          <Footer />

          {/* Desktop-only cursor companions */}
          <CursorEffect />

          {/* Quick intro curtain, once per session */}
          <Loader />

          {/* Film grain over everything */}
          <div
            aria-hidden="true"
            className="bg-noise pointer-events-none fixed inset-0 z-[85] opacity-[0.03]"
          />
        </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
