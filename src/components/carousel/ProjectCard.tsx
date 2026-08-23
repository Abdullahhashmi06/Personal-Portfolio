"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { GithubIcon } from "../ui/BrandIcons";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { SpotlightCard } from "../ui/SpotlightCard";
import { ArrowLink } from "../ui/ArrowLink";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

/**
 * Compact project card for the carousel. The image area is intentionally
 * restrained so cards feel like portfolio items rather than full-screen heroes.
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const { theme } = useTheme();
  const bg = theme === "light" && project.gradientLight ? project.gradientLight : project.gradient;

  return (
    <SpotlightCard
      className={cn(
        "flex h-full flex-col overflow-hidden",
        "hover:scale-[1.02] transition-transform duration-400",
        className
      )}
    >
      {/* Visual — compact image area */}
      <div
        aria-hidden="true"
        style={{ background: bg }}
        className="group/img relative aspect-[3/2] overflow-hidden border-b border-line"
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain p-3 transition-transform duration-500 ease-out group-hover/img:scale-[1.03] sm:p-4"
          />
        ) : (
          <>
            <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_85%_85%_at_50%_40%,black,transparent_82%)]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="animate-spin-slow size-16 rounded-xl border border-white/10 sm:size-20" />
              <div className="animate-spin-slow absolute inset-3 rounded-lg border border-white/[0.07] [animation-direction:reverse]" />
            </div>
          </>
        )}

        {/* Oversized index — smaller */}
        <span className="pointer-events-none absolute -bottom-5 right-2 select-none font-mono text-[5rem] font-bold leading-none text-white/[0.05] sm:-bottom-6 sm:text-[6.5rem]">
          {project.index}
        </span>

        {/* Status badge — smaller */}
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-ink/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm">
          {project.status}
        </span>

        {/* Soft top light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_255_255/0.07),transparent_55%)]" />
      </div>

      {/* Body — compact content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          {project.tagline}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-fg sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul
          aria-label={`${project.title} technologies`}
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line bg-white/[0.02] px-2.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
          {project.links.github && (
            <ArrowLink href={project.links.github} external icon={<GithubIcon className="size-3" />}>
              GitHub
            </ArrowLink>
          )}
          {project.links.demo && (
            <ArrowLink href={project.links.demo} external icon={<ExternalLink className="size-3" />}>
              Live demo
            </ArrowLink>
          )}
          {project.links.caseStudy && (
            <ArrowLink href={project.links.caseStudy} icon={<ArrowUpRight className="size-3" />}>
              Case study
            </ArrowLink>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
