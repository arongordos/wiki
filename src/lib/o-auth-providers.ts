export const OAUTH_PROVIDERS = ["github"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export const OAUTH_PROVIDER_DETAILS: Record<
  OAuthProvider,
  { name: string; image: string }
> = {
  github: { name: "GitHub", image: "/images/github.svg" },
};
