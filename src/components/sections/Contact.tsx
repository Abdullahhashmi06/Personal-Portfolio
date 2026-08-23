import { ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { MagneticButton } from "../ui/MagneticButton";
import { IconButton } from "../ui/IconButton";

/** "Contact" section — centered headline, email CTA, and socials. */
export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-36 lg:py-44">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[620px] w-[min(980px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(154_160_255/0.07),transparent_65%)]"
      />

      <Container className="flex flex-col items-center text-center">
        <SectionHeading
          align="center"
          index="05"
          eyebrow="Contact"
          title={site.contact.title}
          description={site.contact.description}
        />

        <Reveal delay={0.1} className="mt-11">
          <MagneticButton strength={0.15}>
            <Button href="/contact" size="lg">
              {site.contact.cta}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </MagneticButton>
        </Reveal>

        <Reveal delay={0.18} className="mt-8">
          <div className="flex items-center gap-2.5">
            <IconButton href={socials.github.url} ariaLabel="GitHub profile">
              <GithubIcon className="size-[18px]" />
            </IconButton>
            <IconButton href={socials.linkedin.url} ariaLabel="LinkedIn profile">
              <LinkedinIcon className="size-[18px]" />
            </IconButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
