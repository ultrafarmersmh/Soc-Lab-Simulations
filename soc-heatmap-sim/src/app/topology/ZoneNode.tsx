import type { Zone } from '../data/types';
import { tierColor } from '../utils/colorScale';

interface ZoneNodeProps {
  zone: Zone;
}

export function ZoneNode({ zone }: ZoneNodeProps) {
  return (
    <g>
      <title>{`${zone.id} | ${zone.label} | tier: ${zone.tier}`}</title>
      <circle cx={zone.x} cy={zone.y} r={28} fill={tierColor(zone.tier)} opacity={0.2} />
      <circle cx={zone.x} cy={zone.y} r={20} fill="#111827" stroke={tierColor(zone.tier)} strokeWidth={2} />
      <text x={zone.x} y={zone.y + 38} textAnchor="middle" fill="#D1D5DB" fontSize={12}>
        {zone.label}
      </text>
    </g>
  );
}
