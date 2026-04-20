import type { ZoneMetricSnapshot } from '../hooks/useZoneMetrics';

interface ZoneAlertsTabProps {
  snapshot: ZoneMetricSnapshot;
}

export function ZoneAlertsTab({ snapshot }: ZoneAlertsTabProps) {
  return (
    <ul className="mini-list">
      {snapshot.topFlows.slice(0, 4).map((flow) => (
        <li key={flow.route}>
          <span>{flow.route}</span>
          <strong>{flow.intensity}</strong>
        </li>
      ))}
    </ul>
  );
}
