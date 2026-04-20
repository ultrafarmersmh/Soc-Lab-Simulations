import type { Zone } from '../data/types';

interface OPNsenseCoreProps {
  zone: Zone;
  selected: boolean;
  onSelect: (zoneId: string) => void;
}

export function OPNsenseCore({ zone, selected, onSelect }: OPNsenseCoreProps) {
  return (
    <g className={`opnsense-core ${selected ? 'selected' : ''}`} onClick={() => onSelect(zone.id)}>
      <circle cx={zone.x} cy={zone.y} r={52} className="opn-halo" />
      <circle cx={zone.x} cy={zone.y} r={38} className="opn-ring" />
      <circle cx={zone.x} cy={zone.y} r={24} className="opn-core" />
      <text x={zone.x} y={zone.y + 5} textAnchor="middle" className="opn-inner-label">
        OPN
      </text>
      <text x={zone.x} y={zone.y + 68} textAnchor="middle" className="zone-label">
        OPNsense
      </text>
    </g>
  );
}
