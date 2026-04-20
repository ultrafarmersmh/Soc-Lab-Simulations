export type TrustTier = 'external' | 'high' | 'medium' | 'medium-high' | 'low' | 'core';

export interface Zone {
  id: string;
  label: string;
  x: number;
  y: number;
  tier: TrustTier;
}

export interface Link {
  source: string;
  target: string;
  type: 'north-south' | 'routed';
}

export interface TopologyData {
  zones: Zone[];
  links: Link[];
}

export interface Asset {
  id: string;
  zone: string;
  type: string;
  criticality: 'low' | 'medium' | 'high';
}

export interface AssetsData {
  assets: Asset[];
}

export interface TimelineMetrics {
  rdsSessions?: number;
  wazuhAlerts?: number;
  firewallDenies?: number;
  endpointAlerts?: number;
  containedEndpoints?: number;
  zoneTraffic?: Record<string, number>;
  heatZones?: Record<string, number>;
  mitre?: Record<string, number>;
}

export interface TimelineEvent {
  timestamp: number;
  type: string;
  metrics: TimelineMetrics;
}

export interface TimelineData {
  events: TimelineEvent[];
}

export interface GlobalMetrics {
  rdsSessions: number;
  wazuhAlerts: number;
  firewallDenies: number;
  endpointAlerts: number;
  containedEndpoints: number;
  vulnerabilityHotspots: number;
}

export interface ScenarioState {
  currentTimestamp: number;
  isPlaying: boolean;
  speedMultiplier: number;
}
