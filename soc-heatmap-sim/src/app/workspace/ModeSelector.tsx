import type { HeatMode } from '../hooks/useIncidentState';
import type { ModeLegend } from '../hooks/useModeStyling';

interface ModeSelectorProps {
  modes: HeatMode[];
  activeMode: HeatMode;
  onChange: (mode: HeatMode) => void;
  legend: ModeLegend;
}

export function ModeSelector({ modes, activeMode, onChange, legend }: ModeSelectorProps) {
  return (
    <div className="mode-selector-wrap">
      <div className="mode-selector" role="tablist" aria-label="Environment map mode selector">
        {modes.map((mode) => (
          <button
            type="button"
            key={mode}
            className={`mode-pill ${activeMode === mode ? 'active' : ''}`}
            onClick={() => onChange(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="mode-legend" style={{ ['--legend-accent' as string]: legend.accent }}>
        <strong>{legend.title}</strong>
        <span>{legend.lowLabel}</span>
        <span>{legend.highLabel}</span>
      </div>
    </div>
  );
}
