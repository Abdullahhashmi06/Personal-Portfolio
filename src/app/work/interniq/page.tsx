"use client";

import { motion } from "motion/react";
import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudySection } from "@/components/casestudy/CaseStudySection";
import { WorkflowStep } from "@/components/casestudy/WorkflowStep";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { EASE } from "@/lib/utils";

const features = [
  {
    title: "Tailored Screening Criteria",
    description:
      "Recruiters define required and preferred skills, academic qualifications, and custom screening questions for each role.",
  },
  {
    title: "Evidence Mapping",
    description:
      "Candidate CV information is mapped against recruitment requirements to surface relevant experience and qualifications.",
  },
  {
    title: "AI Match Scoring",
    description:
      "Candidates receive a structured AI-assisted match score based on how well their profile aligns with the role requirements.",
  },
  {
    title: "Candidate Insights",
    description:
      "Recruiters can view strengths, weaknesses, missing skills, and supporting evidence for each candidate.",
  },
  {
    title: "Public Application Workflow",
    description:
      "Applicants can apply through a shared public link without requiring an account, streamlining the application process.",
  },
  {
    title: "Recruitment Dashboard",
    description:
      "Recruiters review candidates and make shortlisting decisions through a centralized, organized interface.",
  },
];

export default function InterniqCaseStudy() {
  return (
    <main className="min-h-screen">
      <CaseStudyHero
        title="InternIQ"
        subtitle="AI-Powered Internship Recruitment Platform"
        description="InternIQ is an AI-powered recruitment platform designed to streamline internship hiring by helping recruiters define screening requirements, analyze candidate CVs, map evidence to requirements, and review candidates through structured AI-assisted evaluation."
        image="/projects/interniq-light.png"
        imageAlt="InternIQ platform interface"
        technologies={["Next.js", "TypeScript", "Supabase", "AI"]}
        developers={["Abdullah Hashmi", "Umer Sheikh"]}
        links={{
          github: "https://github.com/Abdullahhashmi06/bhartibot",
          demo: "https://www.interniq.pk/",
        }}
      />

      {/* Problem */}
      <CaseStudySection label="The Problem">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Recruitment is manual, slow, and inconsistent.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Recruiters receive large volumes of CVs for internship positions.
            Manually reviewing each candidate is time-consuming, and relevant
            evidence can be buried inside resumes. Comparing candidates against
            role-specific requirements becomes inconsistent without structured
            evaluation.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            InternIQ was designed to assist this process — not replace the
            recruiter, but give them structured, AI-assisted insight to make
            better decisions faster.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* Solution */}
      <CaseStudySection label="The Solution">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            AI-assisted recruitment, not AI-controlled recruitment.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            InternIQ gives recruiters the tools to define roles, specify
            requirements, collect applications, and receive structured candidate
            evaluations — while keeping the human in control of the final
            decision.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* How it works */}
      <CaseStudySection label="How InternIQ Works">
        <div className="max-w-2xl">
          <WorkflowStep
            number="01"
            title="Define Requirements"
            description="Recruiters define the role, work mode, duration, technical requirements, academic qualifications, and screening criteria."
            index={0}
          />
          <WorkflowStep
            number="02"
            title="Collect & Analyze Applications"
            description="Applicants apply through a public link, upload their CV, and answer screening questions. InternIQ analyzes the submitted information and extracts relevant evidence."
            index={1}
          />
          <WorkflowStep
            number="03"
            title="Review AI Evidence"
            description="Recruiters receive structured evaluation including AI match score, requirement evidence, candidate strengths, missing skills, and ranking."
            index={2}
          />
        </div>
      </CaseStudySection>

      {/* Features */}
      <CaseStudySection label="Product Features">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
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

      {/* Technology */}
      <CaseStudySection label="Technology">
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {["Next.js", "TypeScript", "Supabase", "AI"].map((tech) => (
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

      {/* Building */}
      <CaseStudySection label="Building InternIQ">
        <Reveal>
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            InternIQ was built by Abdullah Hashmi and Umer Sheikh as a project
            to address real recruitment workflow challenges. The focus was on
            designing a practical product that assists recruiters through
            structured AI evaluation rather than replacing human judgment.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* Impact */}
      <CaseStudySection label="Impact">
        <Reveal>
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            InternIQ is designed to reduce manual screening effort, make
            candidate comparison more structured, and surface relevant evidence
            faster — helping recruiters focus on the candidates that matter most.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* CTA */}
      <CaseStudySection>
        <Reveal>
          <div className="flex flex-wrap gap-3">
            <Button href="https://www.interniq.pk/" external size="md">
              Visit InternIQ
              <ExternalLink className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button
              href="https://github.com/Abdullahhashmi06/bhartibot"
              external
              variant="secondary"
              size="md"
            >
              <GithubIcon className="size-3.5" />
              View source
            </Button>
          </div>
        </Reveal>
      </CaseStudySection>
    </main>
  );
}
