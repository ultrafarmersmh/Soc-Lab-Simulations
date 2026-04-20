export interface SimulationSnapshot {
  timestamp: number;
}

export function createInitialSnapshot(): SimulationSnapshot {
  return { timestamp: 0 };
}
