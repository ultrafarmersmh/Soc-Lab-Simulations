import type { Asset, TimelineEvent, TopologyData, Zone } from '../data/types';
import type { HeatSignal } from '../hooks/useModeStyling';
import type { IncidentEventItem, HeatMode } from '../hooks/useIncidentState';
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
  eventLog: IncidentEventItem[];
  selectedZone: Zone | null;
  selectedZoneId: string;
  onZoneSelect: (zoneId: string) => void;
  modes: HeatMode[];
  activeMode: HeatMode;
  onModeChange: (mode: HeatMode) => void;
  currentTimestamp: number;
  maxTimestamp: number;
  isPlaying: boolean;
  speedMultiplier: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onScrub: (timestamp: number) => void;
  onPhaseJump: (phaseIndex: number) => void;
  phaseIndex: number;
  baselineEvent?: TimelineEvent;
  modeSignal: HeatSignal;
  currentPhaseSeverity: 'moderate' | 'high';
  onSpeedChange: (speed: number) => void;
}

export function MainWorkspace({
  topology,
  isLoading,
  error,
  assets,
  events,
  activeEvents,
  eventLog,
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
  onReset,
  onScrub,
  onPhaseJump,
  phaseIndex,
  baselineEvent,
  modeSignal,
  currentPhaseSeverity,
  onSpeedChange
}: MainWorkspaceProps) {
  const zoneSnapshot = useZoneMetrics(selectedZone, assets, activeEvents, baselineEvent);

  return (
    <main className="main-workspace-layout">
      <section className="workspace-center">
        <EnvironmentMapPanel
          topology={topology}
          isLoading={isLoading}
          error={error}
          assets={assets}
          selectedZoneId={selectedZoneId}
          onZoneSelect={onZoneSelect}
          activeMode={activeMode}
          modeSignal={modeSignal}
        />

        <ModeSelector modes={modes} activeMode={activeMode} onChange={onModeChange} legend={modeSignal.legend} />

        <ReplayTimeline
          currentTimestamp={currentTimestamp}
          maxTimestamp={maxTimestamp}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onReset={onReset}
          onScrub={onScrub}
          onPhaseJump={onPhaseJump}
          activePhaseIndex={phaseIndex}
          currentPhaseSeverity={currentPhaseSeverity}
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

        <EventFeed events={eventLog} />
      </section>

      <DetailRail zone={selectedZone} snapshot={zoneSnapshot} activeMode={activeMode} />
    </main>
  );
}
