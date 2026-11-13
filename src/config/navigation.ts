import type { MessageKey } from '@/i18n';

export interface NavItem {
  /** i18n key of the visible label. */
  label: MessageKey;
  /** Spanish path (e.g. "/#servicios"); the English one is derived. */
  path: string;
}

/**
 * Main navigation. Only sections that already exist are listed, so no link
 * points nowhere (principle 3). Each section spec adds its own entry.
 */
export const navItems: NavItem[] = [];
