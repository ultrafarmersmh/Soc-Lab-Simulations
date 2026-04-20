import type { Asset, TimelineEvent, TopologyData, Zone } from '../data/types';
import { useZoneMetrics } from '../hooks/useZoneMetrics';
import { DetailRail } from './DetailRail';
import { EnvironmentMapPanel } from './EnvironmentMapPanel';
import { EventFeed } from './EventFeed';
import { ModeSelector } from './ModeSelector';
import { ReplayTimeline } from './ReplayTimeline';

interface MainWorkspaceProps {
  topology: TopologyData | null;
  isLoading: boolean;
  error: string | null;
  assets: Asset[];
  events: TimelineEvent[];
  activeEvents: TimelineEvent[];
  selectedZone: Zone | null;
  selectedZoneId: string;
  onZoneSelect: (zoneId: string) => void;
  modes: string[];
  activeMode: string;
  onModeChange: (mode: string) => void;
  currentTimestamp: number;
  maxTimestamp: number;
  isPlaying: boolean;
  speedMultiplier: number;
  onTogglePlay: () => void;
  onScrub: (timestamp: number) => void;
  onSpeedChange: (speed: number) => void;
}

export function MainWorkspace({
  topology,
  isLoading,
  error,
  assets,
  events,
  activeEvents,
  selectedZone,
  selectedZoneId,
  onZoneSelect,
  modes,
  activeMode,
  onModeChange,
  currentTimestamp,
  maxTimestamp,
  isPlaying,
  speedMultiplier,
  onTogglePlay,
  onScrub,
  onSpeedChange
}: MainWorkspaceProps) {
  const zoneSnapshot = useZoneMetrics(selectedZone, assets, activeEvents);

  return (
    <main className="main-workspace-layout">
      <section className="workspace-center">
        <EnvironmentMapPanel
          topology={topology}
          isLoading={isLoading}
          error={error}
          activeEvents={activeEvents}
          selectedZoneId={selectedZoneId}
          onZoneSelect={onZoneSelect}
        />

        <ModeSelector modes={modes} activeMode={activeMode} onChange={onModeChange} />

        <ReplayTimeline
          currentTimestamp={currentTimestamp}
          maxTimestamp={maxTimestamp}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onScrub={onScrub}
        />

        <div className="utility-controls">
          <label htmlFor="speed-control">Replay speed</label>
          <select
            id="speed-control"
            value={speedMultiplier}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
          </select>
          <span>{events.length} events loaded</span>
        </div>

        <EventFeed events={activeEvents} />
      </section>

      <DetailRail zone={selectedZone} snapshot={zoneSnapshot} />
    </main>
  );
}
