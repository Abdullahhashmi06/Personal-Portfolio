"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "../ui/BrandIcons";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { EASE } from "@/lib/utils";

interface CaseStudyHeroProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  technologies: string[];
  developers?: string[];
  links: {
    github?: string;
    demo?: string;
  };
}

/**
 * Shared hero for case-study pages. Large product image, title, description,
 * tech pills, developer credits, and primary CTAs.
 */
export function CaseStudyHero({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  technologies,
  developers,
  links,
}: CaseStudyHeroProps) {
  return (
    <section className="relative overflow-hidden pb-8 pt-28 sm:pt-32">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(154_160_255/0.08),transparent_65%)]"
      />

      <Container>
        {/* Back link */}
        <motion.a
          href="/#work"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="group mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back to work
        </motion.a>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent"
            >
              {subtitle}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-5xl lg:leading-[1.1]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
            >
              {description}
            </motion.p>

            {/* Technologies */}
            <motion.ul
              aria-label="Technologies"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line bg-white/[0.02] px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {tech}
                </li>
              ))}
            </motion.ul>

            {/* Developers */}
            {developers && developers.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-4 text-sm text-faint"
              >
                Built by{" "}
                <span className="text-muted">{developers.join(" & ")}</span>
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {links.demo && (
                <Button href={links.demo} external size="md">
                  Visit live site
                  <ExternalLink className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              )}
              {links.github && (
                <Button href={links.github} external variant="secondary" size="md">
                  <GithubIcon className="size-3.5" />
                  View source
                </Button>
              )}
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4 sm:p-6"
              priority
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
