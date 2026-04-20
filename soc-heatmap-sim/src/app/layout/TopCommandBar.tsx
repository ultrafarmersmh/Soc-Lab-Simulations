import { KPIChip } from '../metrics/KPIChip';

interface TopCommandBarProps {
  title: string;
  subtitle: string;
  scenarioLabel: string;
  kpis: Array<{ label: string; value: string }>;
  replayClock: string;
  replayStatus: string;
  playState: string;
}

export function TopCommandBar({
  title,
  subtitle,
  scenarioLabel,
  kpis,
  replayClock,
  replayStatus,
  playState
}: TopCommandBarProps) {
  return (
    <header className="top-command-bar" aria-label="Top command status bar">
      <div className="command-title-block">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="command-kpi-row">
        <span className="scenario-pill">{scenarioLabel}</span>
        {kpis.map((kpi) => (
          <KPIChip key={kpi.label} label={kpi.label} value={kpi.value} />
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
