/**
 * Social links — the single source of truth. Replace the placeholder URLs
 * here once you have real profiles; components never hardcode URLs.
 */

export interface SocialLink {
  label: string;
  url: string;
}

export const socials = {
  /** PLACEHOLDER — replace with your GitHub profile URL. */
  github: {
    label: "GitHub",
    url: "https://github.com/Abdullahhashmi06",
    handle: "Abdullahhashmi06",
  },
  linkedin: {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/abdullah-hashmi-59ab951b3",
  },
} as const;
