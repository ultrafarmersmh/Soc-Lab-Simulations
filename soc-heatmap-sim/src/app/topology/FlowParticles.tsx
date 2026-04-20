import type { Zone } from '../data/types';

interface FlowParticlesProps {
  source: Zone;
  target: Zone;
  active: boolean;
  intensity: number;
  routeId: string;
}

export function FlowParticles({ source, target, active, intensity, routeId }: FlowParticlesProps) {
  if (!active || intensity < 15) {
    return null;
  }

  const duration = Math.max(1.4, 4.2 - intensity / 32);

  return (
    <g>
      <circle r={2.4} className="flow-particle">
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" rotate="auto">
          <mpath href={`#${routeId}`} />
        </animateMotion>
      </circle>
      <circle r={1.8} className="flow-particle dim">
        <animateMotion dur={`${duration + 0.8}s`} repeatCount="indefinite" rotate="auto" begin="0.5s">
          <mpath href={`#${routeId}`} />
        </animateMotion>
      </circle>
      <circle cx={(source.x + target.x) / 2} cy={(source.y + target.y) / 2} r={2.2} className="flow-pulse">
        <animate attributeName="opacity" values="0.1;0.55;0.1" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}
