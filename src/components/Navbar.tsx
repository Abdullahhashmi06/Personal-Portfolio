"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Sun, Moon, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { cn, EASE } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { Logo } from "./ui/Logo";
import { IconButton } from "./ui/IconButton";

const sectionIds = ["work", "about", "skills", "contact"];

/**
 * Sticky navigation. Transparent at the top; gains a frosted glass
 * background, blur, and border once the page scrolls. Includes a
 * full-screen animated mobile menu.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();

  // Scroll state + section highlighting
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock, Escape-to-close, focus management
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => toggleRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-line bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[72px] sm:px-8 lg:px-12"
      >
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {site.nav.map((link) => {
            const id = link.href.replace(/^\//, "").replace(/^#/, "");
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ duration: 0.4, ease: EASE }}
                      className="absolute inset-0 -z-10 rounded-full border border-line bg-white/[0.06]"
                    />
                  )}
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right side: socials + theme toggle + mobile toggle */}
        <div className="flex items-center gap-2">
          <IconButton href={socials.github.url} ariaLabel="GitHub profile" external>
            <GithubIcon className="size-[18px]" />
          </IconButton>
          <IconButton href={socials.linkedin.url} ariaLabel="LinkedIn profile" external>
            <LinkedinIcon className="size-[18px]" />
          </IconButton>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-10 sm:size-11 place-items-center rounded-full border border-line bg-white/[0.02] text-muted transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-fg"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <Sun className="size-[18px]" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <Moon className="size-[18px]" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border border-line bg-white/[0.02] text-fg transition-colors duration-300 hover:border-white/25 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="size-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="size-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-ink/95 backdrop-blur-2xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-7">
              <ul className="space-y-1">
                {site.nav.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.06 + i * 0.07, ease: EASE }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-3"
                    >
                      <span className="font-mono text-xs text-faint">
                        0{i + 1}
                      </span>
                      <span className="text-4xl font-semibold tracking-tight text-fg transition-colors duration-300 group-hover:text-accent">
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
              className="border-t border-line px-7 py-6"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
                  {site.role}
                </p>
                <div className="flex items-center gap-2">
                  <IconButton href={socials.github.url} ariaLabel="GitHub profile">
                    <GithubIcon className="size-[18px]" />
                  </IconButton>
                  <IconButton href={socials.linkedin.url} ariaLabel="LinkedIn profile">
                    <LinkedinIcon className="size-[18px]" />
                  </IconButton>
                  <button
                    type="button"
                    onClick={() => { toggleTheme(); setOpen(false); }}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.02] text-muted transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-fg"
                  >
                    {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
