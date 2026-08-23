import { site } from "@/data/site";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

/** "About" section — sticky heading beside placeholder paragraphs. */
export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-28 lg:py-36">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            index="02"
            eyebrow="About"
            title="Developer, builder, student."
          />
        </div>

        <div className="flex flex-col gap-6">
          {site.about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {site.about.focusAreas.map((area) => (
                <span
                  key={area.label}
                  className="rounded-full border border-line bg-white/[0.02] px-4 py-2 text-sm text-fg transition-colors duration-300 hover:border-accent/40"
                >
                  {area.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
