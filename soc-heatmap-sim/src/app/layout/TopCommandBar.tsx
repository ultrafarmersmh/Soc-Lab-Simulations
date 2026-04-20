import { KPIChip } from '../metrics/KPIChip';

interface TopCommandBarProps {
  title: string;
  subtitle: string;
  scenarioLabel: string;
  kpis: Array<{
    label: string;
    value: string;
    delta: number;
    state: 'normal' | 'elevated' | 'critical';
    priority: 'primary' | 'secondary';
  }>;
  replayClock: string;
  replayStatus: string;
  playState: string;
  phaseSummary: {
    phase: string;
    impactedZone: string;
    severity: string;
    controlState: string;
  };
}

export function TopCommandBar({
  title,
  subtitle,
  scenarioLabel,
  kpis,
  replayClock,
  replayStatus,
  playState,
  phaseSummary
}: TopCommandBarProps) {
  return (
    <header className="top-command-bar" aria-label="Top command status bar">
      <div className="command-title-block">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="phase-summary" aria-label="Phase and status summary">
        <strong>{phaseSummary.phase}</strong>
        <span>Zone: {phaseSummary.impactedZone}</span>
        <span>Severity: {phaseSummary.severity}</span>
        <span>Control: {phaseSummary.controlState}</span>
      </div>

      <div className="command-kpi-row">
        <span className="scenario-pill">{scenarioLabel}</span>
        {kpis.map((kpi) => (
          <KPIChip
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            state={kpi.state}
            priority={kpi.priority}
          />
        ))}
      </div>

      <div className="replay-widget">
        <strong>{replayClock}</strong>
        <span>{replayStatus}</span>
        <em>{playState}</em>
      </div>
    </header>
  );
}
