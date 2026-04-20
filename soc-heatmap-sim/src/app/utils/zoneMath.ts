import type { Zone } from '../data/types';

export function zoneById(zones: Zone[], id: string): Zone | undefined {
  return zones.find((zone) => zone.id === id);
}
