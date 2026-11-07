/** Social platforms the site has icons for. */
export const SOCIAL_PLATFORMS = ["github", "linkedin"] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
};

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}
