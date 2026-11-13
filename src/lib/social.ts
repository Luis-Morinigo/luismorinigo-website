export const socialNetworks = ['linkedin', 'github', 'x', 'instagram'] as const;
export type SocialNetwork = (typeof socialNetworks)[number];

export interface SocialLink {
  network: SocialNetwork;
  href: string;
}

/**
 * Keeps only the networks with a configured URL, in a fixed order, so an
 * empty variable hides its icon instead of rendering a dead link.
 * A value that is not an https URL throws to fail the build.
 */
export function socialLinks(
  urls: Partial<Record<SocialNetwork, string | undefined>>,
): SocialLink[] {
  return socialNetworks.flatMap((network) => {
    const href = urls[network]?.trim() ?? '';
    if (href === '') return [];
    if (!URL.canParse(href) || new URL(href).protocol !== 'https:') {
      throw new Error(`Social URL for "${network}" must be an https URL, got "${href}"`);
    }
    return [{ network, href }];
  });
}
