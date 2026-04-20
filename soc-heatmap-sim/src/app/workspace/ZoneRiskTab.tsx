import type { ZoneMetricSnapshot } from '../hooks/useZoneMetrics';

interface ZoneRiskTabProps {
  snapshot: ZoneMetricSnapshot;
}

export function ZoneRiskTab({ snapshot }: ZoneRiskTabProps) {
  return (
    <div className="risk-block">
      <p>Risk tier currently evaluated as <strong>{snapshot.riskTier}</strong> based on active heat and flow signatures.</p>
      <p>Threat score weighting prioritizes deny surges and SIEM alert concentration.</p>
    </div>
  );
}
