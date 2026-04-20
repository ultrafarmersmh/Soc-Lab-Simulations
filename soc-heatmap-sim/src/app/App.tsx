import { useEffect, useMemo, useState } from 'react';
import { loadAssets, loadTimelineEvents, loadTopology } from './data/loader';
import type { Asset, TimelineEvent, TopologyData } from './data/types';
import { useModeStyling } from './hooks/useModeStyling';
import { phaseTimeline, type HeatMode, useIncidentState } from './hooks/useIncidentState';
import { useSimulationState } from './hooks/useSimulationState';
import { IncidentNarrativeBar } from './layout/IncidentNarrativeBar';
import { OperationsShell } from './layout/OperationsShell';
import { TopCommandBar } from './layout/TopCommandBar';
import { MainWorkspace } from './workspace/MainWorkspace';

const modeOptions: HeatMode[] = ['Traffic Heat', 'Alert Heat', 'Risk Heat', 'Containment'];

export default function App() {
  const [topology, setTopology] = useState<TopologyData | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState('SOC-LAN');
  const [activeMode, setActiveMode] = useState<HeatMode>('Traffic Heat');
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
      setCurrentTimestamp((previous: number) => {
        const next = previous + speedMultiplier;
        return next >= maxTimestamp ? 0 : next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, speedMultiplier, maxTimestamp, events.length]);

  const { activeEvents, globalMetrics } = useSimulationState(events, currentTimestamp);
  const incident = useIncidentState(currentTimestamp, activeEvents, events);
  const modeSignal = useModeStyling(activeMode, activeEvents);

  useEffect(() => {
    setSelectedZoneId(incident.currentPhase.focusZone);
  }, [incident.currentPhase.focusZone]);

  const baselineMetrics = events[0]?.metrics;

  const activeEndpoints = useMemo(() => {
    if (assets.length === 0) return 0;
    return assets.filter((asset: Asset) => asset.type.includes('endpoint') || asset.type.includes('client')).length || assets.length;
  }, [assets]);

  const selectedZone = topology?.zones.find((zone: { id: string }) => zone.id === selectedZoneId) ?? null;

  const severityRank: Record<string, number> = { Normal: 0, Moderate: 1, Elevated: 2, High: 3, Critical: 4 };

  type KpiState = 'normal' | 'elevated' | 'critical';
  type KpiItem = {
    label: string;
    value: string;
    delta: number;
    state: KpiState;
    priority: 'primary' | 'secondary';
  };

  const metricSeverity = (value: number, baseline: number): 'normal' | 'elevated' | 'critical' => {
    const delta = value - baseline;
    if (delta > baseline * 1.1 || value > baseline * 2.2) return 'critical';
    if (delta > baseline * 0.5) return 'elevated';
    return 'normal';
  };

  const kpiItems: KpiItem[] = [
    {
      label: 'Firewall Denies',
      value: `${globalMetrics.firewallDenies}`,
      delta: globalMetrics.firewallDenies - (baselineMetrics?.firewallDenies ?? 0),
      state: metricSeverity(globalMetrics.firewallDenies, baselineMetrics?.firewallDenies ?? 1),
      priority: 'primary' as const
    },
    {
      label: 'Wazuh Alerts/min',
      value: `${globalMetrics.wazuhAlerts}`,
      delta: globalMetrics.wazuhAlerts - (baselineMetrics?.wazuhAlerts ?? 0),
      state: metricSeverity(globalMetrics.wazuhAlerts, baselineMetrics?.wazuhAlerts ?? 1),
      priority: 'primary' as const
    },
    {
      label: 'Contained Endpoints',
      value: `${globalMetrics.containedEndpoints}`,
      delta: globalMetrics.containedEndpoints - (baselineMetrics?.containedEndpoints ?? 0),
      state: globalMetrics.containedEndpoints > 0 ? 'elevated' : 'normal',
      priority: 'primary' as const
    },
    {
      label: 'Active Endpoints',
      value: activeEndpoints.toString(),
      delta: 0,
      state: 'normal',
      priority: 'secondary' as const
    },
    {
      label: 'Active RDS Sessions',
      value: `${globalMetrics.rdsSessions}`,
      delta: globalMetrics.rdsSessions - (baselineMetrics?.rdsSessions ?? 0),
      state: metricSeverity(globalMetrics.rdsSessions, baselineMetrics?.rdsSessions ?? 1),
      priority: 'secondary' as const
    }
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
          phaseSummary={{
            phase: incident.currentPhase.label,
            impactedZone: incident.currentPhase.focusZone,
            severity: incident.currentPhase.severity,
            controlState: incident.currentPhase.controlState
          }}
        />
      }
      narrative={
        <IncidentNarrativeBar
          phase={incident.currentPhase.label}
          text={incident.eventLog[incident.eventLog.length - 1]?.detail ?? 'Baseline operations in monitored steady state.'}
          severity={incident.currentPhase.severity}
        />
      }
      main={
        <MainWorkspace
          topology={topology}
          isLoading={isLoading}
          error={error}
          assets={assets}
          events={events}
          activeEvents={activeEvents}
          eventLog={incident.eventLog}
          selectedZone={selectedZone}
          selectedZoneId={selectedZoneId}
          onZoneSelect={setSelectedZoneId}
          modes={modeOptions}
          activeMode={activeMode}
          onModeChange={(mode) => setActiveMode(mode)}
          currentTimestamp={currentTimestamp}
          maxTimestamp={maxTimestamp}
          isPlaying={isPlaying}
          speedMultiplier={speedMultiplier}
          onTogglePlay={() => setIsPlaying((previous: boolean) => !previous)}
          onReset={() => setCurrentTimestamp(0)}
          onScrub={setCurrentTimestamp}
          onPhaseJump={(phaseIndex) => setCurrentTimestamp(phaseTimeline[Math.max(0, phaseIndex)].start)}
          phaseIndex={incident.phaseIndex}
          baselineEvent={incident.baselineEvent}
          modeSignal={modeSignal}
          currentPhaseSeverity={severityRank[incident.currentPhase.severity] >= 3 ? 'high' : 'moderate'}
          onSpeedChange={setSpeedMultiplier}
        />
      }
    />
  );
}
