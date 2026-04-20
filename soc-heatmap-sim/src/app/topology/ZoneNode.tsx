import type { Zone } from '../data/types';
import type { HeatSignal } from '../hooks/useModeStyling';
import type { HeatMode } from '../hooks/useIncidentState';

interface ZoneNodeProps {
  zone: Zone;
  selected: boolean;
  onSelect: (zoneId: string) => void;
  activeMode: HeatMode;
  modeSignal: HeatSignal;
}

export function ZoneNode({ zone, selected, onSelect, activeMode, modeSignal }: ZoneNodeProps) {
  const heatLevel = modeSignal.zoneIntensityById[zone.id] ?? 4;
  const hottest = Math.max(...Object.values(modeSignal.zoneIntensityById), 1);
  const normalized = heatLevel / hottest;
  const isContained = modeSignal.containedZones.includes(zone.id);

  return (
    <g className={`zone-node ${selected ? 'selected' : ''}`} onClick={() => onSelect(zone.id)}>
      <title>{`${zone.id} ${activeMode} ${Math.round(heatLevel)}`}</title>
      <circle
        cx={zone.x}
        cy={zone.y}
        r={34}
        className={`zone-glow ${activeMode.toLowerCase().replace(/\s+/g, '-')} ${normalized > 0.75 ? 'hot' : ''} ${isContained ? 'contained' : ''}`}
        style={{ opacity: 0.1 + normalized * 0.72 }}
      >
        {normalized > 0.7 ? <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3.2s" repeatCount="indefinite" /> : null}
      </circle>
      <circle cx={zone.x} cy={zone.y} r={24} className="zone-core" style={{ opacity: 0.38 + normalized * 0.62 }} />
      <circle cx={zone.x} cy={zone.y} r={12} className="zone-inner" />
      {isContained ? (
        <text x={zone.x + 20} y={zone.y - 19} className="containment-lock">
          🔒
        </text>
      ) : null}
      <text x={zone.x} y={zone.y + 48} textAnchor="middle" className="zone-label">
        {zone.label}
      </text>
    </g>
  );
}
