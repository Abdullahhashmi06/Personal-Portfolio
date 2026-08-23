"use client";

import { useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "./ui/BrandIcons";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { useIsPointerFine, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE } from "@/lib/utils";
import { Container } from "./ui/Container";
import { AnimatedText } from "./ui/AnimatedText";
import { Button } from "./ui/Button";
import { MagneticButton } from "./ui/MagneticButton";

/** Deterministic PRNG so particles match between server and client renders. */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  left: string;
  top: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

const PARTICLE_COUNT = 18;

/**
 * Cinematic hero: ambient gradient orbs, a faint blueprint grid, drifting
 * particles, a cursor-following light, and a staggered text reveal. All
 * decorative layers sit behind the content and fade as you scroll.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useIsPointerFine();

  // Scroll parallax — background drifts slower than content; content fades out.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(42);
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(16 + rand() * 62).toFixed(2)}%`,
      size: 1.5 + rand() * 2,
      opacity: 0.18 + rand() * 0.3,
      duration: 14 + rand() * 16,
      delay: -rand() * 26,
      driftX: (rand() - 0.5) * 80,
      driftY: -(90 + rand() * 170),
    }));
  }, []);

  // Cursor-following ambient light (desktop only).
  const lightX = useMotionValue(-700);
  const lightY = useMotionValue(-700);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${lightX}px ${lightY}px, rgb(154 160 255 / 0.07), transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!fine || reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    lightX.set(e.clientX - rect.left);
    lightY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={handleMouseMove}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-28"
    >
      {/* ── Background layers ─────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0">
        {/* Blueprint grid, faded toward the edges */}
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_72%_62%_at_50%_36%,black,transparent_78%)]" />

        {/* Ambient orbs */}
        <motion.div
          style={reduced ? undefined : { y: bgY }}
          className="absolute inset-0"
        >
          <div className="animate-orb absolute -left-[18%] -top-[14%] size-[540px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgb(124_134_255/0.16),transparent_62%)] sm:size-[720px]" />
          <div className="animate-orb-b absolute -right-[22%] top-[4%] size-[480px] rounded-full bg-[radial-gradient(circle_at_60%_55%,rgb(127_212_255/0.10),transparent_58%)] sm:size-[640px]" />
          <div className="absolute left-1/2 top-[22%] h-[400px] w-[min(920px,92vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(154_160_255/0.09),transparent_66%)]" />
        </motion.div>

        {/* Drifting particles */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <span
              key={i}
              className="animate-drift absolute rounded-full bg-fg/25"
              style={
                {
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  "--drift-x": `${p.driftX}px`,
                  "--drift-y": `${p.driftY}px`,
                  "--particle-opacity": p.opacity,
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* Cursor light */}
        {fine && !reduced && (
          <motion.div style={{ background: spotlight }} className="absolute inset-0" />
        )}

        {/* Bottom vignette for a soft transition into the page */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-ink" />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10"
      >
        <Container>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-muted sm:text-xs"
          >
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            <span>{site.eyebrow}</span>
          </motion.p>

          {/* Headline */}
          <AnimatedText
            as="h1"
            text={site.headline}
            highlight={site.headlineHighlight}
            delay={0.45}
            stagger={0.07}
            className="mt-8 max-w-5xl text-[clamp(2.7rem,7.5vw,5.75rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-fg"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {site.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
            className="mt-11"
          >
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <MagneticButton className="w-full sm:w-auto">
                <Button href="#work" size="lg" className="w-full sm:w-auto">
                  Explore Work
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </MagneticButton>
              <Button
                href={socials.github.url}
                external
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <GithubIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                GitHub
              </Button>
            </div>
          </motion.div>
        </Container>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
          Scroll
        </span>
        <span className="relative h-11 w-px overflow-hidden rounded-full bg-fg/10">
          <span className="animate-scroll-dot absolute left-0 top-0 h-3.5 w-px bg-gradient-to-b from-accent to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}
