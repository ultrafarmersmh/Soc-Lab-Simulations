import type { Link, Zone } from '../data/types';
import type { HeatSignal } from '../hooks/useModeStyling';
import type { HeatMode } from '../hooks/useIncidentState';
import { zoneById } from '../utils/zoneMath';
import { FlowParticles } from './FlowParticles';

interface TrafficLinkProps {
  link: Link;
  zones: Zone[];
  activeMode: HeatMode;
  modeSignal: HeatSignal;
}

export function TrafficLink({ link, zones, activeMode, modeSignal }: TrafficLinkProps) {
  const source = zoneById(zones, link.source);
  const target = zoneById(zones, link.target);

  if (!source || !target) {
    return null;
  }

  const routeKey = `${link.source}->${link.target}`;
  const reverseRouteKey = `${link.target}->${link.source}`;
  const intensity = modeSignal.linkIntensityByRoute[routeKey] ?? modeSignal.linkIntensityByRoute[reverseRouteKey] ?? 4;
  const isContained = modeSignal.containedRoutes.includes(routeKey) || modeSignal.containedRoutes.includes(reverseRouteKey);
  const isActive = intensity > 12;
  const pathId = `route-${link.source}-${link.target}`;

  return (
    <g>
      <line
        id={pathId}
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        className={`traffic-link ${activeMode.toLowerCase().replace(/\s+/g, '-')} ${isActive ? 'active' : 'inactive'} ${isContained ? 'contained' : ''}`}
        strokeWidth={isContained ? 1.6 : Math.max(1.2, intensity / 22)}
      />
      <FlowParticles source={source} target={target} active={isActive && !isContained} intensity={intensity} routeId={pathId} />
      {isContained ? (
        <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 6} textAnchor="middle" className="containment-mark">
          ⛔
        </text>
      ) : null}
    </g>
  );
}
