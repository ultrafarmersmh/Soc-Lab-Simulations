import { useEffect, useMemo, useState } from 'react';
import { loadAssets, loadTimelineEvents, loadTopology } from './data/loader';
import type { Asset, TimelineEvent, TopologyData } from './data/types';
import { useSimulationState } from './hooks/useSimulationState';
import { IncidentNarrativeBar } from './layout/IncidentNarrativeBar';
import { OperationsShell } from './layout/OperationsShell';
import { TopCommandBar } from './layout/TopCommandBar';
import { MainWorkspace } from './workspace/MainWorkspace';

const modeOptions = ['Traffic Heat', 'Alert Heat', 'Escalation', 'Containment', 'Recovery'] as const;

type ModeOption = (typeof modeOptions)[number];

function narrativeForEvent(eventType: string | undefined): string {
  switch (eventType) {
    case 'scan_detected':
      return 'Elevated deny volume detected on SOC-WAN ingress, lateral movement escalation underway through exposed SOC-LAN assets.';
    case 'wazuh_detection':
      return 'Wazuh analytics spike across SOC-SIEM while cross-zone traffic from SOC-LAN remains elevated and under investigation.';
    case 'endpoint_containment':
      return 'Containment controls are active in SOC-LAN; endpoint telemetry is stabilizing as enforcement policies converge.';
    case 'stabilization':
      return 'Post-containment stabilization in progress with deny rates falling and user operations progressively restored.';
    default:
      return 'Baseline operations are nominal while monitoring for reconnaissance and lateral movement indicators.';
  }
}

export default function App() {
  const [topology, setTopology] = useState<TopologyData | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState('SOC-LAN');
  const [activeMode, setActiveMode] = useState<ModeOption>('Traffic Heat');
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);

  useEffect(() => {
    Promise.all([loadTopology(), loadAssets(), loadTimelineEvents()])
      .then(([topologyData, assetsData, timelineData]) => {
        setTopology(topologyData);
        setAssets(assetsData.assets);
        setEvents(timelineData.events);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Unknown data load error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const maxTimestamp = events.length > 0 ? events[events.length - 1].timestamp : 100;

  useEffect(() => {
    if (!isPlaying || events.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentTimestamp((previous) => {
        const next = previous + speedMultiplier;
        return next >= maxTimestamp ? 0 : next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, speedMultiplier, maxTimestamp, events.length]);

  const { activeEvents, globalMetrics } = useSimulationState(events, currentTimestamp);
  const latestEvent = activeEvents[activeEvents.length - 1];

  const scenarioPhase = useMemo(() => {
    if (currentTimestamp < 20) return 'Baseline';
    if (currentTimestamp < 35) return 'Scan Detected';
    if (currentTimestamp < 75) return 'Escalation';
    if (currentTimestamp < 95) return 'Containment';
    return 'Recovery';
  }, [currentTimestamp]);

  const narrativeText = narrativeForEvent(latestEvent?.type);

  const activeEndpoints = useMemo(() => {
    if (assets.length === 0) return 0;
    return assets.filter((asset) => asset.type.includes('endpoint') || asset.type.includes('client')).length || assets.length;
  }, [assets]);

  const selectedZone = topology?.zones.find((zone) => zone.id === selectedZoneId) ?? null;

  const kpiItems = [
    { label: 'Active Endpoints', value: activeEndpoints.toString() },
    { label: 'Active RDS Sessions', value: `${globalMetrics.rdsSessions}` },
    { label: 'Wazuh Alerts/min', value: `${globalMetrics.wazuhAlerts}` },
    { label: 'Firewall Denies', value: `${globalMetrics.firewallDenies}` }
  ];

  const replayClock = `${String(Math.floor(currentTimestamp / 60)).padStart(2, '0')}:${String(Math.floor(currentTimestamp % 60)).padStart(2, '0')}`;

  return (
    <OperationsShell
      topBar={
        <TopCommandBar
          title="SOC.lab Operational Simulator"
          subtitle="Segmented SOC lab visualization scaffold"
          scenarioLabel="Scenario: Lateral Movement"
          kpis={kpiItems}
          replayClock={replayClock}
          replayStatus={`Live Replay ${speedMultiplier.toFixed(1)}x`}
          playState={isPlaying ? 'Playing' : 'Paused'}
        />
      }
      narrative={<IncidentNarrativeBar text={narrativeText} phase={scenarioPhase} />}
      main={
        <MainWorkspace
          topology={topology}
          isLoading={isLoading}
          error={error}
          assets={assets}
          events={events}
          activeEvents={activeEvents}
          selectedZone={selectedZone}
          selectedZoneId={selectedZoneId}
          onZoneSelect={setSelectedZoneId}
          modes={[...modeOptions]}
          activeMode={activeMode}
          onModeChange={(mode) => setActiveMode(mode as ModeOption)}
          currentTimestamp={currentTimestamp}
          maxTimestamp={maxTimestamp}
          isPlaying={isPlaying}
          speedMultiplier={speedMultiplier}
          onTogglePlay={() => setIsPlaying((previous) => !previous)}
          onScrub={setCurrentTimestamp}
          onSpeedChange={setSpeedMultiplier}
        />
      }
    />
  );
}
