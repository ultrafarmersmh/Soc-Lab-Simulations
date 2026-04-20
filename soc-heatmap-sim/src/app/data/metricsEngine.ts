import type { GlobalMetrics, TimelineEvent } from './types';

export function deriveMetrics(events: TimelineEvent[]): GlobalMetrics {
  const defaults: GlobalMetrics = {
    rdsSessions: 0,
    wazuhAlerts: 0,
    firewallDenies: 0,
    endpointAlerts: 0,
    containedEndpoints: 0,
    vulnerabilityHotspots: 0
  };

  return events.reduce((acc, event) => ({ ...acc, ...event.metrics }), defaults);
}
