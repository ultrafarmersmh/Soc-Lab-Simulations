import type { TimelineEvent, TopologyData } from '../data/types';
import { BackgroundGrid } from './BackgroundGrid';
import { OPNsenseCore } from './OPNsenseCore';
import { TrafficLink } from './TrafficLink';
import { ZoneNode } from './ZoneNode';

interface TopologyCanvasProps {
  topology: TopologyData | null;
  isLoading: boolean;
  error: string | null;
  activeEvents: TimelineEvent[];
  selectedZoneId: string;
  onZoneSelect: (zoneId: string) => void;
}

export function TopologyCanvas({
  topology,
  isLoading,
  error,
  activeEvents,
  selectedZoneId,
  onZoneSelect
}: TopologyCanvasProps) {
  if (isLoading) {
    return <div className="placeholder-card">Loading topology…</div>;
  }

  if (error) {
    return <div className="placeholder-card error">{error}</div>;
  }

  if (!topology) {
    return <div className="placeholder-card">No topology loaded.</div>;
  }

  const coreZone = topology.zones.find((zone) => zone.id === 'OPNSENSE');
  const regularZones = topology.zones.filter((zone) => zone.id !== 'OPNSENSE');

  return (
    <svg viewBox="0 0 960 420" className="topology-svg" role="img" aria-label="SOC topology map">
      <BackgroundGrid />
      {topology.links.map((link) => (
        <TrafficLink key={`${link.source}-${link.target}`} link={link} zones={topology.zones} activeEvents={activeEvents} />
      ))}
      {regularZones.map((zone) => (
        <ZoneNode
          key={zone.id}
          zone={zone}
          activeEvents={activeEvents}
          selected={selectedZoneId === zone.id}
          onSelect={onZoneSelect}
        />
      ))}
      {coreZone ? <OPNsenseCore zone={coreZone} selected={selectedZoneId === coreZone.id} onSelect={onZoneSelect} /> : null}
    </svg>
  );
}
