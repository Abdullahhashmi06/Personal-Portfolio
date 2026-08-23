import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
import { IconButton } from "./ui/IconButton";
import { ArrowLink } from "./ui/ArrowLink";

/** Site footer: statement, navigation, socials, legal line. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      {/* Accent seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />

      <Container className="py-14 sm:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {site.footerStatement}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-3">
            {site.nav.map((link) => (
              <ArrowLink key={link.href} href={link.href}>
                {link.label}
              </ArrowLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <IconButton href={socials.github.url} ariaLabel="GitHub profile">
              <GithubIcon className="size-[18px]" />
            </IconButton>
            <IconButton href={socials.linkedin.url} ariaLabel="LinkedIn profile">
              <LinkedinIcon className="size-[18px]" />
            </IconButton>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 sm:flex-row">
          <p className="text-xs text-faint">
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Built with Next.js
            </p>
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-9 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:border-white/25 hover:text-fg"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
