import { GithubIcon } from "../ui/BrandIcons";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { SpotlightCard } from "../ui/SpotlightCard";

/** "GitHub" section — a single spotlight card linking to the profile. */
export function GitHubSection() {
  return (
    <section id="github" className="relative py-24 sm:py-28 lg:py-36">
      <Container>
        <Reveal>
          <SpotlightCard className="overflow-hidden p-8 sm:p-12 lg:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(154_160_255/0.1),transparent_65%)]"
            />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl border border-line bg-white/[0.03] text-fg">
                    <GithubIcon className="size-6" />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-faint">
                      <span className="text-accent">04</span> · GitHub
                    </p>
                    <p className="mt-1 font-mono text-sm text-muted">
                      @{socials.github.handle}
                    </p>
                  </div>
                </div>

                <h2 className="mt-7 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                  {site.github.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {site.github.description}
                </p>
              </div>

              <Button
                href={socials.github.url}
                external
                variant="secondary"
                size="lg"
                className="w-full shrink-0 sm:w-auto"
              >
                <GithubIcon className="size-4" />
                View GitHub profile
              </Button>
            </div>
          </SpotlightCard>
        </Reveal>
      </Container>
    </section>
  );
}
