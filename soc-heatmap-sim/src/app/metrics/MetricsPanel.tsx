import { AlertTicker } from './AlertTicker';
import { MetricCard } from './MetricCard';

export function MetricsPanel() {
  return (
    <div>
      <h2>Pane B — Operational Metrics</h2>
      <div className="metrics-grid">
        <MetricCard label="RDS Sessions" value="--" />
        <MetricCard label="Wazuh Alerts/min" value="--" />
        <MetricCard label="Firewall Denies" value="--" />
        <MetricCard label="Endpoint Alerts" value="--" />
      </div>
      <AlertTicker />
    </div>
  );
}
