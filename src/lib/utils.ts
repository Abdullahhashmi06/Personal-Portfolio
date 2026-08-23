/** Join class names, filtering falsy values. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** The single easing curve used across the site's motion system. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
