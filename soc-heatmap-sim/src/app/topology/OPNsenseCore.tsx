import type { Zone } from '../data/types';

interface OPNsenseCoreProps {
  zone: Zone;
}

export function OPNsenseCore({ zone }: OPNsenseCoreProps) {
  return (
    <g>
      <title>{`${zone.id} | ${zone.label} | tier: ${zone.tier}`}</title>
      <circle cx={zone.x} cy={zone.y} r={34} fill="#F97316" opacity={0.15} />
      <circle cx={zone.x} cy={zone.y} r={24} fill="#111827" stroke="#F97316" strokeWidth={3} />
      <text x={zone.x} y={zone.y + 4} textAnchor="middle" fill="#FDBA74" fontSize={10} fontWeight={700}>
        OPN
      </text>
      <text x={zone.x} y={zone.y + 40} textAnchor="middle" fill="#E5E7EB" fontSize={12}>
        OPNsense
      </text>
    </g>
  );
}
