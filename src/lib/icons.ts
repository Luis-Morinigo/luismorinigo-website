/**
 * Inline SVG icons (24×24, lucide geometry). `stroke` icons inherit
 * currentColor through the wrapper; `fill` icons are solid shapes.
 */
export const icons = {
  // Methodology
  recycle: {
    kind: 'stroke',
    body: '<path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>',
  },
  zap: {
    kind: 'stroke',
    body: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  },
  combine: {
    kind: 'stroke',
    body: '<path d="M10 18H5a3 3 0 0 1-3-3v-1"/><path d="M14 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2"/><path d="M20 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2"/><path d="m7 21 3-3-3-3"/><rect x="14" y="14" width="8" height="8" rx="2"/><rect x="2" y="2" width="8" height="8" rx="2"/>',
  },
  // Services
  briefcase: {
    kind: 'stroke',
    body: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  },
  code: {
    kind: 'stroke',
    body: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
  },
  'trending-up': {
    kind: 'stroke',
    body: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  },
  users: {
    kind: 'stroke',
    body: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  // Interface
  'arrow-right': { kind: 'stroke', body: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>' },
  'chevron-left': { kind: 'stroke', body: '<path d="m15 18-6-6 6-6"/>' },
  'chevron-right': { kind: 'stroke', body: '<path d="m9 18 6-6-6-6"/>' },
  pause: {
    kind: 'fill',
    body: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  },
  play: {
    kind: 'fill',
    body: '<path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5z"/>',
  },
  quote: {
    kind: 'fill',
    body: '<path d="M9.5 6C6 7 4 9.8 4 13.5V18h6v-6H7c0-2.2 1.2-3.7 3-4.3zM19.5 6C16 7 14 9.8 14 13.5V18h6v-6h-3c0-2.2 1.2-3.7 3-4.3z"/>',
  },
} as const satisfies Record<string, { kind: 'stroke' | 'fill'; body: string }>;

export type IconName = keyof typeof icons;
