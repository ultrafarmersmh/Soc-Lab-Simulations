import { useMemo } from 'react';
import type { Zone } from '../data/types';

export function useSelectedZone(zones: Zone[], selectedZoneId: string) {
  return useMemo(() => zones.find((zone) => zone.id === selectedZoneId) ?? null, [zones, selectedZoneId]);
}
