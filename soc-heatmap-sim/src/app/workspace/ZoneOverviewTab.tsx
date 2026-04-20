import { CompactGauge } from '../metrics/CompactGauge';
import { ScoreCard } from '../metrics/ScoreCard';
import type { ZoneMetricSnapshot } from '../hooks/useZoneMetrics';

interface ZoneOverviewTabProps {
  snapshot: ZoneMetricSnapshot;
}

export function ZoneOverviewTab({ snapshot }: ZoneOverviewTabProps) {
  return (
    <div className="zone-overview-tab">
      <div className="status-line">
        <span className={`zone-status ${snapshot.status.toLowerCase()}`}>{snapshot.status}</span>
        <span className={`risk-tier ${snapshot.riskTier.toLowerCase()}`}>Risk {snapshot.riskTier}</span>
      </div>
      <div className="score-grid">
        <ScoreCard label="Traffic Score" value={snapshot.trafficScore} />
        <ScoreCard label="Threat Score" value={snapshot.threatScore} />
      </div>
      <CompactGauge label="Zone Pressure" value={Math.round((snapshot.trafficScore + snapshot.threatScore) / 2)} />
    </div>
  );
}
