import type { Asset, TopologyData } from '../data/types';
import type { HeatSignal } from '../hooks/useModeStyling';
import type { HeatMode } from '../hooks/useIncidentState';
import { TopologyCanvas } from '../topology/TopologyCanvas';

interface EnvironmentMapPanelProps {
  topology: TopologyData | null;
  isLoading: boolean;
  error: string | null;
  assets: Asset[];
  selectedZoneId: string;
  onZoneSelect: (zoneId: string) => void;
  activeMode: HeatMode;
  modeSignal: HeatSignal;
}

export function EnvironmentMapPanel({
  topology,
  isLoading,
  error,
  assets,
  selectedZoneId,
  onZoneSelect,
  activeMode,
  modeSignal
}: EnvironmentMapPanelProps) {
  return (
    <section className="environment-map-panel">
      <header>
        <h2>Environment Map</h2>
      </header>
      <TopologyCanvas
        topology={topology}
        isLoading={isLoading}
        error={error}
        assets={assets}
        selectedZoneId={selectedZoneId}
        onZoneSelect={onZoneSelect}
        activeMode={activeMode}
        modeSignal={modeSignal}
      />
    </section>
  );
}
