import { useMemo } from 'react';
import type { TimelineEvent } from '../data/types';

export const phaseTimeline = [
  { label: 'Baseline', start: 0, focusZone: 'SOC-WAN', severity: 'Normal', controlState: 'Monitoring' },
  { label: 'Scan Detected', start: 35, focusZone: 'SOC-WAN', severity: 'Elevated', controlState: 'Investigating' },
  { label: 'Escalation', start: 55, focusZone: 'SOC-LAN', severity: 'High', controlState: 'Response Active' },
  { label: 'Containment', start: 75, focusZone: 'SOC-LAN', severity: 'Critical', controlState: 'Containment Active' },
  { label: 'Recovery', start: 95, focusZone: 'SOC-SERVER', severity: 'Moderate', controlState: 'Recovery Validation' }
] as const;

export type HeatMode = 'Traffic Heat' | 'Alert Heat' | 'Risk Heat' | 'Containment';

export interface IncidentEventItem {
  timestamp: number;
  title: string;
  detail: string;
  severity: 'info' | 'elevated' | 'threat';
}

function describeEvent(event: TimelineEvent): IncidentEventItem {
  const lookup: Record<string, Omit<IncidentEventItem, 'timestamp'>> = {
    baseline: {
      title: 'Baseline traffic profile loaded',
      detail: 'Normal east-west traffic and routine alert volume.',
      severity: 'info'
    },
    user_logon_burst: {
      title: 'Suspicious endpoint activity',
      detail: 'RDP session surge detected from thin client segment.',
      severity: 'elevated'
    },
    scan_detected: {
      title: 'Deny spike detected',
      detail: 'SOC-WAN ingress scan triggered deny surge on OPNsense.',
      severity: 'threat'
    },
    wazuh_detection: {
      title: 'Wazuh alert burst',
      detail: 'SIEM correlation indicates lateral movement behavior.',
      severity: 'threat'
    },
    endpoint_containment: {
      title: 'Containment staged',
      detail: 'Endpoint controls deployed in SOC-LAN and policy block applied.',
      severity: 'elevated'
    },
    stabilization: {
      title: 'Recovery progressing',
      detail: 'Alert pressure and deny rates are decaying toward baseline.',
      severity: 'info'
    }
  };

  const mapped = lookup[event.type] ?? {
    title: event.type.replace(/_/g, ' '),
    detail: 'Scenario event update received.',
    severity: 'info' as const
  };

  return {
    timestamp: event.timestamp,
    ...mapped
  };
}

export function useIncidentState(currentTimestamp: number, activeEvents: TimelineEvent[], allEvents: TimelineEvent[]) {
  return useMemo(() => {
    const currentPhase = [...phaseTimeline].reverse().find((phase) => currentTimestamp >= phase.start) ?? phaseTimeline[0];
    const phaseIndex = phaseTimeline.findIndex((phase) => phase.label === currentPhase.label);

    const baselineEvent = allEvents[0];
    const latestEvent = activeEvents[activeEvents.length - 1] ?? baselineEvent;

    const eventLog = activeEvents.map(describeEvent);

    return {
      currentPhase,
      phaseIndex,
      baselineEvent,
      latestEvent,
      eventLog
    };
  }, [currentTimestamp, activeEvents, allEvents]);
}
