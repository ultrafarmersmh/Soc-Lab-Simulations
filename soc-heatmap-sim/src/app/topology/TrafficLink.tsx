import type { Link, TimelineEvent, Zone } from '../data/types';
import { zoneById } from '../utils/zoneMath';
import { FlowParticles } from './FlowParticles';

interface TrafficLinkProps {
  link: Link;
  zones: Zone[];
  activeEvents: TimelineEvent[];
}

export function TrafficLink({ link, zones, activeEvents }: TrafficLinkProps) {
  const source = zoneById(zones, link.source);
  const target = zoneById(zones, link.target);

  if (!source || !target) {
    return null;
  }

  const routeKey = `${link.source}->${link.target}`;
  const reverseRouteKey = `${link.target}->${link.source}`;
  const intensity = activeEvents.reduce((max, event) => {
    const routeTraffic = event.metrics.zoneTraffic?.[routeKey] ?? event.metrics.zoneTraffic?.[reverseRouteKey] ?? 0;
    return Math.max(max, routeTraffic);
  }, 0);

  const isActive = intensity > 0;

  return (
    <g>
      <line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        className={`traffic-link ${isActive ? 'active' : ''} ${intensity > 70 ? 'hot' : ''}`}
        strokeWidth={isActive ? 2 + intensity / 30 : 2}
      />
      <FlowParticles source={source} target={target} active={isActive} />
    </g>
  );
}
