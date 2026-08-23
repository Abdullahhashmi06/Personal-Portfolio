/**
 * Projects shown in the work carousel.
 *
 * Update this data in a later phase — the carousel and cards read everything
 * from here, so no component changes should be needed.
 */

export interface Project {
  /** Unique slug, used for keys and future case-study routes. */
  slug: string;
  /** Display number, e.g. "01". */
  index: string;
  title: string;
  /** Short accent line shown above the title. */
  tagline: string;
  description: string;
  /** Badge shown on the card visual. */
  status: "Featured" | "Open source" | "Case study" | "Experiment" | "Academic";
  /**
   * CSS background used for the placeholder visual. Swap these for real
   * screenshots/images when available — the component keeps working either way.
   */
  gradient: string;
  /** Light-mode equivalent of gradient. */
  gradientLight?: string;
  /** Optional product screenshot — shown when present instead of the gradient. */
  image?: string;
  technologies: string[];
  /** Optional links — only rendered when present. */
  links: {
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
}

export const projects: Project[] = [
  {
    slug: "interniq",
    index: "01",
    title: "InternIQ",
    tagline: "AI-powered recruitment platform",
    description:
      "An AI-powered recruitment workflow platform that streamlines internship recruitment — from application intake and candidate screening to evaluation and organizational workflows.",
    status: "Featured",
    gradient:
      "linear-gradient(135deg, #1b1b2f 0%, #2a2850 45%, #111322 100%)",
    gradientLight:
      "linear-gradient(135deg, #e8e6f0 0%, #d5d0e8 45%, #e2e0ec 100%)",
    image: "/projects/interniq-light.png",
    technologies: ["Next.js", "TypeScript", "Supabase", "AI"],
    links: {
      github: "https://github.com/Abdullahhashmi06/bhartibot",
      demo: "https://www.interniq.pk/",
      caseStudy: "/work/interniq",
    },
  },
  {
    slug: "mlp",
    index: "02",
    title: "MNIST Multilayer Perceptron",
    tagline: "Calculus-driven neural network",
    description:
      "An MLP built from the mathematical foundations of Multivariable Calculus, using Google's MNIST dataset to explore gradient-based learning and neural-network classification.",
    status: "Case study",
    gradient:
      "linear-gradient(135deg, #241a33 0%, #352252 45%, #150f1d 100%)",
    gradientLight:
      "linear-gradient(135deg, #ece6f4 0%, #ddd4ee 45%, #e8e2f0 100%)",
    image: "/projects/MLP-light.png",
    technologies: ["Python", "Machine Learning", "Multivariable Calculus"],
    links: {
      caseStudy: "/work/mlp",
    },
  },
  {
    slug: "image-filtering",
    index: "03",
    title: "Image Filtering System",
    tagline: "OOP image processing",
    description:
      "An object-oriented image processing application built at FAST NUCES that allows users to authenticate, preview images, construct filter pipelines, apply transformations, and save processed results.",
    status: "Academic",
    gradient:
      "linear-gradient(135deg, #0f2a26 0%, #143b34 45%, #0b1513 100%)",
    gradientLight:
      "linear-gradient(135deg, #e2f0ee 0%, #d4ebe6 45%, #e0ede9 100%)",
    image: "/projects/image filter.png",
    technologies: ["C++", "OOP", "Image Processing"],
    links: {
      github: "https://github.com/Abdullahhashmi06/image-filtering-system",
      caseStudy: "/work/image-filtering",
    },
  },
];
