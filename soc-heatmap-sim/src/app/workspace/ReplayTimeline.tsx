import { phaseTimeline } from '../hooks/useIncidentState';

interface ReplayTimelineProps {
  currentTimestamp: number;
  maxTimestamp: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onScrub: (timestamp: number) => void;
  onPhaseJump: (phaseIndex: number) => void;
  activePhaseIndex: number;
  currentPhaseSeverity: 'moderate' | 'high';
}

export function ReplayTimeline({
  currentTimestamp,
  maxTimestamp,
  isPlaying,
  onTogglePlay,
  onReset,
  onScrub,
  onPhaseJump,
  activePhaseIndex,
  currentPhaseSeverity
}: ReplayTimelineProps) {
  const progress = maxTimestamp === 0 ? 0 : (currentTimestamp / maxTimestamp) * 100;

  return (
    <section className={`replay-timeline ${currentPhaseSeverity}`} aria-label="Timeline replay band">
      <div className="timeline-toolbar">
        <button type="button" className="play-toggle" onClick={onTogglePlay}>
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <button type="button" className="play-toggle secondary" onClick={onReset}>
          ↺
        </button>
        <span>Incident Timeline</span>
        <strong>
          {String(Math.floor(currentTimestamp / 60)).padStart(2, '0')}:{String(Math.floor(currentTimestamp % 60)).padStart(2, '0')}
        </strong>
      </div>

      <div className="timeline-track-wrap">
        <div className="timeline-track" style={{ ['--progress' as string]: `${progress}%` }}>
          {phaseTimeline.map((phase, index) => (
            <button
              key={phase.label}
              type="button"
              className={`timeline-point ${index < activePhaseIndex ? 'complete' : ''} ${index === activePhaseIndex ? 'current' : ''}`}
              style={{ left: `${(phase.start / maxTimestamp) * 100}%` }}
              onClick={() => onPhaseJump(index)}
            >
              <span>{phase.label}</span>
            </button>
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
