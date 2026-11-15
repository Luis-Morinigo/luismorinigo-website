import type { ArticleCategory } from '@/lib/articles';
import type { IconName } from '@/lib/icons';

/** Icon shown next to each article category. */
export const categoryIcons: Record<ArticleCategory, IconName> = {
  finanzas: 'briefcase',
  procesos: 'recycle',
  desarrollo: 'code',
};
