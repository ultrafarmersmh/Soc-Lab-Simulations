import type { TrustTier } from '../data/types';

export function tierColor(tier: TrustTier): string {
  const map: Record<TrustTier, string> = {
    external: '#5B8DEF',
    high: '#F2994A',
    medium: '#4FD1C5',
    'medium-high': '#9B51E0',
    low: '#6FCF97',
    core: '#EB5757'
  };
  return map[tier];
}
