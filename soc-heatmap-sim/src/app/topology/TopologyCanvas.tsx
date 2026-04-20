import type { TopologyData } from '../data/types';
import { OPNsenseCore } from './OPNsenseCore';
import { TrafficLink } from './TrafficLink';
import { ZoneNode } from './ZoneNode';

interface TopologyCanvasProps {
  topology: TopologyData | null;
  isLoading: boolean;
  error: string | null;
}

export function TopologyCanvas({ topology, isLoading, error }: TopologyCanvasProps) {
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
    <div>
      <h2>Pane A — Topology Map</h2>
      <svg viewBox="0 0 800 380" className="topology-svg" role="img" aria-label="SOC topology map">
        {topology.links.map((link) => (
          <TrafficLink key={`${link.source}-${link.target}`} link={link} zones={topology.zones} />
        ))}
        {regularZones.map((zone) => (
          <ZoneNode key={zone.id} zone={zone} />
        ))}
        {coreZone ? <OPNsenseCore zone={coreZone} /> : null}
      </svg>
    </div>
  );
}
