interface ModeSelectorProps {
  modes: string[];
  activeMode: string;
  onChange: (mode: string) => void;
}

export function ModeSelector({ modes, activeMode, onChange }: ModeSelectorProps) {
  return (
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
  );
}
