import { useMemo } from 'react';
import type { TimelineEvent } from '../data/types';
import type { HeatMode } from './useIncidentState';

export interface ModeLegend {
  title: string;
  accent: string;
  lowLabel: string;
  highLabel: string;
}

export interface HeatSignal {
  zoneIntensityById: Record<string, number>;
  linkIntensityByRoute: Record<string, number>;
  containedRoutes: string[];
  containedZones: string[];
  legend: ModeLegend;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function useModeStyling(mode: HeatMode, activeEvents: TimelineEvent[]): HeatSignal {
  return useMemo(() => {
    const zoneIntensityById: Record<string, number> = {};
    const linkIntensityByRoute: Record<string, number> = {};

    const latest = activeEvents[activeEvents.length - 1];
    const baseAlerts = latest?.metrics.wazuhAlerts ?? 0;
    const baseDenies = latest?.metrics.firewallDenies ?? 0;

    activeEvents.forEach((event) => {
      Object.entries(event.metrics.zoneTraffic ?? {}).forEach(([route, intensity]) => {
        const adjusted =
          mode === 'Traffic Heat'
            ? intensity
            : mode === 'Alert Heat'
              ? intensity * 0.4 + (event.metrics.wazuhAlerts ?? 0) * 1.4
              : mode === 'Risk Heat'
                ? intensity * 0.3 + (event.metrics.heatZones?.['SOC-LAN'] ?? 0)
                : intensity * 0.2 + (event.metrics.containedEndpoints ?? 0) * 40;

        linkIntensityByRoute[route] = Math.max(linkIntensityByRoute[route] ?? 0, clamp(adjusted));
      });

      Object.entries(event.metrics.heatZones ?? {}).forEach(([zone, heat]) => {
        const adjusted =
          mode === 'Traffic Heat'
            ? heat * 0.8 + baseDenies * 0.15
            : mode === 'Alert Heat'
              ? heat * 0.7 + baseAlerts * 1.3
              : mode === 'Risk Heat'
                ? heat + baseAlerts * 0.8
                : heat * 0.45 + (event.metrics.containedEndpoints ?? 0) * 35;

        zoneIntensityById[zone] = Math.max(zoneIntensityById[zone] ?? 4, clamp(adjusted));
      });
    });

    const containedRoutes = mode === 'Containment' ? Object.keys(linkIntensityByRoute).filter((route) => route.includes('SOC-LAN')) : [];
    const containedZones = mode === 'Containment' ? ['SOC-LAN'] : [];

    const legendByMode: Record<HeatMode, ModeLegend> = {
      'Traffic Heat': {
        title: 'Traffic Heat Legend',
        accent: '#46c8ff',
        lowLabel: 'Low traffic flow',
        highLabel: 'Dominant network flow'
      },
      'Alert Heat': {
        title: 'Alert Heat Legend',
        accent: '#f6a33e',
        lowLabel: 'Background detections',
        highLabel: 'Bursting SIEM/alert pressure'
      },
      'Risk Heat': {
        title: 'Risk Heat Legend',
        accent: '#b387ff',
        lowLabel: 'Managed exposure',
        highLabel: 'Critical risk concentration'
      },
      Containment: {
        title: 'Containment Legend',
        accent: '#ff6d3f',
        lowLabel: 'Suppressed path',
        highLabel: 'Restricted / blocked segment'
      }
    };

    return {
      zoneIntensityById,
      linkIntensityByRoute,
      containedRoutes,
      containedZones,
      legend: legendByMode[mode]
    };
  }, [mode, activeEvents]);
}
