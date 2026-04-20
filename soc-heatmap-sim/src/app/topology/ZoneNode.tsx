import type { TimelineEvent, Zone } from '../data/types';

interface ZoneNodeProps {
  zone: Zone;
  activeEvents: TimelineEvent[];
  selected: boolean;
  onSelect: (zoneId: string) => void;
}

export function ZoneNode({ zone, activeEvents, selected, onSelect }: ZoneNodeProps) {
  const heatLevel = activeEvents.reduce((max, event) => Math.max(max, event.metrics.heatZones?.[zone.id] ?? 0), 0);

  return (
    <g className={`zone-node ${selected ? 'selected' : ''}`} onClick={() => onSelect(zone.id)}>
      <title>{`${zone.id} heat ${heatLevel}`}</title>
      <circle cx={zone.x} cy={zone.y} r={34} className="zone-glow" style={{ opacity: 0.25 + heatLevel / 140 }} />
      <circle cx={zone.x} cy={zone.y} r={24} className="zone-core" />
      <circle cx={zone.x} cy={zone.y} r={12} className="zone-inner" />
      <text x={zone.x} y={zone.y + 48} textAnchor="middle" className="zone-label">
        {zone.label}
      </text>
    </g>
  );
}
