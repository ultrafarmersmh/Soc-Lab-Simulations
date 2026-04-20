import type { TimelineEvent } from './types';

export function reduceEventsToTimestamp(events: TimelineEvent[], timestamp: number): TimelineEvent[] {
  return events.filter((event) => event.timestamp <= timestamp);
}
