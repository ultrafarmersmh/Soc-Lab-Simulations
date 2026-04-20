import { useMemo } from 'react';
import type { TimelineEvent } from '../data/types';
import { reduceEventsToTimestamp } from '../data/eventReducer';
import { deriveMetrics } from '../data/metricsEngine';

export function useSimulationState(events: TimelineEvent[], timestamp: number) {
  return useMemo(() => {
    const activeEvents = reduceEventsToTimestamp(events, timestamp);

    return {
      globalMetrics: deriveMetrics(activeEvents),
      activeEvents
    };
  }, [events, timestamp]);
}
