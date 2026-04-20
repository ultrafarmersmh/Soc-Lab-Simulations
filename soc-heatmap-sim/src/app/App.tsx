import { useEffect, useState } from 'react';
import { loadTopology } from './data/loader';
import type { TopologyData } from './data/types';
import { DashboardLayout } from './layout/DashboardLayout';
import { HeaderBar } from './layout/HeaderBar';
import { MetricsPanel } from './metrics/MetricsPanel';
import { MitrePanel } from './overlays/MitrePanel';
import { RiskHeatPanel } from './overlays/RiskHeatPanel';
import { TopologyCanvas } from './topology/TopologyCanvas';
import { PlaybackControls } from './timeline/PlaybackControls';
import { TimelineBar } from './timeline/TimelineBar';

export default function App() {
  const [topology, setTopology] = useState<TopologyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTopology()
      .then(setTopology)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Unknown topology load error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="app-shell">
      <HeaderBar
        title="SOC Operational Heatmap Simulator"
        subtitle="Segmented SOC lab visualization scaffold"
        rightContent={<span className="status-pill">Scaffold v1</span>}
      />
      <DashboardLayout
        topology={<TopologyCanvas topology={topology} isLoading={isLoading} error={error} />}
        metrics={<MetricsPanel />}
        timeline={
          <div>
            <h2>Pane C — Timeline / Incident Playback</h2>
            <PlaybackControls />
            <TimelineBar />
          </div>
        }
        overlays={
          <div>
            <h2>Pane D — Security Overlay</h2>
            <MitrePanel />
            <RiskHeatPanel />
          </div>
        }
      />
    </div>
  );
}
