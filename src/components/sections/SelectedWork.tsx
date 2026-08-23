import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { ProjectCarousel } from "../carousel/ProjectCarousel";

/** "Selected Work" section — heading + the project carousel. */
export function SelectedWork() {
  return (
    <section id="work" className="relative py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="Selected Work"
          title="Things I've built."
          description="A curated look at recent work — products, experiments, and ideas worth sharing. Case studies and links land here as projects ship."
        />
      </Container>

      <div className="mt-14 sm:mt-20">
        <ProjectCarousel />
      </div>
    </section>
  );
}
