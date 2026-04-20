import { useMemo } from 'react';
import type { Asset, TimelineEvent, Zone } from '../data/types';

export interface ZoneMetricSnapshot {
  trafficScore: number;
  threatScore: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'STABLE' | 'DEGRADED' | 'CRITICAL';
  topAssets: Asset[];
  ingressFlows: Array<{ route: string; intensity: number }>;
  topFlows: Array<{ route: string; intensity: number }>;
}

export function useZoneMetrics(zone: Zone | null, assets: Asset[], activeEvents: TimelineEvent[]): ZoneMetricSnapshot {
  return useMemo(() => {
    if (!zone) {
      return {
        trafficScore: 0,
        threatScore: 0,
        riskTier: 'LOW',
        status: 'STABLE',
        topAssets: [],
        ingressFlows: [],
        topFlows: []
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

    const trafficScore = Math.min(100, Math.round(flowEntries.reduce((sum, flow) => sum + flow.intensity, 0) / 2 + heat * 0.6));
    const threatScore = Math.min(100, Math.round(heat * 0.7 + activeEvents.length * 4));

    const riskTier = threatScore > 70 ? 'HIGH' : threatScore > 35 ? 'MEDIUM' : 'LOW';
    const status = threatScore > 75 ? 'CRITICAL' : threatScore > 30 ? 'DEGRADED' : 'STABLE';

    return {
      trafficScore,
      threatScore,
      riskTier,
      status,
      topAssets: zoneAssets.slice(0, 4),
      ingressFlows: flowEntries.filter((flow) => flow.route.endsWith(`->${zone.id}`)).slice(0, 4),
      topFlows: flowEntries.slice(0, 6)
    };
  }, [zone, assets, activeEvents]);
}
