import type { HeatMode } from '../hooks/useIncidentState';
import type { ZoneMetricSnapshot } from '../hooks/useZoneMetrics';

interface ZoneOverviewTabProps {
  snapshot: ZoneMetricSnapshot;
  activeMode: HeatMode;
}

export function ZoneOverviewTab({ snapshot, activeMode }: ZoneOverviewTabProps) {
  return (
    <div className="zone-overview-tab">
      <div className="status-line">
        <span className={`zone-status ${snapshot.status.toLowerCase()}`}>{snapshot.status}</span>
        <span className={`risk-tier ${snapshot.riskTier.toLowerCase()}`}>Risk {snapshot.riskTier}</span>
      </div>

      <div className="triage-grid">
        <article>
          <span>Traffic Δ vs baseline</span>
          <strong>{snapshot.trafficDelta > 0 ? '+' : ''}{snapshot.trafficDelta}</strong>
        </article>
        <article>
          <span>Alert Δ vs baseline</span>
          <strong>{snapshot.alertDelta > 0 ? '+' : ''}{snapshot.alertDelta}</strong>
        </article>
        <article>
          <span>Top ATT&CK tactic</span>
          <strong>{snapshot.topMitreTactic}</strong>
        </article>
        <article>
          <span>Affected assets</span>
          <strong>{snapshot.affectedAssetsCount}</strong>
        </article>
        <article>
          <span>Most active peer</span>
          <strong>{snapshot.mostActivePeerZone}</strong>
        </article>
        <article>
          <span>Last notable event</span>
          <strong>{String(Math.floor(snapshot.lastNotableTimestamp / 60)).padStart(2, '0')}:{String(snapshot.lastNotableTimestamp % 60).padStart(2, '0')}</strong>
        </article>
        <article>
          <span>Ingress vs Egress</span>
          <strong>{snapshot.ingressEgressRatio}</strong>
        </article>
        <article>
          <span>Control action</span>
          <strong>{snapshot.activeControlAction}</strong>
        </article>
      </div>

      <p className="mode-context">Current mode focus: {activeMode}</p>
    </div>
  );
}
