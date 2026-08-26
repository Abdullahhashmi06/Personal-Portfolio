"use client";

import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudySection } from "@/components/casestudy/CaseStudySection";
import { WorkflowStep } from "@/components/casestudy/WorkflowStep";
import { Reveal } from "@/components/ui/Reveal";

export default function ImageFilteringCaseStudy() {
  return (
    <main className="min-h-screen">
      <CaseStudyHero
        title="OOP Image Filtering System"
        subtitle="Object-Oriented Programming • FAST NUCES • Semester 2"
        description="An interactive image-processing application built to apply Object-Oriented Programming concepts to real image manipulation workflows — from user authentication to filter pipelines."
        image="/projects/image filter.png"
        imageAlt="OOP Image Filtering System interface"
        technologies={["C++", "OOP", "Image Processing"]}
        developers={["Abdullah Hashmi"]}
        links={{}}
      />

      {/* Problem */}
      <CaseStudySection label="The Challenge">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Applying OOP to a practical application.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            The goal was to take concepts from Object-Oriented Programming and
            apply them to a practical software system rather than implementing
            isolated classroom examples. The project needed to combine
            authentication, image management, image processing, filter
            composition, and saving output into one coherent application.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* Solution */}
      <CaseStudySection label="The Solution">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            An interactive image-filtering workflow.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            The application provides a structured user experience: log in,
            select a preloaded image, preview it, build a filter pipeline, apply
            transformations, and save the processed result — all organized
            through object-oriented design.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* Application Workflow */}
      <CaseStudySection label="Application Workflow">
        <div className="max-w-2xl">
          <WorkflowStep
            number="01"
            title="Login"
            description="The user authenticates through the application's login system."
            index={0}
          />
          <WorkflowStep
            number="02"
            title="Select Image"
            description="The user chooses an image from the collection of preloaded images available in the application."
            index={1}
          />
          <WorkflowStep
            number="03"
            title="Preview Image"
            description="The selected image can be previewed before processing."
            index={2}
          />
          <WorkflowStep
            number="04"
            title="Build Filter Pipeline"
            description="The user constructs a sequence of image-processing operations."
            index={3}
          />
          <WorkflowStep
            number="05"
            title="Apply Pipeline & Save"
            description="The selected filters are applied in sequence and the processed image can be saved."
            index={4}
          />
          <WorkflowStep
            number="06"
            title="Logout"
            description="The user can safely exit the application through the logout functionality."
            index={5}
          />
        </div>
      </CaseStudySection>

      {/* Filter Pipeline Concept */}
      <CaseStudySection label="Filter Pipeline">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Composing multiple transformations.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Instead of applying a single filter in isolation, the application
            allows users to construct a sequence of operations. Multiple
            image-processing steps can be chained together into a pipeline that
            transforms the original image through each stage.
          </p>

          {/* Pipeline visualization */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              {/* Input */}
              <div className="flex flex-col items-center">
                <div className="grid size-16 place-items-center rounded-xl border border-line bg-white/[0.03] sm:size-20">
                  <span className="text-2xl">📷</span>
                </div>
                <span className="mt-2 text-xs text-faint">Input</span>
              </div>

              {/* Arrow */}
              <div className="rotate-90 text-faint sm:rotate-0">→</div>

              {/* Filters */}
              <div className="flex flex-col gap-3">
                {["Grayscale", "RGB / Color", "Brightness", "Invert"].map(
                  (filter, i) => (
                    <Reveal key={filter} delay={i * 0.1}>
                      <div className="rounded-lg border border-line bg-white/[0.03] px-4 py-2 text-center font-mono text-xs text-muted">
                        {filter}
                      </div>
                    </Reveal>
                  )
                )}
              </div>

              {/* Arrow */}
              <div className="rotate-90 text-faint sm:rotate-0">→</div>

              {/* Output */}
              <div className="flex flex-col items-center">
                <div className="grid size-16 place-items-center rounded-xl border border-accent/30 bg-accent/10 sm:size-20">
                  <span className="text-2xl">✨</span>
                </div>
                <span className="mt-2 text-xs text-faint">Output</span>
              </div>
            </div>
          </div>
        </Reveal>
      </CaseStudySection>

      {/* Filtering Features */}
      <CaseStudySection label="Filtering Features">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Grayscale",
              description: "Converts the image into grayscale.",
            },
            {
              title: "RGB / Color Filters",
              description: "Allows manipulation of image color channels.",
            },
            {
              title: "Brightness",
              description: "Adjusts image brightness.",
            },
            {
              title: "Inversion",
              description: "Inverts the image's colors.",
            },
          ].map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-line bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold tracking-tight text-fg">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      {/* Where OOP Meets Image Processing */}
      <CaseStudySection label="Where OOP Meets Image Processing">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Object-oriented design for image workflows.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            The application uses object-oriented principles to organize its
            functionality — from user authentication and image management to
            filter operations and pipeline composition. Each component is
            encapsulated as a distinct responsibility, creating a modular and
            maintainable codebase.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Encapsulation",
                description:
                  "Each component — users, images, filters — manages its own state and behavior.",
              },
              {
                title: "Abstraction",
                description:
                  "Complex operations are hidden behind clean interfaces, simplifying the user experience.",
              },
              {
                title: "Modularity",
                description:
                  "Features are organized into separate, reusable components that can be composed together.",
              },
              {
                title: "Separation of Responsibilities",
                description:
                  "Authentication, image handling, and filtering are kept distinct, making the system easier to maintain.",
              },
              {
                title: "Reusable Operations",
                description:
                  "Filtering operations are designed as composable units that can be chained into pipelines.",
              },
            ].map((concept, i) => (
              <Reveal key={concept.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-line bg-white/[0.02] p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-fg">
                    {concept.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {concept.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </CaseStudySection>

      {/* What This Demonstrates */}
      <CaseStudySection label="What This Demonstrates">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Applying OOP to Real Software",
              description:
                "Translating academic programming concepts into a functional application.",
            },
            {
              title: "Modular Software Design",
              description:
                "Organizing code into reusable, maintainable components.",
            },
            {
              title: "User Authentication",
              description:
                "Implementing login and logout functionality as part of the application workflow.",
            },
            {
              title: "Image-Processing Workflows",
              description:
                "Managing image selection, preview, processing, and output.",
            },
            {
              title: "Filter Composition",
              description:
                "Allowing users to chain multiple transformations into a processing pipeline.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-line bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold tracking-tight text-fg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      {/* Technologies */}
      <CaseStudySection label="Technologies">
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {["C++", "OOP", "Image Processing"].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-sm text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </CaseStudySection>

      {/* Project Type */}
      <CaseStudySection>
        <Reveal>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-sm text-faint">
              Academic Project
            </span>
            <span className="rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-sm text-faint">
              Object-Oriented Programming
            </span>
            <span className="rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-sm text-faint">
              FAST NUCES — Semester 2
            </span>
          </div>
        </Reveal>
      </CaseStudySection>

      {/* Note about GitHub */}
      <CaseStudySection>
        <Reveal>
          <p className="max-w-2xl text-sm text-faint">
            This project has not been published to GitHub yet. The source code
            will be available in the future.
          </p>
        </Reveal>
      </CaseStudySection>
    </main>
  );
}
