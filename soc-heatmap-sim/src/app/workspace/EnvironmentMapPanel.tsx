import type { TimelineEvent, TopologyData } from '../data/types';
import { TopologyCanvas } from '../topology/TopologyCanvas';

interface EnvironmentMapPanelProps {
  topology: TopologyData | null;
  isLoading: boolean;
  error: string | null;
  activeEvents: TimelineEvent[];
  selectedZoneId: string;
  onZoneSelect: (zoneId: string) => void;
}

export function EnvironmentMapPanel({
  topology,
  isLoading,
  error,
  activeEvents,
  selectedZoneId,
  onZoneSelect
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
        activeEvents={activeEvents}
        selectedZoneId={selectedZoneId}
        onZoneSelect={onZoneSelect}
      />
    </section>
  );
}
