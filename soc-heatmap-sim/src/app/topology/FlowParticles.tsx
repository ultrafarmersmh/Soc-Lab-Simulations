import type { Zone } from '../data/types';

interface FlowParticlesProps {
  source: Zone;
  target: Zone;
  active: boolean;
}

export function FlowParticles({ source, target, active }: FlowParticlesProps) {
  if (!active) {
    return null;
  }

  return (
    <circle cx={(source.x + target.x) / 2} cy={(source.y + target.y) / 2} r={3} className="flow-particle">
      <animate attributeName="r" values="2;4;2" dur="2.2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.2;1;0.2" dur="2.2s" repeatCount="indefinite" />
    </circle>
  );
}
