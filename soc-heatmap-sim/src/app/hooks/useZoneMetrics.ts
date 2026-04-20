import { useMemo } from 'react';
import type { Asset, TimelineEvent, Zone } from '../data/types';

export interface ZoneMetricSnapshot {
  trafficScore: number;
  threatScore: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'STABLE' | 'DEGRADED' | 'ESCALATING' | 'CONTAINED';
  topAssets: Asset[];
  ingressFlows: Array<{ route: string; intensity: number }>;
  topFlows: Array<{ route: string; intensity: number }>;
  trafficDelta: number;
  alertDelta: number;
  topMitreTactic: string;
  affectedAssetsCount: number;
  mostActivePeerZone: string;
  lastNotableTimestamp: number;
  activeControlAction: string;
  ingressEgressRatio: string;
}

function pickStatus(threatScore: number, contained: boolean): ZoneMetricSnapshot['status'] {
  if (contained) return 'CONTAINED';
  if (threatScore > 70) return 'ESCALATING';
  if (threatScore > 30) return 'DEGRADED';
  return 'STABLE';
}

export function useZoneMetrics(zone: Zone | null, assets: Asset[], activeEvents: TimelineEvent[], baselineEvent?: TimelineEvent) {
  return useMemo<ZoneMetricSnapshot>(() => {
    if (!zone) {
      return {
        trafficScore: 0,
        threatScore: 0,
        riskTier: 'LOW',
        status: 'STABLE',
        topAssets: [],
        ingressFlows: [],
        topFlows: [],
        trafficDelta: 0,
        alertDelta: 0,
        topMitreTactic: 'Reconnaissance',
        affectedAssetsCount: 0,
        mostActivePeerZone: 'N/A',
        lastNotableTimestamp: 0,
        activeControlAction: 'Monitoring',
        ingressEgressRatio: '0:0'
      };
    }

    const zoneAssets = assets.filter((asset) => asset.zone === zone.id);
    const heat = activeEvents
      .map((event) => event.metrics.heatZones?.[zone.id] ?? 0)
      .reduce((max, value) => Math.max(max, value), 0);

    const flowEntries = activeEvents
      .flatMap((event) => Object.entries(event.metrics.zoneTraffic ?? {}))
      .filter(([route]) => route.includes(zone.id))
      .map(([route, intensity]) => ({ route, intensity }));

    const ingressFlows = flowEntries.filter((flow) => flow.route.endsWith(`->${zone.id}`));
    const egressFlows = flowEntries.filter((flow) => flow.route.startsWith(`${zone.id}->`));

    const ingressTotal = ingressFlows.reduce((sum, flow) => sum + flow.intensity, 0);
    const egressTotal = egressFlows.reduce((sum, flow) => sum + flow.intensity, 0);

    const trafficScore = Math.min(100, Math.round(flowEntries.reduce((sum, flow) => sum + flow.intensity, 0) / 2 + heat * 0.6));
    const wazuhAlerts = activeEvents[activeEvents.length - 1]?.metrics.wazuhAlerts ?? 0;
    const threatScore = Math.min(100, Math.round(heat * 0.7 + activeEvents.length * 4 + wazuhAlerts * 0.4));

    const contained = activeEvents.some((event) => event.type === 'endpoint_containment') && zone.id === 'SOC-LAN';
    const status = pickStatus(threatScore, contained);
    const riskTier = threatScore > 70 ? 'HIGH' : threatScore > 35 ? 'MEDIUM' : 'LOW';

    const baselineTraffic = baselineEvent?.metrics.zoneTraffic
      ? Object.entries(baselineEvent.metrics.zoneTraffic)
          .filter(([route]) => route.includes(zone.id))
          .reduce((sum, [, intensity]) => sum + intensity, 0)
      : 0;
    const trafficDelta = Math.round(ingressTotal + egressTotal - baselineTraffic);

    const baselineAlerts = baselineEvent?.metrics.wazuhAlerts ?? 0;
    const alertDelta = Math.round(wazuhAlerts - baselineAlerts);

    const mitreCounts = activeEvents.reduce<Record<string, number>>((acc, event) => {
      Object.entries(event.metrics.mitre ?? {}).forEach(([tactic, value]) => {
        acc[tactic] = (acc[tactic] ?? 0) + value;
      });
      return acc;
    }, {});
    const topMitreTactic =
      Object.entries(mitreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? (zone.id === 'SOC-SIEM' ? 'Detection Engineering' : 'Lateral Movement');

    const mostActivePeerZone =
      flowEntries
        .map((flow) => flow.route.replace(`${zone.id}->`, '').replace(`->${zone.id}`, ''))
        .find((peer) => peer && peer !== zone.id) ?? 'OPNSENSE';

    const notable = [...activeEvents].reverse().find((event) => {
      if (event.metrics.heatZones?.[zone.id]) return true;
      return Object.keys(event.metrics.zoneTraffic ?? {}).some((route) => route.includes(zone.id));
    });

    const activeControlAction =
      status === 'CONTAINED' ? 'Policy Block Applied' : status === 'ESCALATING' ? 'Segmentation Tightening' : 'Passive Monitoring';

    return {
      trafficScore,
      threatScore,
      riskTier,
      status,
      topAssets: zoneAssets.slice(0, 4),
      ingressFlows: ingressFlows.slice(0, 4),
      topFlows: flowEntries.slice(0, 6),
      trafficDelta,
      alertDelta,
      topMitreTactic,
      affectedAssetsCount: zoneAssets.length,
      mostActivePeerZone,
      lastNotableTimestamp: notable?.timestamp ?? 0,
      activeControlAction,
      ingressEgressRatio: `${ingressTotal || 0}:${egressTotal || 0}`
    };
  }, [zone, assets, activeEvents, baselineEvent]);
}
