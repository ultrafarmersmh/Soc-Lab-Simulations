const phasePoints = [
  { label: 'Baseline', timestamp: 0 },
  { label: 'Scan Detected', timestamp: 35 },
  { label: 'Escalation', timestamp: 55 },
  { label: 'Containment', timestamp: 75 },
  { label: 'Recovery', timestamp: 95 }
];

interface ReplayTimelineProps {
  currentTimestamp: number;
  maxTimestamp: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onScrub: (timestamp: number) => void;
}

export function ReplayTimeline({ currentTimestamp, maxTimestamp, isPlaying, onTogglePlay, onScrub }: ReplayTimelineProps) {
  const progress = maxTimestamp === 0 ? 0 : (currentTimestamp / maxTimestamp) * 100;

  return (
    <section className="replay-timeline" aria-label="Timeline replay band">
      <div className="timeline-toolbar">
        <button type="button" className="play-toggle" onClick={onTogglePlay}>
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <span>Timeline</span>
        <strong>
          {String(Math.floor(currentTimestamp / 60)).padStart(2, '0')}:{String(Math.floor(currentTimestamp % 60)).padStart(2, '0')}
        </strong>
      </div>

      <div className="timeline-track-wrap">
        <div className="timeline-track" style={{ ['--progress' as string]: `${progress}%` }}>
          {phasePoints.map((phase) => (
            <div
              key={phase.label}
              className={`timeline-point ${currentTimestamp >= phase.timestamp ? 'active' : ''}`}
              style={{ left: `${(phase.timestamp / maxTimestamp) * 100}%` }}
            >
              <span>{phase.label}</span>
            </div>
          ))}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={maxTimestamp}
        value={currentTimestamp}
        onChange={(event) => onScrub(Number(event.target.value))}
      />
    </section>
  );
}
