/**
 * Site-wide content. Replace the placeholder data here — components read
 * everything from this file so no component changes are needed.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const site = {
  name: "Abdullah Hashmi",
  monogram: "AH",
  role: "BS Artificial Intelligence Student",

  /** Hero eyebrow line. */
  eyebrow: "AI • Software • Building",

  /**
   * Hero headline. Use "\n" for an intentional line break on sm+ screens;
   * on mobile the lines flow together and wrap naturally.
   */
  headline: "Building ideas into\nreal products.",
  /** Words in the headline rendered with the accent gradient. */
  headlineHighlight: ["real", "products."],

  /** Short hero description. */
  description:
    "AI student at FAST NUCES Islamabad, currently in my 3rd semester. I build AI and software projects that turn ideas into practical, real-world products.",

  /** "About" paragraphs. Generic, no invented achievements. */
  about: {
    paragraphs: [
      "I'm a BS Artificial Intelligence student at FAST NUCES Islamabad, currently in my 3rd semester. I build software and AI projects alongside my studies — designing experiences, architecting systems, and shipping products.",
      "Most of my time goes to coursework, side projects, and the occasional all-nighter debugging something I was confident about an hour earlier. That's university life, and I wouldn't trade it.",
      "I care about the details most people never notice — the spacing, the motion, the edge cases — because those are the difference between software that works and software that feels right.",
    ],
    focusAreas: [
      { label: "AI Applications" },
      { label: "Software Development" },
      { label: "Product Building" },
      { label: "Machine Learning" },
    ],
  },

  /** GitHub section copy. */
  github: {
    title: "Code, experiments, and open source.",
    description:
      "Most of my work lives on GitHub — projects, experiments, and the occasional abandoned prototype. The best ones end up in the work section above.",
  },

  /** Contact section copy. */
  contact: {
    title: "Let's build something together.",
    description:
      "Whether it's a project, a collaboration, or just a good conversation about software — my inbox is open.",
    cta: "Get in touch",
  },

  /** Footer statement. */
  footerStatement:
    "Building AI and software at the intersection of learning and creation.",

  /** Main navigation. */
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "/contact" },
  ] as NavLink[],
} as const;

export const siteDescription = `${site.role} — ${site.description}`;
