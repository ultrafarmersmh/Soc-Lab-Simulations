import type { AssetsData, TimelineData, TopologyData } from './types';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const loadTopology = (): Promise<TopologyData> => fetchJson<TopologyData>('/data/topology.json');
export const loadAssets = (): Promise<AssetsData> => fetchJson<AssetsData>('/data/assets.json');
export const loadTimelineEvents = (): Promise<TimelineData> =>
  fetchJson<TimelineData>('/data/timeline_events.json');
