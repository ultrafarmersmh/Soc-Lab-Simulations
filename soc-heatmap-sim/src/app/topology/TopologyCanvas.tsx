import type { Asset, TopologyData } from '../data/types';
import type { HeatSignal } from '../hooks/useModeStyling';
import type { HeatMode } from '../hooks/useIncidentState';
import { BackgroundGrid } from './BackgroundGrid';
import { OPNsenseCore } from './OPNsenseCore';
import { TrafficLink } from './TrafficLink';
import { ZoneNode } from './ZoneNode';

interface TopologyCanvasProps {
  topology: TopologyData | null;
  isLoading: boolean;
  error: string | null;
  assets: Asset[];
  selectedZoneId: string;
  onZoneSelect: (zoneId: string) => void;
  activeMode: HeatMode;
  modeSignal: HeatSignal;
}

export function TopologyCanvas({
  topology,
  isLoading,
  error,
  assets,
  selectedZoneId,
  onZoneSelect,
  activeMode,
  modeSignal
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
  const labeledAssets = assets.filter((asset) => ['RDS-SRV01', 'WAZUH-01', 'NESSUS-01', 'OPENEDR-ENDPOINTS', 'THINCLIENTS-22'].includes(asset.id));

  return (
    <svg viewBox="0 0 960 420" className="topology-svg" role="img" aria-label="SOC topology map">
      <BackgroundGrid />
      {topology.links.map((link) => (
        <TrafficLink key={`${link.source}-${link.target}`} link={link} zones={topology.zones} activeMode={activeMode} modeSignal={modeSignal} />
      ))}
      {regularZones.map((zone) => (
        <ZoneNode
          key={zone.id}
          zone={zone}
          selected={selectedZoneId === zone.id}
          onSelect={onZoneSelect}
          activeMode={activeMode}
          modeSignal={modeSignal}
        />
      ))}
      {coreZone ? <OPNsenseCore zone={coreZone} selected={selectedZoneId === coreZone.id} onSelect={onZoneSelect} /> : null}

      {labeledAssets.map((asset) => {
        const zone = topology.zones.find((item) => item.id === asset.zone);
        if (!zone) return null;
        return (
          <text key={asset.id} x={zone.x + 28} y={zone.y - 24} className="asset-hint">
            {asset.id === 'NESSUS-01' ? 'Tenable scanner' : asset.id}
          </text>
        );
      })}
    </svg>
  );
}
