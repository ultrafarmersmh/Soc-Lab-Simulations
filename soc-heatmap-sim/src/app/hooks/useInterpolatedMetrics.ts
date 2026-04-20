import { useMemo } from 'react';
import type { TimelineEvent } from '../data/types';

export function useInterpolatedMetrics(events: TimelineEvent[], timestamp: number) {
  return useMemo(
    () => ({
      timestamp,
      nearestEvent: events.find((event) => event.timestamp >= timestamp) ?? events.at(-1)
    }),
    [events, timestamp]
  );
}
