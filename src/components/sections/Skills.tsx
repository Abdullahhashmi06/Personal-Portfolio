import { Brain, Code, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { technologies, technologiesSecondary } from "@/data/technologies";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { SpotlightCard } from "../ui/SpotlightCard";
import { TechMarquee } from "../carousel/TechMarquee";

interface Capability {
  icon: LucideIcon;
  title: string;
  items: string[];
}

const capabilities: Capability[] = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    items: ["LLM applications", "ML pipelines", "Computer vision"],
  },
  {
    icon: Code,
    title: "Software Development",
    items: ["TypeScript / React", "APIs & backends", "Databases"],
  },
  {
    icon: Terminal,
    title: "Systems & Tooling",
    items: ["C++ / Rust", "Git & CI/CD", "Linux"],
  },
];

function CapabilityCard({ capability }: { capability: Capability }) {
  const Icon = capability.icon;
  return (
    <SpotlightCard className="h-full p-6 sm:p-7">
      <div className="flex items-center gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-accent transition-colors duration-300 group-hover:border-accent/40">
          <Icon className="size-[18px]" />
        </span>
        <h3 className="text-base font-semibold tracking-tight text-fg">
          {capability.title}
        </h3>
      </div>
      <ul className="mt-5 space-y-2.5">
        {capability.items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 font-mono text-[13px] text-muted"
          >
            <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-accent/50" />
            {item}
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}

/** "Skills / Technologies" section — marquees + capability cards. */
export function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-24 sm:py-28 lg:py-36">
      {/* Ambient glow behind the marquees */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[min(920px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(124_134_255/0.05),transparent_65%)]"
      />

      <Container>
        <SectionHeading
          index="03"
          eyebrow="Skills & Technologies"
          title="The stack I reach for."
          description="The technologies and tools behind the work — plus the ones I’m exploring. The marquee pauses when you hover it."
        />
      </Container>

      <div className="mt-14 space-y-4 sm:mt-20 sm:space-y-5">
        <TechMarquee items={technologies} />
        <TechMarquee items={technologiesSecondary} reverse />
      </div>

      <Container className="mt-16 sm:mt-20">
        <div className="grid gap-5 sm:grid-cols-3">
          {capabilities.map((capability, i) => (
            <Reveal key={capability.title} delay={i * 0.1}>
              <CapabilityCard capability={capability} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
