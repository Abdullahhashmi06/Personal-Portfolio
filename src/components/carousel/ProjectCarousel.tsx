"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { IconButton } from "../ui/IconButton";

/**
 * Project showcase carousel, built on native scroll-snap (no library):
 *  - touch swipe, trackpad, and scrollbar work natively
 *  - arrow keys, Home/End when the track is focused
 *  - arrow buttons + dot progress indicator
 *  - active card centered with neighbours peeking on either side
 */
export function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);

    const center = el.scrollLeft + el.clientWidth / 2;
    let index = 0;
    el.querySelectorAll<HTMLElement>("[data-slide]").forEach((slide, i) => {
      if (slide.offsetLeft + slide.offsetWidth / 2 <= center) index = i;
    });
    setActive(index);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => el.removeEventListener("scroll", update);
  }, []);

  /** One card + gap, so arrows and keyboard move a single slide. */
  const step = () => {
    const el = trackRef.current;
    if (!el) return 600;
    const first = el.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(el).gap) || 0;
    return first ? first.offsetWidth + gap : el.clientWidth;
  };

  const scrollByCard = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
  };

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>(`[data-slide="${index}"]`);
    if (!slide) return;
    el.scrollTo({
      left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const el = trackRef.current;
    if (!el) return;
    const s = step();
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        el.scrollBy({ left: -s, behavior: "smooth" });
        break;
      case "ArrowRight":
        e.preventDefault();
        el.scrollBy({ left: s, behavior: "smooth" });
        break;
      case "Home":
        e.preventDefault();
        el.scrollTo({ left: 0, behavior: "smooth" });
        break;
      case "End":
        e.preventDefault();
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
        break;
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      {/* Track */}
      <div
        ref={trackRef}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label="Featured projects — use arrow keys to browse"
        className="no-scrollbar mx-auto w-full max-w-6xl relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 py-2 outline-none sm:gap-6 sm:px-8 lg:px-12 lg:pr-[15%] xl:pr-[20%]"
      >
        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-slide={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}`}
            className="w-[88vw] shrink-0 snap-center sm:w-[480px] md:w-[560px] lg:w-[600px]"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mx-auto mt-7 flex w-full max-w-6xl items-center justify-between px-5 sm:mt-9 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tabular-nums text-faint">
            {String(active + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {projects.map((project, i) => (
              <button
                key={project.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === active
                    ? "w-8 bg-accent"
                    : "w-3.5 bg-white/15 hover:bg-white/30"
                )}
              />
            ))}
          </div>
          <span className="font-mono text-xs tabular-nums text-faint">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <IconButton
            onClick={() => scrollByCard(-1)}
            ariaLabel="Previous project"
            disabled={!canPrev}
          >
            <ChevronLeft className="size-5" />
          </IconButton>
          <IconButton
            onClick={() => scrollByCard(1)}
            ariaLabel="Next project"
            disabled={!canNext}
          >
            <ChevronRight className="size-5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
