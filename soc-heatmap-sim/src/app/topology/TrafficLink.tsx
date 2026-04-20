import type { Link, Zone } from '../data/types';
import { zoneById } from '../utils/zoneMath';

interface TrafficLinkProps {
  link: Link;
  zones: Zone[];
}

export function TrafficLink({ link, zones }: TrafficLinkProps) {
  const source = zoneById(zones, link.source);
  const target = zoneById(zones, link.target);

  if (!source || !target) {
    return null;
  }

  return (
    <line
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke="#6B7280"
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.8}
    />
  );
}
